import AsyncStorage from '@react-native-async-storage/async-storage';
import { Contact } from '@/components/ContactCard';
import { HealthReminder } from '@/components/HealthCard';

// Storage keys
const KEYS = {
  CONTACTS: 'sahayak_contacts',
  HEALTH_REMINDERS: 'sahayak_health_reminders',
  USER_PROFILE: 'sahayak_user_profile',
  MESSAGES: 'sahayak_messages',
};

// User profile interface
export interface UserProfile {
  name: string;
  preferredLanguage: 'en' | 'hi';
}

// Default user profile
const DEFAULT_USER = {
  name: 'User',
  preferredLanguage: 'en',
};

// Message interface
export interface Message {
  id: string;
  contactId: string;
  text: string;
  timestamp: number;
  isFromUser: boolean;
  type: 'text' | 'voice' | 'image';
  mediaUrl?: string;
}

// Save contacts with error handling and validation
export const saveContacts = async (contacts: Contact[]): Promise<void> => {
  try {
    if (!Array.isArray(contacts)) {
      throw new Error('Invalid contacts data');
    }
    
    // Validate each contact
    contacts.forEach(contact => {
      if (!contact.id || !contact.name || !contact.number) {
        throw new Error('Invalid contact data: missing required fields');
      }
    });
    
    // Save to storage
    await AsyncStorage.setItem(KEYS.CONTACTS, JSON.stringify(contacts));
    console.log('Contacts saved successfully:', contacts);
  } catch (error) {
    console.error('Error saving contacts:', error);
    throw error;
  }
};

// Get contacts with error handling
export const getContacts = async (): Promise<Contact[]> => {
  try {
    const contactsJson = await AsyncStorage.getItem(KEYS.CONTACTS);
    if (!contactsJson) {
      return [];
    }
    
    const contacts = JSON.parse(contactsJson);
    if (!Array.isArray(contacts)) {
      throw new Error('Invalid contacts data in storage');
    }
    
    return contacts;
  } catch (error) {
    console.error('Error getting contacts:', error);
    return [];
  }
};

// Save health reminders
export const saveHealthReminders = async (reminders: HealthReminder[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.HEALTH_REMINDERS, JSON.stringify(reminders));
  } catch (error) {
    console.error('Error saving health reminders:', error);
    throw error;
  }
};

// Get health reminders
export const getHealthReminders = async (): Promise<HealthReminder[]> => {
  try {
    const remindersJson = await AsyncStorage.getItem(KEYS.HEALTH_REMINDERS);
    return remindersJson ? JSON.parse(remindersJson) : [];
  } catch (error) {
    console.error('Error getting health reminders:', error);
    return [];
  }
};

// Save user profile
export const saveUserProfile = async (profile: UserProfile): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
};

// Get user profile
export const getUserProfile = async (): Promise<UserProfile> => {
  try {
    const profileJson = await AsyncStorage.getItem(KEYS.USER_PROFILE);
    return profileJson ? JSON.parse(profileJson) : DEFAULT_USER;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return DEFAULT_USER;
  }
};

// Save messages
export const saveMessages = async (messages: Message[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.MESSAGES, JSON.stringify(messages));
  } catch (error) {
    console.error('Error saving messages:', error);
    throw error;
  }
};

// Get messages
export const getMessages = async (): Promise<Message[]> => {
  try {
    const messagesJson = await AsyncStorage.getItem(KEYS.MESSAGES);
    return messagesJson ? JSON.parse(messagesJson) : [];
  } catch (error) {
    console.error('Error getting messages:', error);
    return [];
  }
};

// Get messages for a specific contact
export const getMessagesForContact = async (contactId: string): Promise<Message[]> => {
  try {
    const messages = await getMessages();
    return messages.filter(message => message.contactId === contactId);
  } catch (error) {
    console.error('Error getting messages for contact:', error);
    return [];
  }
};

// Add a message
export const addMessage = async (message: Message): Promise<void> => {
  try {
    const messages = await getMessages();
    messages.push(message);
    await saveMessages(messages);
  } catch (error) {
    console.error('Error adding message:', error);
    throw error;
  }
};