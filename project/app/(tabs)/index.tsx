import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import { Chrome as Home, Phone, MessageCircle, Heart, Camera } from 'lucide-react-native';
import { router } from 'expo-router';
import { theme } from '@/constants/theme';
import LargeButton from '@/components/LargeButton';
import VoiceCommandListener from '@/components/VoiceCommandListener';
import { getUserProfile, UserProfile } from '@/utils/storage';

export default function HomeScreen() {
  const [profile, setProfile] = useState<UserProfile>({ name: 'User', preferredLanguage: 'en' });
  const [greeting, setGreeting] = useState('Good morning');

  useEffect(() => {
    let isMounted = true;
    
    const loadProfile = async () => {
      const userProfile = await getUserProfile();
      if (isMounted) {
        setProfile(userProfile);
      }
    };

    const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return 'Good morning';
      if (hour < 18) return 'Good afternoon';
      return 'Good evening';
    };

    loadProfile();
    if (isMounted) {
      setGreeting(getGreeting());
    }
    
    return () => {
      isMounted = false;
    };
  }, []);

  const handleVoiceCommand = (command: string) => {
    console.log('Voice command received:', command);
    // Command handling is implemented in VoiceCommandListener component
  };

  const navigateToScreen = (screen: string) => {
    router.push(`/${screen}`);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.greeting}>{greeting},</Text>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.subtitle}>What would you like to do?</Text>
        </View>

        <View style={styles.buttonContainer}>
          <LargeButton
            title="Make a Call"
            icon={<Phone size={28} color="white" style={styles.buttonIcon} />}
            onPress={() => navigateToScreen('call')}
          />
          
          <LargeButton
            title="Send a Message"
            icon={<MessageCircle size={28} color="white" style={styles.buttonIcon} />}
            onPress={() => navigateToScreen('message')}
            variant="secondary"
          />
          
          <LargeButton
            title="Health Reminders"
            icon={<Heart size={28} color="white" style={styles.buttonIcon} />}
            onPress={() => navigateToScreen('health')}
          />
          
          <LargeButton
            title="Take a Photo"
            icon={<Camera size={28} color="white" style={styles.buttonIcon} />}
            onPress={() => navigateToScreen('camera')}
            variant="secondary"
          />
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Voice Commands</Text>
          <View style={styles.commandExample}>
            <Text style={styles.commandText}>"Call Neelam"</Text>
          </View>
          <View style={styles.commandExample}>
            <Text style={styles.commandText}>"Message Tanya"</Text>
          </View>
          <View style={styles.commandExample}>
            <Text style={styles.commandText}>"Open Health"</Text>
          </View>
        </View>
      </ScrollView>
      
      <VoiceCommandListener onCommand={handleVoiceCommand} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.l,
    paddingBottom: 100,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  greeting: {
    ...theme.typography.title2,
    color: theme.colors.text,
  },
  name: {
    ...theme.typography.largeTitle,
    color: theme.colors.primary,
    marginBottom: theme.spacing.s,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  buttonContainer: {
    marginBottom: theme.spacing.xl,
  },
  buttonIcon: {
    marginRight: theme.spacing.s,
  },
  infoSection: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.l,
    borderRadius: theme.borderRadius.medium,
    ...theme.shadow.small,
  },
  infoTitle: {
    ...theme.typography.title3,
    color: theme.colors.text,
    marginBottom: theme.spacing.m,
  },
  commandExample: {
    backgroundColor: 'rgba(92, 107, 192, 0.1)',
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.small,
    marginBottom: theme.spacing.s,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  commandText: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
});