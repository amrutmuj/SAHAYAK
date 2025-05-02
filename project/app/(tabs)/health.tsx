import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { CirclePlus as PlusCircle, Archive } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import HealthCard, { HealthReminder } from '@/components/HealthCard';
import { getHealthReminders, saveHealthReminders } from '@/utils/storage';
import VoiceCommandListener from '@/components/VoiceCommandListener';
import { router } from 'expo-router';

export default function HealthScreen() {
  const [reminders, setReminders] = useState<HealthReminder[]>([]);
  const [filterType, setFilterType] = useState<string>('active');

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    const savedReminders = await getHealthReminders();
    if (savedReminders.length > 0) {
      setReminders(savedReminders);
    }
  };

  const handleCompleteReminder = async (id: string) => {
    const updatedReminders = reminders.map(reminder => 
      reminder.id === id 
        ? { ...reminder, completed: !reminder.completed } 
        : reminder
    );
    
    setReminders(updatedReminders);
    await saveHealthReminders(updatedReminders);
  };

  const handleAddReminder = () => {
    router.push('/health/add-reminder');
  };

  const filteredReminders = reminders.filter(reminder => {
    if (filterType === 'active') return !reminder.completed;
    if (filterType === 'completed') return reminder.completed;
    if (filterType === 'medicine') return reminder.type === 'medicine' && !reminder.completed;
    if (filterType === 'appointment') return reminder.type === 'appointment' && !reminder.completed;
    if (filterType === 'checkup') return reminder.type === 'checkup' && !reminder.completed;
    return true;
  });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Health Reminders</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleAddReminder}>
            <PlusCircle size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[styles.filterButton, filterType === 'active' && styles.activeFilter]}
              onPress={() => setFilterType('active')}
            >
              <Text style={[styles.filterText, filterType === 'active' && styles.activeFilterText]}>
                Active
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.filterButton, filterType === 'completed' && styles.activeFilter]}
              onPress={() => setFilterType('completed')}
            >
              <Archive size={16} color={filterType === 'completed' ? 'white' : theme.colors.text} />
              <Text style={[styles.filterText, filterType === 'completed' && styles.activeFilterText]}>
                Completed
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.filterButton, filterType === 'medicine' && styles.activeFilter]}
              onPress={() => setFilterType('medicine')}
            >
              <Text style={[styles.filterText, filterType === 'medicine' && styles.activeFilterText]}>
                Medicines
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.filterButton, filterType === 'appointment' && styles.activeFilter]}
              onPress={() => setFilterType('appointment')}
            >
              <Text style={[styles.filterText, filterType === 'appointment' && styles.activeFilterText]}>
                Appointments
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.filterButton, filterType === 'checkup' && styles.activeFilter]}
              onPress={() => setFilterType('checkup')}
            >
              <Text style={[styles.filterText, filterType === 'checkup' && styles.activeFilterText]}>
                Checkups
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={styles.remindersContainer}>
          {filteredReminders.map(reminder => (
            <HealthCard
              key={reminder.id}
              reminder={reminder}
              onComplete={handleCompleteReminder}
              onPress={() => {}}
            />
          ))}
          
          {filteredReminders.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No reminders found</Text>
            </View>
          )}
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
  filterContainer: {
    marginBottom: theme.spacing.l,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    borderRadius: theme.borderRadius.small,
    marginRight: theme.spacing.s,
    backgroundColor: theme.colors.card,
    ...theme.shadow.small,
  },
  activeFilter: {
    backgroundColor: theme.colors.primary,
  },
  filterText: {
    ...theme.typography.button,
    color: theme.colors.text,
    marginLeft: 4,
  },
  activeFilterText: {
    color: 'white',
  },
  remindersContainer: {
    marginBottom: theme.spacing.xxl,
  },
  emptyContainer: {
    padding: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.medium,
    ...theme.shadow.small,
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
});