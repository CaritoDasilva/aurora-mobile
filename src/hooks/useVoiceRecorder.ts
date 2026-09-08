import { useState, useRef } from 'react';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

export function useVoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);

  async function startRecording() {
    const { status } = await Audio.requestPermissionsAsync();
    if (status !== 'granted') throw new Error('Microphone permission denied');

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const { recording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );
    recordingRef.current = recording;
    setIsRecording(true);
    setAudioBase64(null);
  }

  async function stopRecording(): Promise<{ base64: string; format: string }> {
    if (!recordingRef.current) throw new Error('No active recording');

    await recordingRef.current.stopAndUnloadAsync();
    const uri = recordingRef.current.getURI();
    recordingRef.current = null;
    setIsRecording(false);

    if (!uri) throw new Error('Recording URI not available');

    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const format = uri.split('.').pop()?.split(/[?#]/)[0] || 'm4a';
    setAudioBase64(base64);
    return { base64, format };
  }

  return { isRecording, startRecording, stopRecording, audioBase64 };
}
