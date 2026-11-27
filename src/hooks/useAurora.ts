import { useState, useCallback } from 'react';
import { Message, AppState, EngineResponse } from '../types';
import { processText, processVoice, confirmAction, cancelAction, reportResult } from '../services/api';
import { executeSkillCall } from '../services/nativeSkills';

function makeId() {
  return Math.random().toString(36).slice(2);
}

function makeMessage(role: Message['role'], text: string): Message {
  return { id: makeId(), role, text, timestamp: new Date() };
}

export function useAurora() {
  const [messages, setMessages] = useState<Message[]>([
    makeMessage('aurora', '¡Hola! Soy Aurora. ¿En qué te ayudo hoy?'),
  ]);
  const [appState, setAppState] = useState<AppState>('idle');
  const [pendingActionId, setPendingActionId] = useState<string | undefined>();
  const [confirmationPrompt, setConfirmationPrompt] = useState<string | undefined>();

  function addMessage(role: Message['role'], text: string) {
    setMessages((prev) => [...prev, makeMessage(role, text)]);
  }

  async function handleResponse(res: EngineResponse) {
    addMessage('aurora', res.message);

    if (res.status === 'awaiting_confirmation') {
      setPendingActionId(res.pendingActionId);
      setConfirmationPrompt(res.confirmationPrompt);
      setAppState('awaiting_confirmation');
      return;
    }

    if (res.status === 'blocked') {
      setAppState('blocked');
      return;
    }

    setPendingActionId(undefined);
    setConfirmationPrompt(undefined);

    // Si el backend devolvió una acción nativa, ESTE teléfono la ejecuta.
    if (res.skillCall) {
      const outcome = await executeSkillCall(res.skillCall);
      // Evita burbuja duplicada si el mensaje ya describe lo mismo.
      if (!outcome.success || outcome.message !== res.message) {
        addMessage('aurora', outcome.message);
      }
      reportResult({
        skillName: res.skillCall.name,
        success: outcome.success,
        message: outcome.message,
      });
    }

    setAppState('idle');
  }

  const sendText = useCallback(async (text: string) => {
    if (!text.trim()) return;
    addMessage('user', text);
    setAppState('loading');
    try {
      const res = await processText(text);
      await handleResponse(res);
    } catch (e: any) {
      addMessage('aurora', 'Perdón, hubo un error al conectar con el servidor. Revisá tu conexión.');
      setAppState('idle');
    }
  }, []);

  const sendVoice = useCallback(async (audioBase64: string, audioFormat: string) => {
    setAppState('loading');
    try {
      const res = await processVoice(audioBase64, audioFormat);
      addMessage('user', '[Mensaje de voz]');
      await handleResponse(res);
    } catch (e: any) {
      addMessage('aurora', 'Perdón, hubo un error al procesar tu voz. Intentá de nuevo.');
      setAppState('idle');
    }
  }, []);

  const confirm = useCallback(async () => {
    if (!pendingActionId) return;
    setAppState('loading');
    try {
      const res = await confirmAction(pendingActionId);
      await handleResponse(res);
    } catch (e: any) {
      addMessage('aurora', 'Perdón, hubo un error al confirmar la acción.');
      setAppState('idle');
    }
  }, [pendingActionId]);

  const cancel = useCallback(async () => {
    setAppState('loading');
    try {
      const res = await cancelAction();
      await handleResponse(res);
    } catch (e: any) {
      addMessage('aurora', 'Acción cancelada.');
      setAppState('idle');
    }
    setPendingActionId(undefined);
    setConfirmationPrompt(undefined);
  }, []);

  /** Cierre local de estados terminales (p.ej. "Entendido" tras un bloqueo). */
  const reset = useCallback(() => {
    setPendingActionId(undefined);
    setConfirmationPrompt(undefined);
    setAppState('idle');
  }, []);

  return { messages, appState, pendingActionId, confirmationPrompt, sendText, sendVoice, confirm, cancel, reset };
}
