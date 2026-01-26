import { Tabs } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { View, Text } from 'react-native';

export default function TabLayout() {
  const { user } = useAuth();
  const isPro = user?.role === 'PRO';

  if (isPro) {
    // Professional Tab Layout
    return (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#FF6B35',
          tabBarInactiveTintColor: '#9CA3AF',
          tabBarStyle: {
            backgroundColor: 'white',
            borderTopWidth: 1,
            borderTopColor: '#E5E7EB',
            height: 70,
            paddingBottom: 12,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ focused, color }) => (
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 24, color }}>
                  {focused ? '▦' : '▢'}
                </Text>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="pro-services"
          options={{
            title: 'Services',
            tabBarIcon: ({ focused, color }) => (
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 24, color }}>
                  {focused ? '💼' : '🎒'}
                </Text>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="bookings"
          options={{
            title: 'Requests',
            tabBarIcon: ({ focused, color }) => (
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 24, color }}>
                  {focused ? '🔔' : '🔕'}
                </Text>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: 'Chat',
            tabBarIcon: ({ focused, color }) => (
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 24, color }}>
                  {focused ? '💬' : '💭'}
                </Text>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ focused, color }) => (
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 24, color }}>
                  {focused ? '👤' : '👥'}
                </Text>
              </View>
            ),
          }}
        />
        {/* Hide pro-requests tab - we use bookings instead */}
        <Tabs.Screen name="pro-requests" options={{ href: null }} />
      </Tabs>
    );
  }

  // Customer Tab Layout
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#00BCD4',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          height: 65,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (focused ? '🏠' : '🏡'),
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Bookings',
          tabBarIcon: ({ focused }) => (focused ? '📅' : '📆'),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Messages',
          tabBarIcon: ({ focused }) => (focused ? '💬' : '💭'),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (focused ? '👤' : '👥'),
        }}
      />
      {/* Hide pro tabs for customers */}
      <Tabs.Screen name="pro-services" options={{ href: null }} />
      <Tabs.Screen name="pro-requests" options={{ href: null }} />
    </Tabs>
  );
}
