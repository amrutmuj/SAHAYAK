import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MessageCircle } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { getContacts } from '@/utils/storage';
import { Contact } from '@/components/ContactCard';
import { router } from 'expo-router';
import VoiceCommandListener from '@/components/VoiceCommandListener';
import * as Speech from 'expo-speech';

export default function MessageScreen() {
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    const loadContacts = async () => {
      const savedContacts = await getContacts();
      if (savedContacts.length > 0) {
        setContacts(savedContacts);
      } else {
        // Use dummy data if no saved contacts
        setContacts([
          {
            id: '1',
            relation: 'Daughter',
            name: 'Neelam',
            number: '+911234567890',
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
        ]);
      }
    };

    loadContacts();
  }, []);

  const handleSelectContact = (contact: Contact) => {
    Speech.speak(`Opening chat with ${contact.name}`, {
      language: 'en-US',
      rate: 0.9,
    });
    
    router.push({
      pathname: '/message/conversation',
      params: { id: contact.id, name: contact.name }
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Messages</Text>
        <Text style={styles.subtitle}>Select a contact to message</Text>

        <View style={styles.contactsContainer}>
          {contacts.map(contact => (
            <TouchableOpacity
              key={contact.id}
              style={styles.contactCard}
              onPress={() => handleSelectContact(contact)}
            >
              <View style={styles.contactInfo}>
                {contact.photoUrl ? (
                  <Image source={{ uri: contact.photoUrl }} style={styles.contactImage} />
                ) : (
                  <View style={styles.placeholderImage}>
                    <Text style={styles.placeholderText}>{contact.name[0]}</Text>
                  </View>
                )}
                <View>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactRelation}>{contact.relation}</Text>
                </View>
              </View>
              <MessageCircle size={24} color={theme.colors.primary} />
            </TouchableOpacity>
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
  title: {
    ...theme.typography.title1,
    color: theme.colors.text,
    marginBottom: theme.spacing.s,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
  },
  contactsContainer: {
    marginBottom: theme.spacing.xxl,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
    ...theme.shadow.small,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: theme.spacing.m,
  },
  placeholderImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.m,
  },
  placeholderText: {
    ...theme.typography.title1,
    color: 'white',
  },
  contactName: {
    ...theme.typography.title3,
    color: theme.colors.text,
    marginBottom: 4,
  },
  contactRelation: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
});