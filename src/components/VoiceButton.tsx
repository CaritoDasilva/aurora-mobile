import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { colors, fonts, touch } from '../theme';

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
    width: touch.voiceLg,
    height: touch.voiceLg,
    borderRadius: touch.voiceLg / 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accentSun,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 6,
  },
  idle: {
    backgroundColor: colors.accentSun,
  },
  recording: {
    backgroundColor: colors.error,
  },
  icon: {
    fontSize: 28,
  },
  label: {
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    color: colors.textOnAccent,
    marginTop: 2,
    letterSpacing: 0.5,
  },
});
