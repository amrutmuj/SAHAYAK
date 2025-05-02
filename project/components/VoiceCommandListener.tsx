import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Switch, Text, Platform } from 'react-native';
import { Mic } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Contact } from '@/components/ContactCard';
import { getContacts, saveContacts } from '@/utils/storage';
import { getHealthReminders, saveHealthReminders } from '@/utils/storage';
import { HealthReminder } from '@/components/HealthCard';
import { speechRecognition, speak } from '@/utils/speechRecognition';

interface VoiceCommandListenerProps {
  onCommand?: (command: string) => void;
}

const VoiceCommandListener: React.FC<VoiceCommandListenerProps> = ({ onCommand }) => {
  const [isListening, setIsListening] = useState(false);
  const [voiceFeedback, setVoiceFeedback] = useState(true);
  const [transcription, setTranscription] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('voiceFeedback').then(value => {
      if (value !== null) {
        setVoiceFeedback(value === 'true');
      }
    });
  }, []);

  const toggleVoiceFeedback = (value: boolean) => {
    setVoiceFeedback(value);
    AsyncStorage.setItem('voiceFeedback', value.toString());
  };

  const handleSpeak = (text: string) => {
    if (voiceFeedback) {
      speak(text);
    }
  };

  const parseHealthCommand = (text: string) => {
    const lowerText = text.toLowerCase();
    
    let type: 'medicine' | 'appointment' | 'checkup' = 'medicine';
    if (lowerText.includes('appointment')) type = 'appointment';
    if (lowerText.includes('checkup')) type = 'checkup';
    
    let time = new Date();
    const timeRegex = /(?:at\s+)?(\d{1,2})(?::(\d{2}))?\s*([AaPp][Mm])?/;
    const timeMatch = lowerText.match(timeRegex);
    if (timeMatch) {
      let hours = parseInt(timeMatch[1]);
      const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
      const meridian = timeMatch[3]?.toLowerCase();
      
      if (meridian === 'pm' && hours < 12) hours += 12;
      if (meridian === 'am' && hours === 12) hours = 0;
      
      time.setHours(hours, minutes);
    }
    
    let date = new Date();
    if (lowerText.includes('tomorrow')) {
      date.setDate(date.getDate() + 1);
    } else if (lowerText.includes('next')) {
      date.setDate(date.getDate() + 7);
    } else {
      const dateRegex = /(?:on\s+)?([a-z]+day|[a-z]+\s+\d{1,2}(?:st|nd|rd|th)?)/i;
      const dateMatch = lowerText.match(dateRegex);
      if (dateMatch) {
        const dateStr = dateMatch[1];
        date = new Date(dateStr + ', ' + new Date().getFullYear());
      }
    }
    
    const titleRegex = new RegExp(`(${type}|reminder|remind me)\\s+(?:to|about|for)?\\s+(.+?)(?:\\s+(?:at|on|tomorrow|next|${type})|$)`, 'i');
    const titleMatch = lowerText.match(titleRegex);
    const title = titleMatch ? titleMatch[2].trim() : 'New Reminder';
    
    return { type, title, date, time };
  };

  const handleSpeechResult = useCallback(async (text: string) => {
    if (!text) return;
    
    setTranscription(text);
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('add') && (lowerText.includes('reminder') || lowerText.includes('medicine') || lowerText.includes('appointment'))) {
      try {
        const { type, title, date, time } = parseHealthCommand(text);
        
        const newReminder: HealthReminder = {
          id: Date.now().toString(),
          title,
          type,
          date: date.toLocaleDateString(),
          time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          completed: false,
        };
        
        const reminders = await getHealthReminders();
        await saveHealthReminders([...reminders, newReminder]);
        handleSpeak(`I've added a ${type} reminder for ${title}`);
        
        if (router.canGoBack()) {
          router.replace('/health');
        }
        return;
      } catch (error) {
        console.error('Error adding reminder:', error);
        handleSpeak('I apologize, but I could not add the reminder. Could you please try again?');
        return;
      }
    }
    
    if (lowerText.includes('call')) {
      const target = lowerText.replace('call', '').trim();
      const contacts = await getContacts();
      const matchedContact = contacts.find(contact => 
        contact.aliases.some(alias => 
          alias.toLowerCase().includes(target)
        )
      );

      if (matchedContact) {
        handleSpeak(`I'll connect you with ${matchedContact.name}`);
        router.push({
          pathname: '/call/in-call',
          params: { 
            id: matchedContact.id,
            name: matchedContact.name,
            photo: matchedContact.photoUrl || '',
            isVideo: 'false'
          }
        });
      } else {
        handleSpeak(`I'm sorry, but I couldn't find a contact named ${target}`);
      }
    } else if (lowerText.includes('add contact') || lowerText.includes('new contact')) {
      const nameRegex = /(?:named?|called)\s+([a-z\s]+)(?:\s+(?:as|with|number|relation|phone|mobile))/i;
      const numberRegex = /(?:number|phone|mobile)\s+(?:is|:)?\s*((?:\+?\d{1,3}[-\s]?)?\d[\d\s-]{8,}\d)/i;
      const relationRegex = /(?:as|relation|is)\s+(my\s+)?([a-z\s]+)(?:\s+(?:with|number|phone|mobile|and|$))/i;
      
      const nameMatch = lowerText.match(nameRegex);
      const numberMatch = lowerText.match(numberRegex);
      const relationMatch = lowerText.match(relationRegex);
      
      if (nameMatch && numberMatch) {
        const name = nameMatch[1].trim();
        const number = numberMatch[1].replace(/\s+/g, '');
        const relation = relationMatch ? relationMatch[2].trim() : 'Contact';
        
        const newContact: Contact = {
          id: Date.now().toString(),
          name,
          number,
          relation,
          aliases: [name],
        };
        
        const contacts = await getContacts();
        await saveContacts([...contacts, newContact]);
        handleSpeak(`I've added ${name} to your contacts`);
        
        if (router.canGoBack()) {
          router.replace({
            pathname: '/call',
            params: { refresh: Date.now().toString() }
          });
        }
      } else {
        handleSpeak('Could you please provide both a name and phone number for the contact?');
      }
    }
    
    if (onCommand) {
      onCommand(text);
    }
  }, [onCommand, voiceFeedback]);

  const startListening = async () => {
    setError(null);
    
    if (!speechRecognition.isAvailable()) {
      setError('Speech recognition is not supported in your browser');
      handleSpeak('Speech recognition is not supported in your browser');
      return;
    }

    setIsListening(true);
    handleSpeak("I'm listening...");

    speechRecognition.start(
      ({ value, isFinal }) => {
        if (value) {
          setTranscription(value);
          if (isFinal) {
            handleSpeechResult(value);
          }
        }
      },
      (error) => {
        console.error('Speech recognition error:', error);
        setError(error);
        handleSpeak('I apologize, but I had trouble understanding. Could you please try again?');
        setIsListening(false);
      },
      () => setIsListening(true),
      () => setIsListening(false)
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.feedbackToggle}>
        <Text style={styles.toggleLabel}>Voice Feedback</Text>
        <Switch
          value={voiceFeedback}
          onValueChange={toggleVoiceFeedback}
          trackColor={{ false: '#767577', true: theme.colors.primary }}
        />
      </View>
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      {transcription ? (
        <View style={styles.transcriptionContainer}>
          <Text style={styles.transcriptionText}>{transcription}</Text>
        </View>
      ) : null}
      <TouchableOpacity
        style={[styles.micButton, isListening && styles.listeningButton]}
        onPress={startListening}
        disabled={isListening}
      >
        <Mic size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    alignItems: 'flex-end',
  },
  feedbackToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 20,
    marginBottom: 10,
    ...theme.shadow.small,
  },
  toggleLabel: {
    ...theme.typography.caption,
    marginRight: 8,
    color: theme.colors.text,
  },
  micButton: {
    backgroundColor: theme.colors.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadow.medium,
  },
  listeningButton: {
    backgroundColor: theme.colors.error,
  },
  transcriptionContainer: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: theme.borderRadius.medium,
    marginBottom: 10,
    maxWidth: 300,
    ...theme.shadow.small,
  },
  transcriptionText: {
    ...theme.typography.caption,
    color: theme.colors.text,
  },
  errorContainer: {
    backgroundColor: theme.colors.error,
    padding: 12,
    borderRadius: theme.borderRadius.medium,
    marginBottom: 10,
    maxWidth: 300,
    ...theme.shadow.small,
  },
  errorText: {
    ...theme.typography.caption,
    color: 'white',
  },
});

export default VoiceCommandListener;