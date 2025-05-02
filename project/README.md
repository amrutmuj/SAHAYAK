# Sahayak Elder Companion

A voice-enabled companion app designed to help elderly users easily manage their daily activities, health reminders, and stay connected with family members.

![Sahayak Preview](../Sahayak.png)

## Features

- 🗣️ **Voice Commands**: Natural language interface for all app functions
- 📞 **Easy Calling**: Make voice and video calls to family members
- 💬 **Messaging**: Simple messaging interface with voice-to-text
- 🏥 **Health Reminders**: Manage medications and medical appointments
- 📸 **Camera**: Take photos with simple voice controls
- 🎯 **Accessibility**: Large, clear text and intuitive navigation
- 🔊 **Voice Feedback**: Gentle female voice guidance throughout the app

## Tech Stack

- React Native with Expo SDK 52
- Expo Router 4 for navigation
- TypeScript for type safety
- AsyncStorage for local data persistence
- Expo Speech for voice feedback
- Expo Camera for photo capture
- Lucide Icons for consistent UI

## Prerequisites

Before you begin, ensure you have installed:

- Node.js 18 or newer
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/amrutmuj/SAHAYAK.git
   cd project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

### Voice Commands

The app responds to natural voice commands such as:

- "Call [contact name]"
- "Send message to [contact name]"
- "Add reminder for medicine at 9 AM"
- "Take a photo"
- "Open health reminders"

### Managing Contacts

1. Tap the "+" button on the Contacts screen
2. Add contact details using voice or text input
3. Optionally add a photo
4. Save the contact

### Health Reminders

1. Navigate to the Health tab
2. Tap "+" to add a new reminder
3. Choose type: Medicine, Appointment, or Checkup
4. Set time and date
5. Enable notifications

### Making Calls

1. Open the Call tab
2. Select a contact
3. Choose between voice or video call
4. Use voice commands during the call

## Development

### Project Structure

```
project/
├── app/                    # Expo Router app directory
│   ├── (tabs)/            # Tab-based navigation
│   ├── call/              # Call-related screens
│   ├── health/            # Health reminder screens
│   └── message/           # Messaging screens
├── components/            # Reusable components
├── constants/            # Theme and configuration
├── hooks/                # Custom React hooks
└── utils/                # Helper functions
```

### Running Tests

```bash
npm run test
```

### Building for Production

```bash
npm run build:web     # For web deployment
expo build:android   # For Android
expo build:ios       # For iOS
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## Acknowledgments

- [Expo](https://expo.dev/) for the amazing development platform
- [Lucide Icons](https://lucide.dev/) for the beautiful icon set

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.
