import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { ChevronLeft, Mic, Camera, Plus, Check } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { Contact } from '@/components/ContactCard';
import { getContacts, saveContacts } from '@/utils/storage';
import { router } from 'expo-router';

export default function AddContactScreen() {
  const [relation, setRelation] = useState('');
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [aliases, setAliases] = useState<string[]>([]);
  const [newAlias, setNewAlias] = useState('');
  const [isRecordingName, setIsRecordingName] = useState(false);
  const [isRecordingNumber, setIsRecordingNumber] = useState(false);

  const simulateVoiceRecognition = (fieldType: 'name' | 'number' | 'relation') => {
    // Mock voice recognition for demo purposes
    if (fieldType === 'name') {
      setIsRecordingName(true);
      setTimeout(() => {
        setName('Anita');
        setIsRecordingName(false);
      }, 2000);
    } else if (fieldType === 'number') {
      setIsRecordingNumber(true);
      setTimeout(() => {
        setNumber('+919876543210');
        setIsRecordingNumber(false);
      }, 2000);
    } else if (fieldType === 'relation') {
      setTimeout(() => {
        setRelation('Sister');
      }, 2000);
    }
  };

  const addAlias = () => {
    if (newAlias.trim() && !aliases.includes(newAlias.trim())) {
      setAliases([...aliases, newAlias.trim()]);
      setNewAlias('');
    }
  };

  const removeAlias = (index: number) => {
    const updatedAliases = [...aliases];
    updatedAliases.splice(index, 1);
    setAliases(updatedAliases);
  };

  const handleSaveContact = async () => {
    if (!name || !number) {
      // Alert could be added here for validation feedback
      return;
    }
    
    try {
      const existingContacts = await getContacts();
      
      // Create the new contact
      const newContact: Contact = {
        id: Date.now().toString(),
        relation: relation || 'Contact',
        name,
        number,
        aliases: [...aliases, name],
      };
      
      // Save the updated contacts array
      const updatedContacts = [...existingContacts, newContact];
      await saveContacts(updatedContacts);
      
      // Navigate back to call screen with refresh parameter to trigger reloading
      router.navigate({
        pathname: '/call',
        params: { refresh: Date.now().toString() }
      });
    } catch (error) {
      console.error('Error saving contact:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={28} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Add New Contact</Text>
      </View>
      <ScrollView style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Relation</Text>
          <View style={styles.inputWithButton}>
            <TextInput
              style={styles.input}
              value={relation}
              onChangeText={setRelation}
              placeholder="e.g., Daughter, Son, Doctor"
              placeholderTextColor={theme.colors.textSecondary}
            />
            <TouchableOpacity 
              style={styles.voiceButton}
              onPress={() => simulateVoiceRecognition('relation')}
            >
              <Mic size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <View style={styles.inputWithButton}>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Contact name"
              placeholderTextColor={theme.colors.textSecondary}
            />
            <TouchableOpacity 
              style={[
                styles.voiceButton,
                isRecordingName ? styles.recordingButton : null
              ]}
              onPress={() => simulateVoiceRecognition('name')}
            >
              <Mic size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.inputWithButton}>
            <TextInput
              style={styles.input}
              value={number}
              onChangeText={setNumber}
              placeholder="Contact number"
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType="phone-pad"
            />
            <TouchableOpacity 
              style={[
                styles.voiceButton,
                isRecordingNumber ? styles.recordingButton : null
              ]}
              onPress={() => simulateVoiceRecognition('number')}
            >
              <Mic size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Photo</Text>
          <TouchableOpacity style={styles.photoButton}>
            <Camera size={24} color="white" />
            <Text style={styles.photoButtonText}>Take Photo</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Aliases (Names they respond to)</Text>
          <View style={styles.aliasInputContainer}>
            <TextInput
              style={styles.aliasInput}
              value={newAlias}
              onChangeText={setNewAlias}
              placeholder="Add an alias"
              placeholderTextColor={theme.colors.textSecondary}
            />
            <TouchableOpacity style={styles.addAliasButton} onPress={addAlias}>
              <Plus size={20} color="white" />
            </TouchableOpacity>
          </View>
          <View style={styles.aliasesContainer}>
            {aliases.map((alias, index) => (
              <View key={index} style={styles.aliasTag}>
                <Text style={styles.aliasText}>{alias}</Text>
                <TouchableOpacity 
                  onPress={() => removeAlias(index)}
                  style={styles.removeAliasButton}
                >
                  <Text style={styles.removeAliasText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSaveContact}
        >
          <Check size={24} color="white" />
          <Text style={styles.saveButtonText}>Save Contact</Text>
        </TouchableOpacity>
      </View>
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
    padding: theme.spacing.l,
    backgroundColor: 'white',
    ...theme.shadow.small,
  },
  backButton: {
    marginRight: theme.spacing.m,
  },
  title: {
    ...theme.typography.title2,
    color: theme.colors.text,
  },
  form: {
    flex: 1,
    padding: theme.spacing.l,
  },
  inputGroup: {
    marginBottom: theme.spacing.l,
  },
  label: {
    ...theme.typography.title3,
    color: theme.colors.text,
    marginBottom: theme.spacing.s,
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.m,
    ...theme.typography.body,
    color: theme.colors.text,
  },
  inputWithButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  voiceButton: {
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
  photoButton: {
    flexDirection: 'row',
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.m,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoButtonText: {
    ...theme.typography.button,
    color: 'white',
    marginLeft: theme.spacing.s,
  },
  aliasInputContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.m,
  },
  aliasInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.m,
    ...theme.typography.body,
    color: theme.colors.text,
    marginRight: theme.spacing.s,
  },
  addAliasButton: {
    backgroundColor: theme.colors.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aliasesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  aliasTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(92, 107, 192, 0.1)',
    borderRadius: theme.borderRadius.small,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    marginRight: theme.spacing.s,
    marginBottom: theme.spacing.s,
  },
  aliasText: {
    ...theme.typography.caption,
    color: theme.colors.primary,
  },
  removeAliasButton: {
    marginLeft: theme.spacing.s,
  },
  removeAliasText: {
    color: theme.colors.textSecondary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    padding: theme.spacing.l,
    backgroundColor: 'white',
    ...theme.shadow.medium,
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.m,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    ...theme.typography.button,
    color: 'white',
    marginLeft: theme.spacing.s,
  },
});