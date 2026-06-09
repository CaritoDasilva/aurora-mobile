import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';

interface Props {
  isRecording: boolean;
  onPress: () => void;
}

export function VoiceButton({ isRecording, onPress }: Props) {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1.15, duration: 600, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1, duration: 600, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulse.stopAnimation();
      pulse.setValue(1);
    }
  }, [isRecording]);

  return (
    <Animated.View style={{ transform: [{ scale: pulse }] }}>
      <TouchableOpacity
        style={[styles.button, isRecording ? styles.recording : styles.idle]}
        onPress={onPress}
        activeOpacity={0.8}
        accessibilityLabel={isRecording ? 'Parar grabación' : 'Hablar con Aurora'}
      >
        <Text style={styles.icon}>{isRecording ? '⏹' : '🎤'}</Text>
        <Text style={styles.label}>{isRecording ? 'Parar' : 'Hablar'}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  idle: {
    backgroundColor: '#E8845C',
  },
  recording: {
    backgroundColor: '#C0392B',
  },
  icon: {
    fontSize: 24,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 2,
    letterSpacing: 0.5,
  },
});
