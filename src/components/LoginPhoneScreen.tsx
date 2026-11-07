import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, fontSize, touch, radius, gradientAurora } from '../theme';

interface Props {
  onContinue: (phone: string) => void;
}

export function LoginPhoneScreen({ onContinue }: Props) {
  const [phone, setPhone] = useState('');
  const canContinue = phone.trim().length >= 8;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={gradientAurora.colors}
        locations={gradientAurora.locations}
        style={styles.hero}
      >
        <Text style={styles.heroTitle}>🌅 Aurora</Text>
        <Text style={styles.heroTagline}>Un nuevo día para empezar.</Text>
      </LinearGradient>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.body}>
          <Text style={styles.screenTitle}>Bienvenida</Text>
          <Text style={styles.screenHint}>
            Escribe tu número de teléfono. Te mandamos un código por mensaje.
          </Text>

          <Text style={styles.inputLabel}>Número de teléfono</Text>
          <View style={styles.inputShell}>
            <View style={styles.prefix}>
              <Text style={styles.prefixText}>🇨🇱 +56</Text>
            </View>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="9 1234 5678"
              placeholderTextColor={colors.textSecondary}
              maxLength={15}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, !canContinue && styles.buttonDisabled]}
            onPress={() => canContinue && onContinue(phone.trim())}
            activeOpacity={0.8}
            disabled={!canContinue}
            accessibilityLabel="Continuar"
          >
            <Text style={styles.buttonText}>Continuar</Text>
          </TouchableOpacity>

          <View style={styles.helper}>
            <Text style={styles.helperTitle}>¿Quieres que te lea esta pantalla?</Text>
            <Text style={styles.helperSub}>Toca el círculo y te escucho.</Text>
          </View>
        </View>
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
  hero: {
    paddingTop: 32,
    paddingBottom: 36,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  heroTitle: {
    fontFamily: fonts.displayBlack,
    fontSize: 34,
    color: colors.textOnAccent,
  },
  heroTagline: {
    fontFamily: fonts.body,
    fontSize: fontSize.label,
    color: colors.textOnAccent,
    marginTop: 4,
  },
  body: {
    flex: 1,
    padding: 24,
  },
  screenTitle: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  screenHint: {
    fontFamily: fonts.body,
    fontSize: 17,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 24,
  },
  inputLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  inputShell: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  prefix: {
    justifyContent: 'center',
    backgroundColor: colors.bgSubtle,
    borderRadius: radius.md,
    paddingHorizontal: 16,
  },
  prefixText: {
    fontFamily: fonts.bodyBold,
    fontSize: fontSize.label,
    color: colors.textPrimary,
  },
  input: {
    flex: 1,
    height: touch.min,
    backgroundColor: colors.bgElevated,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.borderSubtle,
    paddingHorizontal: 16,
    fontFamily: fonts.bodyBold,
    fontSize: fontSize.label,
    color: colors.textPrimary,
  },
  button: {
    height: touch.comfortable,
    backgroundColor: colors.accentSun,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: colors.borderStrong,
  },
  buttonText: {
    fontFamily: fonts.bodyBold,
    fontSize: fontSize.body,
    color: colors.textOnAccent,
  },
  helper: {
    marginTop: 'auto',
    alignItems: 'center',
    paddingTop: 24,
  },
  helperTitle: {
    fontFamily: fonts.bodyBold,
    fontSize: fontSize.caption,
    color: colors.textPrimary,
  },
  helperSub: {
    fontFamily: fonts.body,
    fontSize: fontSize.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
