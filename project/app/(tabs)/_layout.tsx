import { Tabs } from 'expo-router';
import { Platform, Text, View } from 'react-native';
import { Chrome as Home, Phone, MessageCircle, Heart, Camera } from 'lucide-react-native';
import { theme } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          height: Platform.OS === 'web' ? 60 : 70,
          paddingBottom: Platform.OS === 'web' ? 10 : 15,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter-SemiBold',
          fontSize: 14,
          marginTop: 5,
        },
        headerStyle: {
          height: 80,
        },
        headerTitleStyle: {
          fontFamily: 'Inter-Bold',
          fontSize: 22,
        },
        headerShown: true,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Home size={28} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="call"
        options={{
          title: 'Call',
          tabBarIcon: ({ color, size }) => (
            <Phone size={28} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="message"
        options={{
          title: 'Message',
          tabBarIcon: ({ color, size }) => (
            <MessageCircle size={28} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="health"
        options={{
          title: 'Health',
          tabBarIcon: ({ color, size }) => (
            <Heart size={28} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: 'Camera',
          tabBarIcon: ({ color, size }) => (
            <Camera size={28} color={color} strokeWidth={2} />
          ),
        }}
      />
    </Tabs>
  );
}