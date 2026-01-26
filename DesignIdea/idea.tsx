import { useState } from 'react';
import {
  Search,
  MapPin,
  Star,
  Shield,
  Clock,
  Users,
  ChevronRight,
  Heart,
  MessageSquare,
  MapIcon,
  LayoutList,
  Filter,
  CheckCircle,
  Zap,
} from 'lucide-react';

interface Professional {
  id: number;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  jobs: number;
  location: string;
  distance: string;
  description: string;
  available: boolean;
  responseTime: string;
  badge: 'verified' | 'toprated' | 'quickresponse';
  price: string;
  image: string;
}

interface Category {
  id: number;
  name: string;
  icon: React.ReactNode;
  count: number;
}

function App() {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories: Category[] = [
    { id: 1, name: 'Cleaning', icon: '🧹', count: 342 },
    { id: 2, name: 'Plumbing', icon: '🔧', count: 128 },
    { id: 3, name: 'Electrical', icon: '⚡', count: 97 },
    { id: 4, name: 'HVAC', icon: '❄️', count: 64 },
    { id: 5, name: 'Painting', icon: '🎨', count: 156 },
    { id: 6, name: 'Landscaping', icon: '🌿', count: 213 },
    { id: 7, name: 'Carpentry', icon: '🪵', count: 89 },
    { id: 8, name: 'Roofing', icon: '🏠', count: 52 },
  ];

  const professionals: Professional[] = [
    {
      id: 1,
      name: 'Safe Gas Services',
      category: 'Gas Heater Repair',
      rating: 4.8,
      reviews: 67,
      jobs: 189,
      location: 'Karachi',
      distance: '2.3 km',
      description: 'Certified gas heater technician. Installation, repair, and maintenance of all gas heating systems.',
      available: true,
      responseTime: '2 hours',
      badge: 'verified',
      price: 'From $50/hour',
      image: 'S',
    },
    {
      id: 2,
      name: 'Sparkle Clean Services',
      category: 'Professional Cleaner',
      rating: 4.9,
      reviews: 203,
      jobs: 567,
      location: 'Karachi',
      distance: '1.8 km',
      description: 'Professional cleaning services for homes and offices. Deep cleaning, regular maintenance.',
      available: true,
      responseTime: '1 hour',
      badge: 'toprated',
      price: 'From $35/hour',
      image: 'S',
    },
    {
      id: 3,
      name: 'ProMax Plumbing',
      category: 'Plumber',
      rating: 4.7,
      reviews: 145,
      jobs: 312,
      location: 'Karachi',
      distance: '3.1 km',
      description: 'Expert plumbing services. Pipe repairs, installations, and emergency fixes available 24/7.',
      available: true,
      responseTime: '30 mins',
      badge: 'quickresponse',
      price: 'From $60/hour',
      image: 'P',
    },
    {
      id: 4,
      name: 'ElectroTech Solutions',
      category: 'Electrician',
      rating: 4.6,
      reviews: 98,
      jobs: 256,
      location: 'Karachi',
      distance: '2.7 km',
      description: 'All electrical work. Wiring, installations, troubleshooting, and safety inspections.',
      available: false,
      responseTime: '4 hours',
      badge: 'verified',
      price: 'From $55/hour',
      image: 'E',
    },
  ];

  const getBadgeLabel = (badge: string) => {
    switch (badge) {
      case 'verified':
        return 'Verified';
      case 'toprated':
        return 'Top Rated';
      case 'quickresponse':
        return 'Quick Response';
      default:
        return '';
    }
  };

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case 'verified':
        return <Shield className="w-4 h-4" />;
      case 'toprated':
        return <Star className="w-4 h-4" />;
      case 'quickresponse':
        return <Zap className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">O</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Ozar</h1>
                <p className="text-xs text-gray-500">Find Local Pros</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <a href="#" className="text-sm text-gray-700 hover:text-gray-900">How it works</a>
              <a href="#" className="text-sm text-gray-700 hover:text-gray-900">Trust & Safety</a>
            </nav>

            <div className="flex items-center gap-3">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition">
                Log in
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition">
                Sign Up
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition flex items-center gap-2">
                <span>Become a Pro</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                Find trusted local professionals for any project
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Connect with verified, highly-rated service professionals. Book instantly, pay safely, and get the job done right.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-teal-600" />
                  <span className="text-sm text-gray-700">10,000+ Pros</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-teal-600" />
                  <span className="text-sm text-gray-700">50,000+ Reviews</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-teal-600" />
                  <span className="text-sm text-gray-700">100% Secure</span>
                </div>
              </div>
            </div>

            <div className="relative h-80 bg-gradient-to-br from-teal-100 to-teal-50 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <MapIcon className="w-24 h-24 text-teal-400 mx-auto mb-4 opacity-50" />
                <p className="text-gray-600">Interactive Map View</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="bg-white py-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for services or professionals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <button className="px-6 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2 font-medium text-gray-700">
                <Filter className="w-5 h-5" />
                <span className="hidden sm:inline">Filters</span>
              </button>
            </div>

            {/* Quick Filter Chips */}
            <div className="flex flex-wrap gap-2">
              <button className="px-4 py-2 bg-teal-50 border border-teal-200 text-teal-700 rounded-full text-sm font-medium hover:bg-teal-100 transition">
                Available Today
              </button>
              <button className="px-4 py-2 bg-gray-50 border border-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-100 transition">
                Top Rated
              </button>
              <button className="px-4 py-2 bg-gray-50 border border-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-100 transition">
                Verified Only
              </button>
              <button className="px-4 py-2 bg-gray-50 border border-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-100 transition">
                Under $50/hr
              </button>
            </div>

            {/* Category Navigation */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-4">Popular Services</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
                    className={`p-3 rounded-lg border transition text-center ${
                      selectedCategory === cat.name
                        ? 'bg-teal-50 border-teal-300'
                        : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{cat.icon}</div>
                    <p className="text-xs font-medium text-gray-900">{cat.name}</p>
                    <p className="text-xs text-gray-500">{cat.count}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{professionals.length} professionals available</h3>
              <p className="text-gray-600 mt-1">Showing results near you</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition ${
                  viewMode === 'list'
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <LayoutList className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-2 rounded-lg transition ${
                  viewMode === 'map'
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <MapIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Professional Cards - List View */}
          {viewMode === 'list' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {professionals.map((pro) => (
                <div
                  key={pro.id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition group"
                >
                  {/* Card Header with Avatar */}
                  <div className="bg-gradient-to-r from-gray-100 to-gray-50 p-6 pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md">
                          {pro.image}
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-gray-900">{pro.name}</h4>
                          <p className="text-sm text-gray-600">{pro.category}</p>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-white rounded-full transition">
                        <Heart className="w-5 h-5 text-gray-400 hover:text-red-500 transition" />
                      </button>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-white rounded-full text-xs font-semibold text-teal-700 border border-teal-200">
                        {getBadgeIcon(pro.badge)}
                        {getBadgeLabel(pro.badge)}
                      </span>
                      {pro.available && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 rounded-full text-xs font-semibold text-green-700 border border-green-200">
                          <CheckCircle className="w-3 h-3" />
                          Available
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 border-t border-gray-100">
                    {/* Rating */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-bold text-gray-900">{pro.rating}</span>
                        <span className="text-sm text-gray-600">({pro.reviews} reviews)</span>
                      </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Jobs Completed</p>
                        <p className="font-semibold text-gray-900">{pro.jobs}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Response Time</p>
                        <p className="font-semibold text-gray-900 flex items-center gap-1">
                          <Clock className="w-4 h-4" /> {pro.responseTime}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Location</p>
                        <p className="font-semibold text-gray-900 flex items-center gap-1">
                          <MapPin className="w-4 h-4" /> {pro.distance}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Price</p>
                        <p className="font-semibold text-gray-900">{pro.price}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{pro.description}</p>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button className="flex-1 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition flex items-center justify-center gap-2">
                        <span>Get Quote</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition flex items-center justify-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Map View Placeholder */}
          {viewMode === 'map' && (
            <div className="h-96 bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl flex items-center justify-center border border-gray-200">
              <div className="text-center">
                <MapIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">Map view coming soon</p>
                <p className="text-sm text-gray-500 mt-1">Interactive Mapbox integration</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-12 text-center">Why customers trust Ozar</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
              <Shield className="w-10 h-10 text-teal-600 mx-auto mb-4" />
              <h4 className="font-bold text-gray-900 mb-2">Verified Professionals</h4>
              <p className="text-gray-600 text-sm">All professionals are background checked and verified</p>
            </div>
            <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
              <Users className="w-10 h-10 text-teal-600 mx-auto mb-4" />
              <h4 className="font-bold text-gray-900 mb-2">Real Reviews</h4>
              <p className="text-gray-600 text-sm">Honest feedback from verified customers</p>
            </div>
            <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
              <Zap className="w-10 h-10 text-teal-600 mx-auto mb-4" />
              <h4 className="font-bold text-gray-900 mb-2">Quick & Easy</h4>
              <p className="text-gray-600 text-sm">Book in minutes, get responses in hours</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-teal-600 to-teal-700 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">Ready to get started?</h3>
          <p className="text-teal-100 mb-8 text-lg">Join thousands of satisfied customers finding the right professional</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-white text-teal-600 font-bold rounded-lg hover:bg-gray-50 transition">
              Find a Professional
            </button>
            <button className="px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-teal-800 transition">
              Become a Pro
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">O</span>
                </div>
                <h4 className="font-bold text-white">Ozar</h4>
              </div>
              <p className="text-sm">Connect with trusted local professionals for all your home service needs.</p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">For Customers</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Search Professionals</a></li>
                <li><a href="#" className="hover:text-white transition">My Bookings</a></li>
                <li><a href="#" className="hover:text-white transition">Messages</a></li>
                <li><a href="#" className="hover:text-white transition">My Profile</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">For Professionals</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Become a Pro</a></li>
                <li><a href="#" className="hover:text-white transition">Pro Dashboard</a></li>
                <li><a href="#" className="hover:text-white transition">Manage Services</a></li>
                <li><a href="#" className="hover:text-white transition">Earnings</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">About Us</a></li>
                <li><a href="#" className="hover:text-white transition">Trust & Safety</a></li>
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <p className="text-center text-sm text-gray-400">© 2024 Ozar. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
