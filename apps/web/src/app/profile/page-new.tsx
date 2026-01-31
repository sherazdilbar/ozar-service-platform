'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';
import ProfilePictureUpload from '@/components/ProfilePictureUpload';
import { 
  User, Mail, Phone, MapPin, Shield, Lock, Bell, Heart,
  Save, ArrowLeft, CheckCircle, AlertCircle, Trash2, Star,
  Plus, Edit2
} from 'lucide-react';

export default function CustomerProfilePageNew() {
  const { user, isAuthenticated, updateUser } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'personal' | 'addresses' | 'security' | 'notifications' | 'favorites'>('personal');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailBookingConfirmations: true,
    emailServiceReminders: true,
    emailProfessionalMessages: true,
    emailPromotionalOffers: false,
    emailNewsletter: false,
    pushNewMessages: true,
    pushBookingUpdates: true,
    pushProfessionalResponses: true,
  });

  const [addresses, setAddresses] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [stats, setStats] = useState({
    servicesBooked: 0,
    reviewsGiven: 0,
    favoritesCount: 0,
  });

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'CUSTOMER') {
      router.push('/');
      return;
    }
    loadProfile();
  }, [isAuthenticated, user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      if (user) {
        setFormData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          phone: user.phone || '',
        });
      }
      
      // Load stats, addresses, favorites
      await Promise.all([
        loadStats(),
        loadAddresses(),
        loadFavorites(),
      ]);
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const bookings = await response.json();
        const completedBookings = bookings.filter((b: any) => b.status === 'COMPLETED');
        const reviewedBookings = bookings.filter((b: any) => b.review);
        setStats({
          servicesBooked: completedBookings.length,
          reviewsGiven: reviewedBookings.length,
          favoritesCount: favorites.length,
        });
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const loadAddresses = async () => {
    // TODO: Implement when backend endpoint is ready
    setAddresses([]);
  };

  const loadFavorites = async () => {
    // TODO: Implement when backend endpoint is ready
    setFavorites([]);
  };

  const handlePersonalInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      const updatedUser = await response.json();
      updateUser(updatedUser);
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      console.error('Update error:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to change password');
      }

      toast.success('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      console.error('Password change error:', error);
      toast.error(error.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = (avatarUrl: string) => {
    if (user) {
      updateUser({ ...user, avatar: avatarUrl });
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    const confirmText = prompt('Type "DELETE" to confirm account deletion:');
    if (confirmText !== 'DELETE') {
      toast.error('Account deletion cancelled');
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to delete account');

      toast.success('Account deleted successfully');
      localStorage.clear();
      router.push('/');
    } catch (error: any) {
      console.error('Delete account error:', error);
      toast.error(error.message || 'Failed to delete account');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-700 dark:text-gray-300 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'favorites', label: 'Favorites', icon: Heart },
  ];

  const memberSince = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-teal-500 to-cyan-600 rounded-2xl p-8 mb-6 text-white shadow-xl">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <ProfilePictureUpload
              currentAvatar={user.avatar}
              onUploadSuccess={handleAvatarUpload}
              userName={`${user.firstName} ${user.lastName}`}
              size="xl"
            />
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-teal-100 mb-4">{user.email}</p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Customer Account
                </span>
                <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                  Member since {memberSince}
                </span>
              </div>
            </div>
            <div className="flex gap-6 text-center">
              <div>
                <div className="text-3xl font-bold">{stats.servicesBooked}</div>
                <div className="text-sm text-teal-100">Services Booked</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{stats.reviewsGiven}</div>
                <div className="text-sm text-teal-100">Reviews Given</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{stats.favoritesCount}</div>
                <div className="text-sm text-teal-100">Favorites</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm sticky top-24">
              <div className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        isActive
                          ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="flex-1 text-left font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-12 lg:col-span-9">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
              <div className="p-8">
                {/* Personal Info Tab */}
                {activeTab === 'personal' && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        Personal Information
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">Update your personal details</p>
                    </div>

                    <form onSubmit={handlePersonalInfoSubmit} className="space-y-6 max-w-2xl">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            First Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Email Address
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="email"
                              value={user.email}
                              disabled
                              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400 rounded-xl cursor-not-allowed"
                            />
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Email cannot be changed
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Phone Number *
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="tel"
                              required
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                              placeholder="+36 20 123 4567"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
                        <button
                          type="submit"
                          disabled={saving}
                          className="flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                        >
                          {saving ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                              <span>Saving...</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-5 h-5" />
                              <span>Save Changes</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Addresses Tab */}
                {activeTab === 'addresses' && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                            <MapPin className="w-6 h-6 text-white" />
                          </div>
                          Saved Addresses
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">Manage your delivery and service addresses</p>
                      </div>
                      <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold transition">
                        <Plus className="w-5 h-5" />
                        Add Address
                      </button>
                    </div>

                    {addresses.length === 0 ? (
                      <div className="text-center py-20 bg-gray-50 dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                        <div className="text-6xl mb-4">📍</div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No saved addresses</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">Add your addresses for faster booking</p>
                        <button className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold transition">
                          Add Your First Address
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {addresses.map((address: any) => (
                          <div key={address.id} className="p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-teal-500 dark:hover:border-teal-500 transition">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="px-3 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-sm font-semibold">
                                    {address.label}
                                  </span>
                                  {address.isDefault && (
                                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-semibold flex items-center gap-1">
                                      <CheckCircle className="w-4 h-4" />
                                      Default
                                    </span>
                                  )}
                                </div>
                                <p className="text-gray-900 dark:text-white font-medium">{address.address}</p>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">{address.city}</p>
                              </div>
                              <div className="flex gap-2">
                                <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition">
                                  <Edit2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                </button>
                                <button className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition">
                                  <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                                </button>
                              </div>
                            </div>
                            {!address.isDefault && (
                              <button className="mt-4 text-sm text-teal-600 dark:text-teal-400 hover:underline font-medium">
                                Set as Default
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                          <Lock className="w-6 h-6 text-white" />
                        </div>
                        Security Settings
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">Manage your password and account security</p>
                    </div>

                    {/* Change Password */}
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border-2 border-blue-100 dark:border-blue-800 max-w-2xl">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Change Password</h3>
                      <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Current Password *
                          </label>
                          <input
                            type="password"
                            required
                            value={passwordForm.currentPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            New Password *
                          </label>
                          <input
                            type="password"
                            required
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Confirm New Password *
                          </label>
                          <input
                            type="password"
                            required
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                          />
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Password Requirements:</p>
                          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                            <li className="flex items-center gap-2">
                              <CheckCircle className={`w-4 h-4 ${passwordForm.newPassword.length >= 8 ? 'text-green-600' : 'text-gray-400'}`} />
                              At least 8 characters
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className={`w-4 h-4 ${/[A-Z]/.test(passwordForm.newPassword) ? 'text-green-600' : 'text-gray-400'}`} />
                              One uppercase letter
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className={`w-4 h-4 ${/[0-9]/.test(passwordForm.newPassword) ? 'text-green-600' : 'text-gray-400'}`} />
                              One number
                            </li>
                          </ul>
                        </div>

                        <button
                          type="submit"
                          disabled={saving}
                          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {saving ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                              <span>Changing Password...</span>
                            </>
                          ) : (
                            <>
                              <Lock className="w-5 h-5" />
                              <span>Change Password</span>
                            </>
                          )}
                        </button>
                      </form>
                    </div>

                    {/* Delete Account */}
                    <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-2xl p-6 border-2 border-red-200 dark:border-red-800 max-w-2xl">
                      <h3 className="text-lg font-bold text-red-900 dark:text-red-300 mb-2 flex items-center gap-2">
                        <AlertCircle className="w-6 h-6" />
                        Delete Account
                      </h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                      <button
                        onClick={handleDeleteAccount}
                        disabled={saving}
                        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <Trash2 className="w-5 h-5" />
                        Delete My Account
                      </button>
                    </div>
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                          <Bell className="w-6 h-6 text-white" />
                        </div>
                        Notification Preferences
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">Choose how you want to be notified</p>
                    </div>

                    <div className="space-y-6 max-w-2xl">
                      {/* Email Notifications */}
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-6 border-2 border-blue-100 dark:border-blue-800">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                          <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                          Email Notifications
                        </h3>
                        <div className="space-y-4">
                          {[
                            { key: 'emailBookingConfirmations', label: 'Booking Confirmations', description: 'Get notified when your booking is confirmed' },
                            { key: 'emailServiceReminders', label: 'Service Reminders', description: 'Reminders before your scheduled service' },
                            { key: 'emailProfessionalMessages', label: 'Professional Messages', description: 'When a professional sends you a message' },
                            { key: 'emailPromotionalOffers', label: 'Promotional Offers', description: 'Special deals and discounts' },
                            { key: 'emailNewsletter', label: 'Newsletter', description: 'Monthly updates and tips' },
                          ].map((item) => (
                            <label key={item.key} className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer">
                              <input
                                type="checkbox"
                                checked={notificationSettings[item.key as keyof typeof notificationSettings]}
                                onChange={(e) => setNotificationSettings({ ...notificationSettings, [item.key]: e.target.checked })}
                                className="mt-1 w-5 h-5 text-teal-600 rounded focus:ring-2 focus:ring-teal-500"
                              />
                              <div className="flex-1">
                                <div className="font-semibold text-gray-900 dark:text-white">{item.label}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">{item.description}</div>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Push Notifications */}
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border-2 border-purple-100 dark:border-purple-800">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                          <Bell className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                          Push Notifications
                        </h3>
                        <div className="space-y-4">
                          {[
                            { key: 'pushNewMessages', label: 'New Messages', description: 'Instant alerts for new messages' },
                            { key: 'pushBookingUpdates', label: 'Booking Updates', description: 'Status changes on your bookings' },
                            { key: 'pushProfessionalResponses', label: 'Professional Responses', description: 'When a professional responds to your request' },
                          ].map((item) => (
                            <label key={item.key} className="flex items-start gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer">
                              <input
                                type="checkbox"
                                checked={notificationSettings[item.key as keyof typeof notificationSettings]}
                                onChange={(e) => setNotificationSettings({ ...notificationSettings, [item.key]: e.target.checked })}
                                className="mt-1 w-5 h-5 text-teal-600 rounded focus:ring-2 focus:ring-teal-500"
                              />
                              <div className="flex-1">
                                <div className="font-semibold text-gray-900 dark:text-white">{item.label}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">{item.description}</div>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
                        <button
                          onClick={() => toast.success('Notification preferences saved!')}
                          className="flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 active:scale-95 shadow-lg"
                        >
                          <Save className="w-5 h-5" />
                          Save Preferences
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Favorites Tab */}
                {activeTab === 'favorites' && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-red-600 rounded-xl flex items-center justify-center">
                          <Heart className="w-6 h-6 text-white" />
                        </div>
                        Favorite Professionals
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">Your trusted service providers</p>
                    </div>

                    {favorites.length === 0 ? (
                      <div className="text-center py-20 bg-gray-50 dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                        <div className="text-6xl mb-4">❤️</div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No favorites yet</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">Save your favorite professionals for quick access</p>
                        <button
                          onClick={() => router.push('/search')}
                          className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold transition"
                        >
                          Browse Professionals
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favorites.map((pro: any) => (
                          <div key={pro.id} className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-teal-500 dark:hover:border-teal-500 transition overflow-hidden group">
                            <div className="p-6">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white text-xl font-bold">
                                    {pro.user?.firstName?.[0]}{pro.user?.lastName?.[0]}
                                  </div>
                                  <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white">
                                      {pro.user?.firstName} {pro.user?.lastName}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{pro.businessName}</p>
                                  </div>
                                </div>
                                <button className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition">
                                  <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                                </button>
                              </div>

                              <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center gap-1">
                                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                  <span className="font-bold text-gray-900 dark:text-white">{pro.rating.toFixed(1)}</span>
                                  <span className="text-sm text-gray-600 dark:text-gray-400">({pro.reviewCount})</span>
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  {pro.jobsCompleted} jobs together
                                </div>
                              </div>

                              <button
                                onClick={() => router.push(`/pros/${pro.id}`)}
                                className="w-full px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold transition-all transform group-hover:scale-105"
                              >
                                Book Again
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
