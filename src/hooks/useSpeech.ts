import { useCallback, useRef, useState } from 'react';
import * as Speech from 'expo-speech';

// Voz de salida de Aurora en español de Chile. Se puede silenciar desde el encabezado.
export function useSpeech() {
  const [enabled, setEnabled] = useState(true);
  const enabledRef = useRef(true);

  const stop = useCallback(() => {
    Speech.stop();
  }, []);

  const speak = useCallback((text: string) => {
    if (!enabledRef.current || !text.trim()) return;
    Speech.stop();
    Speech.speak(text, {
      language: 'es-CL',
      rate: 0.85, // más lento: pensado para personas mayores
      onError: (e) => console.warn('Speech error:', e),
    });
  }, []);

  const toggle = useCallback(() => {
    const next = !enabledRef.current;
    enabledRef.current = next;
    setEnabled(next);
    if (!next) Speech.stop();
  }, []);

  return { speak, stop, toggle, enabled };
}
