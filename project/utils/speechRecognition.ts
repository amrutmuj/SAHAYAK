import { Platform } from 'react-native';
import * as Speech from 'expo-speech';

interface SpeechRecognitionResult {
  value: string;
  isFinal: boolean;
}

interface SpeechRecognitionOptions {
  continuous?: boolean;
  interimResults?: boolean;
  language?: string;
  maxDuration?: number;
}

const defaultOptions: SpeechRecognitionOptions = {
  continuous: true,
  interimResults: true,
  language: 'en-US',
  maxDuration: 30000 // 30 seconds
};

// Voice configuration (female voice)
export const speechOptions = {
  language: 'en-US',
  pitch: 1.2,
  rate: 0.9,
  voice: 'com.apple.speech.synthesis.voice.samantha',
};

export const speak = (text: string) => {
  Speech.speak(text, speechOptions);
};

class SpeechRecognition {
  private recognition: any;
  private isListening: boolean = false;
  private options: SpeechRecognitionOptions;
  private timeoutId: NodeJS.Timeout | null = null;

  constructor(options: SpeechRecognitionOptions = defaultOptions) {
    this.options = { ...defaultOptions, ...options };

    if (Platform.OS === 'web') {
      try {
        const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
          this.recognition = new SpeechRecognition();
          this.recognition.continuous = this.options.continuous!;
          this.recognition.interimResults = this.options.interimResults!;
          this.recognition.lang = this.options.language!;
        } else {
          console.warn('Speech recognition is not supported in this browser');
        }
      } catch (error) {
        console.error('Failed to initialize speech recognition:', error);
      }
    }
  }

  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'web') {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        return true;
      } catch (error) {
        console.error('Microphone permission denied:', error);
        return false;
      }
    }
    return true;
  }

  start(
    onResult: (result: SpeechRecognitionResult) => void,
    onError: (error: string) => void,
    onStart?: () => void,
    onEnd?: () => void
  ): void {
    if (!this.isAvailable()) {
      onError('Speech recognition is not available on this platform or browser');
      return;
    }

    this.requestPermissions().then(hasPermission => {
      if (!hasPermission) {
        onError('Microphone permission is required for speech recognition');
        return;
      }

      if (this.isListening) {
        try {
          this.recognition?.abort?.();
        } catch (_) {}
        this.isListening = false;
      }

      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }

      if (Platform.OS === 'web' && this.recognition) {
        setTimeout(() => {
          this.recognition.onstart = () => {
            this.isListening = true;
            onStart?.();

            this.timeoutId = setTimeout(() => {
              if (this.isListening) {
                this.stop();
                speak("I'm done listening now");
              }
            }, this.options.maxDuration);
          };

          this.recognition.onresult = (event: any) => {
            const result = event.results[event.results.length - 1];
            const transcription = result[0].transcript;
            const isFinal = result.isFinal;

            if (transcription && transcription.trim() !== '') {
              onResult({ value: transcription, isFinal });
            }
          };

          this.recognition.onspeechend = () => this.stop();
          this.recognition.onaudioend = () => this.stop();

          this.recognition.onerror = (event: any) => {
            if (event.error === 'no-speech') return; // Ignore "no-speech"
            const errorMessage = `Speech recognition error: ${event.error}`;
            console.error(errorMessage);
            onError(errorMessage);
            this.isListening = false;
          };

          this.recognition.onend = () => {
            this.isListening = false;
            if (this.timeoutId) {
              clearTimeout(this.timeoutId);
              this.timeoutId = null;
            }
            onEnd?.();
          };

          try {
            this.recognition.start();
          } catch (error) {
            const errorMessage = `Failed to start speech recognition: ${error}`;
            console.error(errorMessage);
            onError(errorMessage);
            this.isListening = false;
            onEnd?.();
          }
        }, 100); // Delay to reset internal state
      } else if (Platform.OS === 'android') {
        const Intent = (global as any).Android?.Intent;
        if (Intent) {
          const intent = new Intent(Intent.ACTION_RECOGNIZE_SPEECH);
          intent.putExtra(Intent.EXTRA_LANGUAGE_MODEL, Intent.LANGUAGE_MODEL_FREE_FORM);
          intent.putExtra(Intent.EXTRA_LANGUAGE, this.options.language);
          intent.putExtra(Intent.EXTRA_PROMPT, "I'm listening...");
          intent.putExtra(Intent.EXTRA_SPEECH_INPUT_MINIMUM_LENGTH_MILLIS, this.options.maxDuration);

          try {
            this.isListening = true;
            onStart?.();
            (global as any).Android.startActivityForResult(
              intent,
              (resultCode: number, data: any) => {
                if (resultCode === -1 && data?.matches?.length > 0) {
                  onResult({ value: data.matches[0], isFinal: true });
                } else {
                  onError('No speech detected');
                }
                this.isListening = false;
                onEnd?.();
              }
            );
          } catch (e) {
            onError('Failed to start speech recognition');
            this.isListening = false;
            onEnd?.();
          }
        } else {
          onError('Android native speech interface not available');
        }
      } else {
        onError('Speech recognition not implemented on this platform');
      }
    });
  }

  stop(): void {
    if (Platform.OS === 'web' && this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  abort(): void {
    if (Platform.OS === 'web' && this.recognition && this.isListening) {
      this.recognition.abort();
      this.isListening = false;
    }
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  isAvailable(): boolean {
    if (Platform.OS === 'web') {
      return !!(window.SpeechRecognition || (window as any).webkitSpeechRecognition);
    }
    return Platform.OS === 'android'; // Can be expanded for iOS
  }
}

export const speechRecognition = new SpeechRecognition();
