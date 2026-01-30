'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getBookings } from '@ozar/shared';
import { Users, Search, Star, Calendar, MessageSquare, Phone, Mail } from 'lucide-react';
import Avatar from '@/components/Avatar';

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  totalBookings: number;
  completedBookings: number;
  totalSpent: number;
  lastBooking?: string;
  averageRating?: number;
}

export default function ProCustomersPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'PRO') {
      router.push('/');
      return;
    }
    loadCustomers();
  }, [isAuthenticated, user]);

  const loadCustomers = async () => {
    if (!user) return;
    
    try {
      // Get all bookings for this pro
      const bookings = await getBookings(user.id, 'pro');
      
      // Group bookings by customer
      const customerMap = new Map<string, Customer>();
      
      bookings.forEach((booking) => {
        const customerId = booking.customer.id;
        
        if (!customerMap.has(customerId)) {
          customerMap.set(customerId, {
            id: customerId,
            firstName: booking.customer.firstName,
            lastName: booking.customer.lastName,
            email: booking.customer.email,
            phone: booking.customer.phone,
            avatar: booking.customer.avatar,
            totalBookings: 0,
            completedBookings: 0,
            totalSpent: 0,
          });
        }
        
        const customer = customerMap.get(customerId)!;
        customer.totalBookings++;
        
        if (booking.status === 'COMPLETED') {
          customer.completedBookings++;
          customer.totalSpent += booking.pricing.servicePrice;
          
          if (!customer.lastBooking || new Date(booking.completedAt!) > new Date(customer.lastBooking)) {
            customer.lastBooking = booking.completedAt!;
          }
        }
      });
      
      setCustomers(Array.from(customerMap.values()).sort((a, b) => b.totalBookings - a.totalBookings));
    } catch (error) {
      console.error('Failed to load customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const query = searchQuery.toLowerCase();
    return (
      customer.firstName.toLowerCase().includes(query) ||
      customer.lastName.toLowerCase().includes(query) ||
      customer.email.toLowerCase().includes(query)
    );
  });

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
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <Users className="w-8 h-8 text-teal-600" />
            My Customers
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage your customer relationships
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 dark:text-gray-400">Total Customers</span>
              <Users className="w-5 h-5 text-teal-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{customers.length}</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 dark:text-gray-400">Total Bookings</span>
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {customers.reduce((sum, c) => sum + c.totalBookings, 0)}
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 dark:text-gray-400">Repeat Customers</span>
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {customers.filter(c => c.totalBookings > 1).length}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search customers..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
        </div>

        {filteredCustomers.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-200 dark:border-gray-700">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {searchQuery ? 'No customers found' : 'No customers yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery 
                ? 'Try adjusting your search query'
                : 'Complete your first booking to start building your customer base'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCustomers.map((customer) => (
              <div
                key={customer.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all"
              >
                <div className="flex gap-4 mb-4">
                  <Avatar
                    imageUrl={customer.avatar}
                    name={`${customer.firstName} ${customer.lastName}`}
                    size={64}
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                      {customer.firstName} {customer.lastName}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
                      <Mail className="w-4 h-4" />
                      <span>{customer.email}</span>
                    </div>
                    {customer.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
                        <Phone className="w-4 h-4" />
                        <span>{customer.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                      {customer.totalBookings}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Bookings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {customer.completedBookings}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {customer.totalSpent.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Total Spent</div>
                  </div>
                </div>

                {customer.lastBooking && (
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Last booking: {new Date(customer.lastBooking).toLocaleDateString()}
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/chat?customerId=${customer.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Message
                  </button>
                  <button
                    onClick={() => router.push(`/bookings?customerId=${customer.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                  >
                    <Calendar className="w-4 h-4" />
                    History
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
