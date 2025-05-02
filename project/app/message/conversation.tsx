import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Send, Mic, Image as ImageIcon, Smile } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { getContacts, getMessagesForContact, addMessage, Message } from '@/utils/storage';
import { Contact } from '@/components/ContactCard';
import * as Speech from 'expo-speech';

export default function ConversationScreen() {
  const params = useLocalSearchParams();
  const { id, name } = params;
  
  const [contact, setContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  
  const scrollViewRef = useRef<ScrollView>(null);
  
  useEffect(() => {
    const loadData = async () => {
      // Load contact details
      const contacts = await getContacts();
      const foundContact = contacts.find(c => c.id === id);
      if (foundContact) {
        setContact(foundContact);
      }
      
      // Load messages
      const contactMessages = await getMessagesForContact(id as string);
      if (contactMessages.length > 0) {
        setMessages(contactMessages);
      } else {
        // Add a welcome message if no messages exist
        const welcomeMessage: Message = {
          id: Date.now().toString(),
          contactId: id as string,
          text: `Hello! This is the start of your conversation with ${name}.`,
          timestamp: Date.now(),
          isFromUser: false,
          type: 'text'
        };
        addMessage(welcomeMessage);
        setMessages([welcomeMessage]);
      }
    };
    
    loadData();
  }, [id, name]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);
  
  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    
    const message: Message = {
      id: Date.now().toString(),
      contactId: id as string,
      text: newMessage,
      timestamp: Date.now(),
      isFromUser: true,
      type: 'text'
    };
    
    await addMessage(message);
    setMessages([...messages, message]);
    setNewMessage('');
    
    // Simulate response after 1 second
    setTimeout(async () => {
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        contactId: id as string,
        text: `This is a simulated response from ${name}.`,
        timestamp: Date.now() + 1000,
        isFromUser: false,
        type: 'text'
      };
      
      await addMessage(responseMessage);
      setMessages(prevMessages => [...prevMessages, responseMessage]);
    }, 1000);
  };
  
  const startVoiceRecording = () => {
    setIsRecording(true);
    Speech.speak('Recording voice message', {
      language: 'en-US',
      rate: 0.9,
    });
    
    // Simulate voice recording
    setTimeout(() => {
      setIsRecording(false);
      
      // Simulated voice message
      const voiceMessage: Message = {
        id: Date.now().toString(),
        contactId: id as string,
        text: 'Voice Message',
        timestamp: Date.now(),
        isFromUser: true,
        type: 'voice'
      };
      
      addMessage(voiceMessage);
      setMessages([...messages, voiceMessage]);
      
      Speech.speak('Voice message sent', {
        language: 'en-US',
        rate: 0.9,
      });
    }, 3000);
  };
  
  const stopVoiceRecording = () => {
    setIsRecording(false);
  };
  
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={28} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.contactInfo}>
          {contact?.photoUrl ? (
            <Image source={{ uri: contact.photoUrl }} style={styles.contactImage} />
          ) : (
            <View style={styles.contactPlaceholder}>
              <Text style={styles.placeholderText}>{name?.toString()[0]}</Text>
            </View>
          )}
          <View>
            <Text style={styles.contactName}>{name}</Text>
            <Text style={styles.contactRelation}>{contact?.relation}</Text>
          </View>
        </View>
      </View>
      
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesList}
      >
        {messages.map(message => (
          <View 
            key={message.id}
            style={[
              styles.messageBubble,
              message.isFromUser ? styles.userBubble : styles.contactBubble
            ]}
          >
            {message.type === 'text' && (
              <Text style={styles.messageText}>{message.text}</Text>
            )}
            
            {message.type === 'voice' && (
              <View style={styles.voiceMessage}>
                <Mic size={18} color={message.isFromUser ? 'white' : theme.colors.text} />
                <Text style={[
                  styles.messageText,
                  { marginLeft: theme.spacing.s }
                ]}>
                  Voice Message
                </Text>
              </View>
            )}
            
            {message.type === 'image' && message.mediaUrl && (
              <Image source={{ uri: message.mediaUrl }} style={styles.messageImage} />
            )}
            
            <Text style={[
              styles.messageTime,
              message.isFromUser ? styles.userTime : styles.contactTime
            ]}>
              {formatTime(message.timestamp)}
            </Text>
          </View>
        ))}
      </ScrollView>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <View style={styles.inputRow}>
          <TouchableOpacity style={styles.attachButton}>
            <ImageIcon size={24} color={theme.colors.primary} />
          </TouchableOpacity>
          
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            placeholderTextColor={theme.colors.textSecondary}
            multiline
          />
          
          <TouchableOpacity style={styles.emojiButton}>
            <Smile size={24} color={theme.colors.primary} />
          </TouchableOpacity>
          
          {newMessage.trim() ? (
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Send size={24} color="white" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[
                styles.sendButton,
                isRecording ? styles.recordingButton : null
              ]}
              onPress={isRecording ? stopVoiceRecording : startVoiceRecording}
            >
              <Mic size={24} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.m,
    backgroundColor: 'white',
    ...theme.shadow.small,
  },
  backButton: {
    marginRight: theme.spacing.m,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: theme.spacing.m,
  },
  contactPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.m,
  },
  placeholderText: {
    ...theme.typography.title3,
    color: 'white',
  },
  contactName: {
    ...theme.typography.title3,
    color: theme.colors.text,
  },
  contactRelation: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  messagesContainer: {
    flex: 1,
    padding: theme.spacing.m,
  },
  messagesList: {
    paddingBottom: theme.spacing.m,
  },
  messageBubble: {
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.medium,
    marginBottom: theme.spacing.m,
    maxWidth: '80%',
  },
  userBubble: {
    backgroundColor: theme.colors.primary,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 0,
  },
  contactBubble: {
    backgroundColor: 'white',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 0,
    ...theme.shadow.small,
  },
  messageText: {
    ...theme.typography.body,
    color: 'white',
  },
  contactText: {
    color: theme.colors.text,
  },
  messageTime: {
    ...theme.typography.caption,
    fontSize: 12,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  userTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  contactTime: {
    color: theme.colors.textSecondary,
  },
  voiceMessage: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: theme.borderRadius.small,
    marginBottom: 4,
  },
  inputContainer: {
    backgroundColor: 'white',
    padding: theme.spacing.m,
    ...theme.shadow.medium,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.m,
    maxHeight: 100,
    ...theme.typography.body,
    color: theme.colors.text,
  },
  attachButton: {
    padding: theme.spacing.s,
    marginRight: theme.spacing.s,
  },
  emojiButton: {
    padding: theme.spacing.s,
    marginHorizontal: theme.spacing.s,
  },
  sendButton: {
    backgroundColor: theme.colors.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.s,
  },
  recordingButton: {
    backgroundColor: theme.colors.error,
  },
});