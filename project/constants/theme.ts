export const theme = {
  colors: {
    primary: '#5C6BC0', // Soft indigo
    primaryLight: '#8E99F3',
    primaryDark: '#26418F',
    secondary: '#26A69A', // Teal
    accent: '#FF8A65', // Coral
    success: '#66BB6A',
    warning: '#FFA726',
    error: '#EF5350',
    background: '#F5F7FF',
    card: '#FFFFFF',
    text: '#333333',
    textSecondary: '#757575',
    border: '#E0E0E0',
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    small: 8,
    medium: 12,
    large: 16,
    circle: 999,
  },
  typography: {
    largeTitle: {
      fontFamily: 'Inter-Bold',
      fontSize: 34,
      lineHeight: 41,
      letterSpacing: 0.25,
    },
    title1: {
      fontFamily: 'Inter-Bold',
      fontSize: 28,
      lineHeight: 34,
    },
    title2: {
      fontFamily: 'Inter-Bold',
      fontSize: 22,
      lineHeight: 28,
    },
    title3: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 20,
      lineHeight: 24,
    },
    body: {
      fontFamily: 'Inter-Regular',
      fontSize: 18,
      lineHeight: 27,
    },
    bodyLarge: {
      fontFamily: 'Inter-Regular',
      fontSize: 22,
      lineHeight: 33,
    },
    button: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 18,
      lineHeight: 22,
    },
    caption: {
      fontFamily: 'Inter-Regular',
      fontSize: 16,
      lineHeight: 20,
    },
  },
  shadow: {
    small: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.15,
      shadowRadius: 3.84,
      elevation: 3,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.2,
      shadowRadius: 5.46,
      elevation: 5,
    },
  },
};