import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Phone, Video, MessageCircle } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import * as Speech from 'expo-speech';

export interface Contact {
  id: string;
  relation: string;
  name: string;
  number: string;
  aliases: string[];
  photoUrl?: string;
}

interface ContactCardProps {
  contact: Contact;
  onCall: (contact: Contact) => void;
  onVideoCall: (contact: Contact) => void;
  onMessage: (contact: Contact) => void;
}

const ContactCard: React.FC<ContactCardProps> = ({
  contact,
  onCall,
  onVideoCall,
  onMessage,
}) => {
  const handleCall = () => {
    Speech.speak(`Calling ${contact.name}`, {
      language: 'en-US',
      rate: 0.9,
    });
    onCall(contact);
  };

  const handleVideoCall = () => {
    Speech.speak(`Video calling ${contact.name}`, {
      language: 'en-US',
      rate: 0.9,
    });
    onVideoCall(contact);
  };

  const handleMessage = () => {
    Speech.speak(`Opening messages with ${contact.name}`, {
      language: 'en-US',
      rate: 0.9,
    });
    onMessage(contact);
  };

  return (
    <View style={styles.card}>
      <View style={styles.contactInfo}>
        <View style={styles.imageContainer}>
          {contact.photoUrl ? (
            <Image source={{ uri: contact.photoUrl }} style={styles.image} />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>{contact.name.charAt(0)}</Text>
            </View>
          )}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.name}>{contact.name}</Text>
          <Text style={styles.relation}>{contact.relation}</Text>
        </View>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
          <Phone size={28} color={theme.colors.primary} />
          <Text style={styles.actionText}>Call</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleVideoCall}>
          <Video size={28} color={theme.colors.secondary} />
          <Text style={styles.actionText}>Video</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleMessage}>
          <MessageCircle size={28} color={theme.colors.accent} />
          <Text style={styles.actionText}>Message</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
    ...theme.shadow.small,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  imageContainer: {
    marginRight: theme.spacing.m,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  placeholderImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    ...theme.typography.title1,
    color: 'white',
  },
  textContainer: {
    flex: 1,
  },
  name: {
    ...theme.typography.title3,
    color: theme.colors.text,
    marginBottom: 4,
  },
  relation: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.m,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.s,
  },
  actionText: {
    ...theme.typography.caption,
    color: theme.colors.text,
    marginTop: 4,
  },
});

export default ContactCard;