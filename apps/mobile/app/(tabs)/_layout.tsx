import { Tabs } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { DashboardIcon, ServicesIcon, BookingsIcon, MessagesIcon, ProfileIcon } from '../../components/TabIcons';

export default function TabLayout() {
  const { user } = useAuth();
  const isPro = user?.role === 'PRO';

  if (isPro) {
    // Professional Tab Layout - Blue theme matching Figma
    return (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#3B82F6',
          tabBarInactiveTintColor: '#9CA3AF',
          tabBarStyle: {
            backgroundColor: 'white',
            borderTopWidth: 1,
            borderTopColor: '#F3F4F6',
            height: 65,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
            marginTop: 4,
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color }) => (
              <DashboardIcon size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="pro-services"
          options={{
            title: 'Services',
            tabBarIcon: ({ color }) => (
              <ServicesIcon size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="bookings"
          options={{
            title: 'Requests',
            tabBarIcon: ({ color }) => (
              <BookingsIcon size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: 'Messages',
            tabBarIcon: ({ color }) => (
              <MessagesIcon size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => (
              <ProfileIcon size={24} color={color} />
            ),
          }}
        />
        {/* Hide pro-requests tab - we use bookings instead */}
        <Tabs.Screen name="pro-requests" options={{ href: null }} />
      </Tabs>
    );
  }

  // Customer Tab Layout - Teal theme, clean design
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#00BCD4',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#F3F4F6',
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => (
            <DashboardIcon size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Bookings',
          tabBarIcon: ({ color }) => (
            <BookingsIcon size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color }) => (
            <MessagesIcon size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <ProfileIcon size={24} color={color} />
          ),
        }}
      />
      {/* Hide pro tabs for customers */}
      <Tabs.Screen name="pro-services" options={{ href: null }} />
      <Tabs.Screen name="pro-requests" options={{ href: null }} />
    </Tabs>
  );
}
