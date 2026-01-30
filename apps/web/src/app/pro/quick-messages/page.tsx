'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { templatesApi } from '@ozar/shared/apiClient';
import { MessageSquare, Plus, Edit2, Trash2, Save, Copy, Check } from 'lucide-react';

interface QuickMessage {
  id: string;
  title: string;
  message: string;
}

export default function QuickMessagesPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<QuickMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: '', message: '' });
  const [saving, setSaving] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'PRO') {
      router.push('/');
      return;
    }
    loadMessages();
  }, [isAuthenticated, user]);

  const loadMessages = async () => {
    try {
      const data = await templatesApi.getQuickMessages();
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load quick messages:', error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (message: QuickMessage) => {
    setEditingId(message.id);
    setEditForm({ title: message.title, message: message.message });
  };

  const saveEdit = async () => {
    if (!editForm.title.trim() || !editForm.message.trim()) {
      alert('Please fill in both title and message');
      return;
    }

    setSaving(true);
    try {
      if (editingId === 'new') {
        await templatesApi.createQuickMessage(editForm);
      } else {
        await templatesApi.updateQuickMessage(editingId!, editForm);
      }
      await loadMessages();
      setEditingId(null);
      setEditForm({ title: '', message: '' });
    } catch (error: any) {
      console.error('Failed to save message:', error);
      alert(error.message || 'Failed to save message');
    } finally {
      setSaving(false);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this quick message?')) {
      return;
    }

    try {
      await templatesApi.deleteQuickMessage(id);
      await loadMessages();
    } catch (error: any) {
      console.error('Failed to delete message:', error);
      alert(error.message || 'Failed to delete message');
    }
  };

  const addNew = () => {
    setEditingId('new');
    setEditForm({ title: '', message: '' });
    setMessages(prev => [{ id: 'new', title: '', message: '' }, ...prev]);
  };

  const cancelEdit = () => {
    if (editingId === 'new') {
      setMessages(prev => prev.filter(m => m.id !== 'new'));
    }
    setEditingId(null);
    setEditForm({ title: '', message: '' });
  };

  const copyToClipboard = async (message: string, id: string) => {
    try {
      await navigator.clipboard.writeText(message);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-teal-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                <MessageSquare className="w-8 h-8 text-teal-600" />
                Quick Messages
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Create message templates for faster communication with customers
              </p>
            </div>
            <button
              onClick={addNew}
              disabled={editingId === 'new'}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-5 h-5" />
              Add Template
            </button>
          </div>
        </div>

        {messages.length === 0 && !editingId ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-200 dark:border-gray-700">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              No quick messages yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Create templates to respond faster to common customer inquiries
            </p>
            <button
              onClick={addNew}
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold transition"
            >
              <Plus className="w-5 h-5" />
              Create Your First Template
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all"
              >
                {editingId === message.id ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Template Title
                      </label>
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        placeholder="e.g., Booking Confirmation"
                        maxLength={100}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Message Content
                      </label>
                      <textarea
                        value={editForm.message}
                        onChange={(e) => setEditForm({ ...editForm, message: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
                        placeholder="Enter your message template..."
                        maxLength={500}
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {editForm.message.length}/500 characters
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={saveEdit}
                        disabled={saving || !editForm.title.trim() || !editForm.message.trim()}
                        className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Save className="w-4 h-4" />
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={cancelEdit}
                        disabled={saving}
                        className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold transition disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                          {message.title}
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300">
                          {message.message}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => copyToClipboard(message.message, message.id)}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                          title="Copy to clipboard"
                        >
                          {copiedId === message.id ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => startEdit(message)}
                          className="p-2 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteMessage(message.id)}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
          <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Tips for Quick Messages
          </h3>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
            <li>• Keep messages professional and friendly</li>
            <li>• Include specific details when possible (e.g., arrival time)</li>
            <li>• Create templates for common scenarios (confirmations, delays, completions)</li>
            <li>• Review and update templates regularly to keep them relevant</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}
