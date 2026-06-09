import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAurora } from './src/hooks/useAurora';
import { useVoiceRecorder } from './src/hooks/useVoiceRecorder';
import { MessageBubble } from './src/components/MessageBubble';
import { VoiceButton } from './src/components/VoiceButton';
import { ConfirmationCard } from './src/components/ConfirmationCard';

export default function App() {
  const { messages, appState, confirmationPrompt, sendText, sendVoice, confirm, cancel } =
    useAurora();
  const { isRecording, startRecording, stopRecording } = useVoiceRecorder();
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  async function handleVoicePress() {
    if (isRecording) {
      try {
        const base64 = await stopRecording();
        await sendVoice(base64);
      } catch (e: any) {
        console.error('Voice error:', e);
      }
    } else {
      try {
        await startRecording();
      } catch (e: any) {
        console.error('Start recording error:', e);
      }
    }
  }

  async function handleSendText() {
    const text = inputText.trim();
    if (!text) return;
    setInputText('');
    await sendText(text);
  }

  function renderInputArea() {
    if (appState === 'loading') {
      return (
        <View style={styles.loadingArea}>
          <ActivityIndicator size="large" color="#E8845C" />
          <Text style={styles.loadingText}>Aurora está pensando...</Text>
        </View>
      );
    }

    if (appState === 'awaiting_confirmation') {
      return (
        <ConfirmationCard
          prompt={confirmationPrompt ?? '¿Deseas continuar?'}
          onConfirm={confirm}
          onCancel={cancel}
        />
      );
    }

    if (appState === 'blocked') {
      return (
        <View style={styles.blockedArea}>
          <Text style={styles.blockedText}>
            ⚠️ Esta acción no está disponible en este momento.
          </Text>
          <TouchableOpacity
            style={styles.understoodButton}
            onPress={() => sendText('entendido')}
            activeOpacity={0.8}
          >
            <Text style={styles.understoodButtonText}>Entendido</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // idle or recording
    return (
      <View style={styles.idleArea}>
        <VoiceButton isRecording={isRecording} onPress={handleVoicePress} />
        <View style={styles.textRow}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Escribe tu mensaje..."
            placeholderTextColor="#B89880"
            multiline={false}
            returnKeyType="send"
            onSubmitEditing={handleSendText}
            editable={!isRecording}
          />
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={handleSendText}
            activeOpacity={0.8}
            disabled={!inputText.trim()}
          >
            <Text style={styles.sendButtonText}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🌅 Aurora</Text>
        <Text style={styles.headerSubtitle}>Tu asistente personal</Text>
      </View>

      {/* Messages + Input */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
        </ScrollView>

        <View style={styles.inputContainer}>{renderInputArea()}</View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  flex: {
    flex: 1,
  },
  header: {
    backgroundColor: '#FFF8F0',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0DDD0',
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: '#2C1810',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#8C5A40',
    marginTop: 2,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 16,
  },
  inputContainer: {
    backgroundColor: '#FFF8F0',
    borderTopWidth: 1,
    borderTopColor: '#F0DDD0',
    paddingTop: 12,
    paddingBottom: 16,
  },
  idleArea: {
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 16,
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 10,
  },
  textInput: {
    flex: 1,
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingHorizontal: 20,
    fontSize: 20,
    color: '#2C1810',
    borderWidth: 1.5,
    borderColor: '#E8C5B0',
  },
  sendButton: {
    height: 56,
    paddingHorizontal: 22,
    backgroundColor: '#E8845C',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#D4B5A4',
  },
  sendButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  loadingArea: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 12,
  },
  loadingText: {
    fontSize: 20,
    color: '#8C5A40',
    fontStyle: 'italic',
  },
  blockedArea: {
    marginHorizontal: 12,
    backgroundColor: '#FFF3CD',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#F0AD4E',
    padding: 16,
    gap: 12,
  },
  blockedText: {
    fontSize: 20,
    color: '#856404',
    textAlign: 'center',
    lineHeight: 28,
  },
  understoodButton: {
    height: 56,
    backgroundColor: '#E8845C',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  understoodButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
