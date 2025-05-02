import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { UserPlus, Search } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import ContactCard, { Contact } from '@/components/ContactCard';
import { getContacts } from '@/utils/storage';
import { router, useLocalSearchParams } from 'expo-router';
import VoiceCommandListener from '@/components/VoiceCommandListener';

const DUMMY_CONTACTS: Contact[] = [
  {
    id: '1',
    relation: 'Daughter',
    name: 'Neelam',
    number: '+918319850594',
    aliases: ['Neelam', 'Daughter'],
    photoUrl: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg',
  },
  {
    id: '2',
    relation: 'Son',
    name: 'Rahul',
    number: '+911234567891',
    aliases: ['Rahul', 'Son', 'Beta'],
    photoUrl: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
  },
  {
    id: '3',
    relation: 'Doctor',
    name: 'Dr. Verma',
    number: '+911234567892',
    aliases: ['Doctor', 'Dr. Verma'],
  },
];

export default function CallScreen() {
  const [contacts, setContacts] = useState<Contact[]>(DUMMY_CONTACTS);
  const params = useLocalSearchParams();
  const refreshParam = params.refresh;

  useEffect(() => {
    loadContacts();
  }, [refreshParam]);

  const loadContacts = async () => {
    try {
      const savedContacts = await getContacts();
      if (savedContacts && savedContacts.length > 0) {
        setContacts(savedContacts);
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
    }
  };

  const handleCall = (contact: Contact) => {
    router.push({
      pathname: '/call/in-call',
      params: { 
        id: contact.id,
        name: contact.name,
        photo: contact.photoUrl || '',
        isVideo: 'false'
      }
    });
  };

  const handleVideoCall = (contact: Contact) => {
    router.push({
      pathname: '/call/in-call',
      params: { 
        id: contact.id,
        name: contact.name,
        photo: contact.photoUrl || '',
        isVideo: 'true'
      }
    });
  };

  const handleMessage = (contact: Contact) => {
    router.push({
      pathname: '/message/conversation',
      params: { id: contact.id, name: contact.name }
    });
  };

  const handleAddContact = () => {
    router.push('/call/add-contact');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Contacts</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleAddContact}>
            <UserPlus size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Search size={20} color={theme.colors.textSecondary} />
          <Text style={styles.searchPlaceholder}>Search contacts...</Text>
        </View>

        <View style={styles.contactsContainer}>
          {contacts.map(contact => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onCall={handleCall}
              onVideoCall={handleVideoCall}
              onMessage={handleMessage}
            />
          ))}
        </View>
      </ScrollView>
      
      <VoiceCommandListener />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.l,
  },
  title: {
    ...theme.typography.title1,
    color: theme.colors.text,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadow.small,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.l,
    ...theme.shadow.small,
  },
  searchPlaceholder: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.m,
  },
  contactsContainer: {
    marginBottom: theme.spacing.xxl,
  },
});