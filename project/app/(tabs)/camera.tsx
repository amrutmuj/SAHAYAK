import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Platform } from 'react-native';
import { Camera as LucideCamera, RotateCcw, ChevronLeft, Share2 } from 'lucide-react-native';
import { CameraView, CameraType, useCameraPermissions, CameraCapturedPicture } from 'expo-camera';
import { theme } from '@/constants/theme';
import VoiceCommandListener from '@/components/VoiceCommandListener';
import * as Speech from 'expo-speech';

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<CameraCapturedPicture | null>(null);
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    // Camera permissions are still loading
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <LucideCamera size={60} color={theme.colors.primary} style={styles.permissionIcon} />
          <Text style={styles.permissionTitle}>Camera Access Needed</Text>
          <Text style={styles.permissionText}>
            We need your permission to use the camera for taking photos.
          </Text>
          <TouchableOpacity 
            style={styles.permissionButton} 
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
    Speech.speak('Camera flipped', {
      language: 'en-US',
      rate: 0.9,
    });
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setPhoto(photo);
        Speech.speak('Photo taken', {
          language: 'en-US',
          rate: 0.9,
        });
      } catch (error) {
        console.error('Error taking picture:', error);
      }
    }
  };

  const resetCamera = () => {
    setPhoto(null);
    Speech.speak('Camera reset', {
      language: 'en-US',
      rate: 0.9,
    });
  };

  const sharePhoto = () => {
    // In a real app, this would use the Share API
    Speech.speak('Sharing photo', {
      language: 'en-US',
      rate: 0.9,
    });
  };

  // On web, we need to show a fallback
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <View style={styles.webFallback}>
          <LucideCamera size={60} color={theme.colors.primary} style={styles.permissionIcon} />
          <Text style={styles.permissionTitle}>Camera Preview</Text>
          <Text style={styles.permissionText}>
            The camera feature works best on mobile devices. Please try on your phone.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {photo ? (
        // Photo review screen
        <View style={styles.previewContainer}>
          <Image source={{ uri: photo.uri }} style={styles.previewImage} />
          
          <View style={styles.previewActions}>
            <TouchableOpacity style={styles.previewButton} onPress={resetCamera}>
              <ChevronLeft size={24} color="white" />
              <Text style={styles.previewButtonText}>Retake</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.previewButton} onPress={sharePhoto}>
              <Share2 size={24} color="white" />
              <Text style={styles.previewButtonText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // Camera screen
        <CameraView 
          ref={cameraRef}
          style={styles.camera} 
          facing={facing}
        >
          <View style={styles.cameraControls}>
            <TouchableOpacity 
              style={styles.flipButton} 
              onPress={toggleCameraFacing}
            >
              <RotateCcw size={24} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.captureButton} 
              onPress={takePicture}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
            
            <View style={styles.placeholderButton} />
          </View>
        </CameraView>
      )}
      
      <VoiceCommandListener />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.l,
  },
  permissionIcon: {
    marginBottom: theme.spacing.l,
  },
  permissionTitle: {
    ...theme.typography.title2,
    color: theme.colors.text,
    marginBottom: theme.spacing.m,
    textAlign: 'center',
  },
  permissionText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.l,
  },
  permissionButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.medium,
    ...theme.shadow.small,
  },
  permissionButtonText: {
    ...theme.typography.button,
    color: 'white',
  },
  webFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.l,
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.l,
    paddingBottom: theme.spacing.xxl,
  },
  flipButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  placeholderButton: {
    width: 50,
    height: 50,
  },
  previewContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  previewImage: {
    flex: 1,
    resizeMode: 'contain',
  },
  previewActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: theme.spacing.l,
  },
  previewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.medium,
  },
  previewButtonText: {
    ...theme.typography.button,
    color: 'white',
    marginLeft: theme.spacing.s,
  },
});