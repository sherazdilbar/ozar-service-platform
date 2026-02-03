'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard,
  Briefcase,
  User,
  Calendar,
  MapPin,
  MessageSquare,
  Star,
  Users,
  TrendingUp,
  Camera,
  Clock,
  Settings,
  LogOut
} from 'lucide-react';

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  badge?: number;
}

export default function ProSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems: MenuItem[] = [
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      label: 'Dashboard',
      href: '/pro/dashboard',
    },
    {
      icon: <Briefcase className="w-5 h-5" />,
      label: 'My Services',
      href: '/pro/services',
    },
    {
      icon: <User className="w-5 h-5" />,
      label: 'My Profile',
      href: '/pro/profile',
    },
    {
      icon: <Camera className="w-5 h-5" />,
      label: 'Portfolio',
      href: '/pro/portfolio',
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: 'Available Jobs',
      href: '/pro/jobs',
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: 'Availability',
      href: '/pro/availability',
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: 'Service Area',
      href: '/pro/service-area',
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      label: 'Messages',
      href: '/chat',
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      label: 'Quick Messages',
      href: '/pro/quick-messages',
    },
    {
      icon: <Star className="w-5 h-5" />,
      label: 'Reviews',
      href: '/pro/reviews',
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: 'Customers',
      href: '/pro/customers',
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: 'Analytics',
      href: '/pro/analytics',
    },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen sticky top-0 flex flex-col">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Pro Dashboard</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your business</p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                  ${isActive(item.href)
                    ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 font-semibold'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }
                `}
              >
                {item.icon}
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="px-2 py-0.5 text-xs font-semibold bg-teal-600 text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => router.push('/auth/logout')}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
