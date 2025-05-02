import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { ChevronLeft, Calendar, Clock } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import { router } from 'expo-router';
import { HealthReminder } from '@/components/HealthCard';
import { getHealthReminders, saveHealthReminders } from '@/utils/storage';
import * as Speech from 'expo-speech';

export default function AddReminderScreen() {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'medicine' | 'appointment' | 'checkup'>('medicine');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleSave = async () => {
    if (!title) {
      Speech.speak('Please enter a title for the reminder');
      return;
    }

    try {
      const newReminder: HealthReminder = {
        id: Date.now().toString(),
        title,
        type,
        date: date.toLocaleDateString(),
        time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        completed: false,
      };

      const existingReminders = await getHealthReminders();
      await saveHealthReminders([...existingReminders, newReminder]);
      
      Speech.speak('Reminder saved successfully');
      router.replace('/health');
    } catch (error) {
      console.error('Error saving reminder:', error);
      Speech.speak('Failed to save reminder');
    }
  };

  const renderDatePicker = () => {
    if (Platform.OS === 'web') {
      return (
        <input
          type="date"
          value={date.toISOString().split('T')[0]}
          onChange={(e) => setDate(new Date(e.target.value))}
          style={{
            padding: 10,
            fontSize: 16,
            borderRadius: 8,
            border: '1px solid #ccc',
            width: '100%',
          }}
        />
      );
    }

    return showDatePicker && (
      <DateTimePicker
        value={date}
        mode="date"
        onChange={(event, selectedDate) => {
          setShowDatePicker(false);
          if (selectedDate) setDate(selectedDate);
        }}
      />
    );
  };

  const renderTimePicker = () => {
    if (Platform.OS === 'web') {
      return (
        <input
          type="time"
          value={time.toTimeString().slice(0, 5)}
          onChange={(e) => {
            const [hours, minutes] = e.target.value.split(':');
            const newTime = new Date();
            newTime.setHours(parseInt(hours), parseInt(minutes));
            setTime(newTime);
          }}
          style={{
            padding: 10,
            fontSize: 16,
            borderRadius: 8,
            border: '1px solid #ccc',
            width: '100%',
          }}
        />
      );
    }

    return showTimePicker && (
      <DateTimePicker
        value={time}
        mode="time"
        onChange={(event, selectedTime) => {
          setShowTimePicker(false);
          if (selectedTime) setTime(selectedTime);
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={28} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Add Health Reminder</Text>
      </View>

      <ScrollView style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter reminder title"
            placeholderTextColor={theme.colors.textSecondary}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Type</Text>
          <View style={styles.typeContainer}>
            {(['medicine', 'appointment', 'checkup'] as const).map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.typeButton, type === t && styles.activeTypeButton]}
                onPress={() => setType(t)}
              >
                <Text style={[styles.typeText, type === t && styles.activeTypeText]}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date</Text>
          {Platform.OS === 'web' ? (
            renderDatePicker()
          ) : (
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Calendar size={20} color={theme.colors.primary} />
              <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Time</Text>
          {Platform.OS === 'web' ? (
            renderTimePicker()
          ) : (
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Clock size={20} color={theme.colors.primary} />
              <Text style={styles.dateText}>
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Reminder</Text>
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
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.m,
    ...theme.typography.body,
    color: theme.colors.text,
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeButton: {
    flex: 1,
    backgroundColor: 'white',
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.medium,
    alignItems: 'center',
    marginHorizontal: 4,
    ...theme.shadow.small,
  },
  activeTypeButton: {
    backgroundColor: theme.colors.primary,
  },
  typeText: {
    ...theme.typography.button,
    color: theme.colors.text,
  },
  activeTypeText: {
    color: 'white',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.medium,
    ...theme.shadow.small,
  },
  dateText: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginLeft: theme.spacing.m,
  },
  footer: {
    padding: theme.spacing.l,
    backgroundColor: 'white',
    ...theme.shadow.medium,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.medium,
    alignItems: 'center',
  },
  saveButtonText: {
    ...theme.typography.button,
    color: 'white',
  },
});