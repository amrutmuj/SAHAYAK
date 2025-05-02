import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { theme } from '@/constants/theme';

interface LargeButtonProps {
  title: string;
  onPress: () => void;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: 'primary' | 'secondary' | 'outline';
}

const LargeButton: React.FC<LargeButtonProps> = ({
  title,
  onPress,
  icon,
  style,
  textStyle,
  variant = 'primary',
}) => {
  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryButton;
      case 'outline':
        return styles.outlineButton;
      default:
        return styles.primaryButton;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'outline':
        return styles.outlineText;
      default:
        return styles.buttonText;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyle(), style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {icon && <>{icon}</>}
      <Text style={[getTextStyle(), textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.l,
    borderRadius: theme.borderRadius.medium,
    minHeight: 70,
    marginVertical: theme.spacing.s,
    ...theme.shadow.small,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
  },
  secondaryButton: {
    backgroundColor: theme.colors.secondary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  buttonText: {
    ...theme.typography.button,
    color: 'white',
    marginLeft: theme.spacing.s,
  },
  outlineText: {
    ...theme.typography.button,
    color: theme.colors.primary,
    marginLeft: theme.spacing.s,
  },
});

export default LargeButton;