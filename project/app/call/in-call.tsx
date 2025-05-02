import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Mic, MicOff, PhoneOff, Volume2, Video, VideoOff } from 'lucide-react-native';
import { theme } from '@/constants/theme';
import * as Speech from 'expo-speech';

export default function InCallScreen() {
  const params = useLocalSearchParams();
  const { id, name, photo, isVideo } = params;
  
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(isVideo === 'true');
  
  // Simulate call connection
  useEffect(() => {
    const connectionMessage = isVideoEnabled 
      ? `Starting video call with ${name}` 
      : `Calling ${name}`;
      
    Speech.speak(connectionMessage, {
      language: 'en-US',
      rate: 0.9,
    });
    
    // Start timer for call duration
    const intervalId = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleMute = () => {
    setIsMuted(!isMuted);
    Speech.speak(isMuted ? 'Microphone on' : 'Microphone off', {
      language: 'en-US',
      rate: 0.9,
    });
  };
  
  const handleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
    Speech.speak(isSpeakerOn ? 'Speaker off' : 'Speaker on', {
      language: 'en-US',
      rate: 0.9,
    });
  };
  
  const handleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    Speech.speak(isVideoEnabled ? 'Video off' : 'Video on', {
      language: 'en-US',
      rate: 0.9,
    });
  };
  
  const endCall = () => {
    Speech.speak('Call ended', {
      language: 'en-US',
      rate: 0.9,
    });
    router.back();
  };
  
  return (
    <View style={styles.container}>
      {isVideoEnabled ? (
        // Video call layout
        <View style={styles.videoContainer}>
          <View style={styles.mainVideo}>
            {/* This would be the remote video feed in a real app */}
            {photo ? (
              <Image source={{ uri: photo as string }} style={styles.videoPlaceholder} />
            ) : (
              <View style={styles.videoPlaceholder}>
                <Text style={styles.videoPlaceholderText}>{name?.toString()[0]}</Text>
              </View>
            )}
          </View>
          
          <View style={styles.selfVideo}>
            {/* This would be the self video feed in a real app */}
            <View style={styles.selfVideoPlaceholder} />
          </View>
          
          <View style={styles.videoCallInfo}>
            <Text style={styles.videoCallerName}>{name}</Text>
            <Text style={styles.videoDuration}>{formatTime(callDuration)}</Text>
          </View>
        </View>
      ) : (
        // Audio call layout
        <View style={styles.callerContainer}>
          {photo ? (
            <Image source={{ uri: photo as string }} style={styles.callerImage} />
          ) : (
            <View style={styles.callerPlaceholder}>
              <Text style={styles.placeholderText}>{name?.toString()[0]}</Text>
            </View>
          )}
          <Text style={styles.callerName}>{name}</Text>
          <Text style={styles.callStatus}>In call • {formatTime(callDuration)}</Text>
        </View>
      )}
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, isMuted ? styles.actionButtonActive : null]}
          onPress={handleMute}
        >
          {isMuted ? (
            <MicOff size={28} color="white" />
          ) : (
            <Mic size={28} color="white" />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.endCallButton]}
          onPress={endCall}
        >
          <PhoneOff size={28} color="white" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, isSpeakerOn ? styles.actionButtonActive : null]}
          onPress={handleSpeaker}
        >
          <Volume2 size={28} color="white" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, isVideoEnabled ? styles.actionButtonActive : null]}
          onPress={handleVideo}
        >
          {isVideoEnabled ? (
            <Video size={28} color="white" />
          ) : (
            <VideoOff size={28} color="white" />
          )}
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
  callerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.l,
  },
  callerImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: theme.spacing.l,
  },
  callerPlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.l,
  },
  placeholderText: {
    ...theme.typography.largeTitle,
    fontSize: 80,
    color: 'white',
  },
  callerName: {
    ...theme.typography.title1,
    color: theme.colors.text,
    marginBottom: theme.spacing.s,
  },
  callStatus: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: theme.spacing.l,
    backgroundColor: 'white',
    ...theme.shadow.medium,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonActive: {
    backgroundColor: theme.colors.secondary,
  },
  endCallButton: {
    backgroundColor: theme.colors.error,
  },
  videoContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  mainVideo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlaceholderText: {
    ...theme.typography.largeTitle,
    fontSize: 100,
    color: 'white',
  },
  selfVideo: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 100,
    height: 150,
    borderRadius: theme.borderRadius.medium,
    overflow: 'hidden',
  },
  selfVideoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.primaryDark,
  },
  videoCallInfo: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  videoCallerName: {
    ...theme.typography.title3,
    color: 'white',
  },
  videoDuration: {
    ...theme.typography.caption,
    color: 'rgba(255, 255, 255, 0.8)',
  },
});