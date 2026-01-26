import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../contexts/LanguageContext';

const { width } = Dimensions.get('window');

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();
  const [modalVisible, setModalVisible] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(0));

  const openModal = () => {
    setModalVisible(true);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const handleLanguageSelect = async (lang: 'en' | 'hu') => {
    await setLanguage(lang);
    closeModal();
  };

  return (
    <>
      {/* Language Button */}
      <TouchableOpacity
        style={styles.languageButton}
        onPress={openModal}
        activeOpacity={0.7}
      >
        <Ionicons name="globe-outline" size={20} color="#666" />
        <Text style={styles.languageText}>
          {language === 'en' ? 'EN' : 'HU'}
        </Text>
      </TouchableOpacity>

      {/* Language Selection Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeModal}
        >
          <Animated.View
            style={[
              styles.modalContent,
              {
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <Ionicons name="globe" size={32} color="#00BCD4" />
              <Text style={styles.modalTitle}>{t.settings.selectLanguage}</Text>
            </View>

            {/* English Option */}
            <TouchableOpacity
              style={[
                styles.languageOption,
                language === 'en' && styles.languageOptionActive,
              ]}
              onPress={() => handleLanguageSelect('en')}
              activeOpacity={0.7}
            >
              <View style={styles.languageOptionContent}>
                <View style={styles.flagContainer}>
                  <Text style={styles.flagEmoji}>🇬🇧</Text>
                </View>
                <View style={styles.languageInfo}>
                  <Text style={styles.languageName}>English</Text>
                  <Text style={styles.languageNative}>English</Text>
                </View>
              </View>
              {language === 'en' && (
                <Ionicons name="checkmark-circle" size={24} color="#00BCD4" />
              )}
            </TouchableOpacity>

            {/* Hungarian Option */}
            <TouchableOpacity
              style={[
                styles.languageOption,
                language === 'hu' && styles.languageOptionActive,
              ]}
              onPress={() => handleLanguageSelect('hu')}
              activeOpacity={0.7}
            >
              <View style={styles.languageOptionContent}>
                <View style={styles.flagContainer}>
                  <Text style={styles.flagEmoji}>🇭🇺</Text>
                </View>
                <View style={styles.languageInfo}>
                  <Text style={styles.languageName}>Hungarian</Text>
                  <Text style={styles.languageNative}>Magyar</Text>
                </View>
              </View>
              {language === 'hu' && (
                <Ionicons name="checkmark-circle" size={24} color="#00BCD4" />
              )}
            </TouchableOpacity>

            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeModal}
              activeOpacity={0.7}
            >
              <Text style={styles.closeButtonText}>{t.common.close}</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    gap: 6,
  },
  languageText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    width: width - 40,
    maxWidth: 400,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginTop: 12,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#F8F9FA',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  languageOptionActive: {
    backgroundColor: '#E0F7FA',
    borderColor: '#00BCD4',
  },
  languageOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  flagContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  flagEmoji: {
    fontSize: 28,
  },
  languageInfo: {
    gap: 2,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  languageNative: {
    fontSize: 14,
    color: '#666',
  },
  closeButton: {
    marginTop: 12,
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
});
