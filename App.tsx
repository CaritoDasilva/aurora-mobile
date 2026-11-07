import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts, AtkinsonHyperlegible_400Regular, AtkinsonHyperlegible_700Bold } from '@expo-google-fonts/atkinson-hyperlegible';
import { Nunito_700Bold, Nunito_900Black } from '@expo-google-fonts/nunito';
import { useAurora } from './src/hooks/useAurora';
import { setupNotifications } from './src/services/nativeSkills';
import { useVoiceRecorder } from './src/hooks/useVoiceRecorder';
import { MessageBubble } from './src/components/MessageBubble';
import { VoiceButton } from './src/components/VoiceButton';
import { ConfirmationCard } from './src/components/ConfirmationCard';
import { LoginPhoneScreen } from './src/components/LoginPhoneScreen';
import { LoginCodeScreen } from './src/components/LoginCodeScreen';
import { colors, fonts, fontSize, touch, radius } from './src/theme';

type Screen = 'login-phone' | 'login-code' | 'chat';

export default function App() {
  const [fontsLoaded] = useFonts({
    AtkinsonHyperlegible_400Regular,
    AtkinsonHyperlegible_700Bold,
    Nunito_700Bold,
    Nunito_900Black,
  });
  const [screen, setScreen] = useState<Screen>('login-phone');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    setupNotifications().catch((e) => console.warn('Notifications setup failed:', e));
  }, []);

  if (!fontsLoaded) {
    return <View style={styles.container} />;
  }

  if (screen === 'login-phone') {
    return (
      <LoginPhoneScreen
        onContinue={(p) => {
          setPhone(p);
          setScreen('login-code');
        }}
      />
    );
  }

  if (screen === 'login-code') {
    return (
      <LoginCodeScreen
        phone={phone}
        onChangeNumber={() => setScreen('login-phone')}
        onComplete={() => setScreen('chat')}
      />
    );
  }

  return <ChatScreen />;
}

function ChatScreen() {
  const {
    messages, appState, confirmationPrompt, sendText, sendVoice, confirm, cancel,
    say, dismissBlocked, speechEnabled, toggleSpeech,
  } = useAurora();
  const { isRecording, startRecording, stopRecording } = useVoiceRecorder();
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  async function handleVoicePress() {
    if (isRecording) {
      try {
        const { base64, format } = await stopRecording();
        await sendVoice(base64, format);
      } catch (e: any) {
        console.error('Voice error:', e);
        say('No pude grabar tu voz. Inténtalo de nuevo o escríbeme tu mensaje.');
      }
    } else {
      try {
        await startRecording();
      } catch (e: any) {
        console.error('Start recording error:', e);
        const denied = String(e?.message ?? e).includes('permission');
        say(
          denied
            ? 'Necesito permiso para usar el micrófono. Puedes activarlo en los Ajustes del teléfono, o escribirme tu mensaje.'
            : 'No pude empezar a grabar. Inténtalo de nuevo o escríbeme tu mensaje.'
        );
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
          <Text style={styles.loadingText}>Estoy pensando un momento…</Text>
        </View>
      );
    }

    if (appState === 'awaiting_confirmation') {
      return (
        <ConfirmationCard
          prompt={confirmationPrompt ?? '¿Quieres continuar?'}
          onConfirm={confirm}
          onCancel={cancel}
        />
      );
    }

    if (appState === 'blocked') {
      return (
        <View style={styles.blockedArea}>
          <Text style={styles.blockedEyebrow}>NO PUDE HACERLO</Text>
          <Text style={styles.blockedText}>
            Esta acción no está disponible en este momento.
          </Text>
          <TouchableOpacity
            style={styles.understoodButton}
            onPress={dismissBlocked}
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
            placeholderTextColor={colors.textSecondary}
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
        <View style={styles.flex}>
          <Text style={styles.headerTitle}>🌅 Aurora</Text>
          <Text style={styles.headerSubtitle}>Tu asistente</Text>
        </View>
        <TouchableOpacity
          style={styles.speechToggle}
          onPress={toggleSpeech}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={speechEnabled ? 'Silenciar la voz de Aurora' : 'Activar la voz de Aurora'}
        >
          <Text style={styles.speechToggleText}>{speechEnabled ? '🔊 Voz' : '🔇 Voz'}</Text>
        </TouchableOpacity>
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
    backgroundColor: colors.bgCanvas,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCanvas,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: colors.borderSubtle,
  },
  headerTitle: {
    fontFamily: fonts.displayBlack,
    fontSize: 30,
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
  speechToggle: {
    minHeight: touch.min,
    minWidth: touch.min,
    paddingHorizontal: 16,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    backgroundColor: colors.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speechToggleText: {
    fontFamily: fonts.bodyBold,
    fontSize: fontSize.label,
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontFamily: fonts.body,
    fontSize: fontSize.label,
    color: colors.textSecondary,
    marginTop: 2,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 16,
  },
  inputContainer: {
    backgroundColor: colors.bgCanvas,
    borderTopWidth: 2,
    borderTopColor: colors.borderSubtle,
    paddingTop: 12,
    paddingBottom: 16,
  },
  idleArea: {
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: touch.spacing,
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 10,
  },
  textInput: {
    flex: 1,
    height: touch.min,
    backgroundColor: colors.bgElevated,
    borderRadius: radius.md,
    paddingHorizontal: 20,
    fontFamily: fonts.body,
    fontSize: fontSize.label,
    color: colors.textPrimary,
    borderWidth: 2,
    borderColor: colors.borderSubtle,
  },
  sendButton: {
    height: touch.min,
    paddingHorizontal: 22,
    backgroundColor: colors.accentSun,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.borderStrong,
  },
  sendButtonText: {
    fontFamily: fonts.bodyBold,
    fontSize: fontSize.label,
    color: colors.textOnAccent,
  },
  loadingArea: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 12,
  },
  loadingText: {
    fontFamily: fonts.body,
    fontSize: fontSize.body,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  blockedArea: {
    marginHorizontal: 12,
    backgroundColor: colors.bgSubtle,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.warning,
    padding: 24,
    gap: 12,
  },
  blockedEyebrow: {
    fontFamily: fonts.bodyBold,
    fontSize: fontSize.eyebrow,
    letterSpacing: 1,
    color: colors.warning,
    textAlign: 'center',
  },
  blockedText: {
    fontFamily: fonts.body,
    fontSize: fontSize.body,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 32,
  },
  understoodButton: {
    height: touch.comfortable,
    backgroundColor: colors.accentSun,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  understoodButtonText: {
    fontFamily: fonts.bodyBold,
    fontSize: fontSize.body,
    color: colors.textOnAccent,
  },
});
