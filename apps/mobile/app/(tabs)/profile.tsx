import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'expo-router';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import { useTranslation } from '../../contexts/LanguageContext';
import { useNotifications } from '../../contexts/NotificationsContext';
import ProProfile from '../../components/ProProfile';
import { UserRole } from '@ozar/shared';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const t = useTranslation();
  const { unreadCount } = useNotifications();

  // If user is a PRO, show Pro Profile
  if (user?.role === UserRole.PRO) {
    return <ProProfile />;
  }

  // Customer Profile Screen
  const handleLogout = () => {
    console.log('Logout button pressed');
    Alert.alert(
      t.auth.logout,
      t.auth.logoutConfirm,
      [
        { 
          text: t.common.cancel, 
          style: 'cancel',
          onPress: () => console.log('Logout cancelled')
        },
        {
          text: t.auth.logout,
          style: 'destructive',
          onPress: async () => {
            console.log('Logout confirmed, calling logout function');
            try {
              await logout();
              console.log('Logout completed');
            } catch (error) {
              console.error('Logout error:', error);
            }
          },
        },
      ]
    );
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>{t.common.loading}</Text>
      </View>
    );
  }

  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {/* Notifications Bell */}
        <TouchableOpacity 
          style={styles.notificationBell}
          onPress={() => router.push('/notifications')}
        >
          <Text style={styles.bellIcon}>🔔</Text>
          {unreadCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.name}>{user.firstName} {user.lastName}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleBadgeText}>
            👤 {t.profile.customer}
          </Text>
        </View>
      </View>

      {/* Language Switcher Section */}
      <View style={styles.section}>
        <View style={styles.languageSection}>
          <View style={styles.languageInfo}>
            <Text style={styles.menuIcon}>🌍</Text>
            <Text style={styles.menuText}>{t.profile.language}</Text>
          </View>
          <LanguageSwitcher />
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/profile/edit')}>
          <Text style={styles.menuIcon}>👤</Text>
          <Text style={styles.menuText}>{t.profile.editProfile}</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>📍</Text>
          <Text style={styles.menuText}>{t.profile.savedAddresses}</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>💳</Text>
          <Text style={styles.menuText}>{t.profile.paymentMethods}</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>⚙️</Text>
          <Text style={styles.menuText}>{t.profile.settings}</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>❓</Text>
          <Text style={styles.menuText}>{t.profile.helpSupport}</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>📄</Text>
          <Text style={styles.menuText}>{t.profile.termsPrivacy}</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>{t.auth.logout}</Text>
      </TouchableOpacity>

      <View style={styles.version}>
        <Text style={styles.versionText}>{t.profile.version} 1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 32,
    paddingTop: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    position: 'relative',
  },
  notificationBell: {
    position: 'absolute',
    top: 48,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bellIcon: {
    fontSize: 20,
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: 'white',
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  proDashboardCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#FF6B35',
  },
  proDashboardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  proDashboardIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  proDashboardText: {
    flex: 1,
  },
  proDashboardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 4,
  },
  proDashboardSubtitle: {
    fontSize: 13,
    color: '#6b7280',
  },
  proDashboardArrow: {
    fontSize: 24,
    color: '#FF6B35',
    fontWeight: 'bold',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0284c7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#6b7280',
  },
  section: {
    backgroundColor: 'white',
    marginTop: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  languageSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
  },
  menuArrow: {
    fontSize: 24,
    color: '#9ca3af',
  },
  logoutButton: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
  },
  roleBadge: {
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#e0f7fa',
  },
  roleBadgePro: {
    backgroundColor: '#fff3e0',
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#00BCD4',
  },
  avatarPro: {
    backgroundColor: '#FF6B35',
  },
  version: {
    alignItems: 'center',
    padding: 24,
  },
  versionText: {
    fontSize: 12,
    color: '#9ca3af',
  },
});
