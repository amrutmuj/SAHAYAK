import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Calendar, CircleAlert as AlertCircle, Clock, Check } from 'lucide-react-native';
import { theme } from '@/constants/theme';

export interface HealthReminder {
  id: string;
  title: string;
  time: string;
  date: string;
  type: 'medicine' | 'appointment' | 'checkup';
  completed?: boolean;
}

interface HealthCardProps {
  reminder: HealthReminder;
  onComplete: (id: string) => void;
  onPress: (reminder: HealthReminder) => void;
}

const HealthCard: React.FC<HealthCardProps> = ({
  reminder,
  onComplete,
  onPress,
}) => {
  const getIconByType = () => {
    switch (reminder.type) {
      case 'appointment':
        return <Calendar size={24} color={theme.colors.secondary} />;
      case 'checkup':
        return <AlertCircle size={24} color={theme.colors.warning} />;
      default:
        return <Clock size={24} color={theme.colors.primary} />;
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.card, 
        reminder.completed ? styles.completedCard : null
      ]}
      onPress={() => onPress(reminder)}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          {getIconByType()}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{reminder.title}</Text>
          <Text style={styles.time}>{reminder.time} - {reminder.date}</Text>
        </View>
      </View>
      
      <TouchableOpacity 
        style={[
          styles.completeButton,
          reminder.completed ? styles.completedButton : null
        ]}
        onPress={() => onComplete(reminder.id)}
      >
        <Check size={22} color={reminder.completed ? 'white' : theme.colors.textSecondary} />
        <Text style={[
          styles.completeText,
          reminder.completed ? styles.completedText : null
        ]}>
          {reminder.completed ? 'Completed' : 'Mark complete'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
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
  completedCard: {
    opacity: 0.7,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(92, 107, 192, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.m,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...theme.typography.title3,
    color: theme.colors.text,
    marginBottom: 4,
  },
  time: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.s,
    borderRadius: theme.borderRadius.small,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  completedButton: {
    backgroundColor: theme.colors.success,
    borderColor: theme.colors.success,
  },
  completeText: {
    ...theme.typography.button,
    color: theme.colors.textSecondary,
    marginLeft: 8,
  },
  completedText: {
    color: 'white',
  },
});

export default HealthCard;