import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, fontSize, touch, radius, gradientAurora } from '../theme';
import { CodeInput } from './CodeInput';

interface Props {
  phone: string;
  onChangeNumber: () => void;
  onComplete: () => void;
}

const CODE_LENGTH = 6;

export function LoginCodeScreen({ phone, onChangeNumber, onComplete }: Props) {
  const [code, setCode] = useState('');

  useEffect(() => {
    if (code.length === CODE_LENGTH) {
      const t = setTimeout(onComplete, 600);
      return () => clearTimeout(t);
    }
  }, [code]);

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

      <View style={styles.body}>
        <Text style={styles.screenTitle}>Escribí el código</Text>
        <Text style={styles.screenHint}>
          Te mandamos un mensaje a <Text style={styles.bold}>+56 {phone}</Text>. Buscalo y escribí los seis números.
        </Text>

        <View style={styles.codeWrap}>
          <CodeInput value={code} />
          {/* Input real transparente sobre la grilla: tocar cualquier celda abre el teclado numérico */}
          <TextInput
            style={styles.overlayInput}
            value={code}
            onChangeText={(t) => setCode(t.replace(/[^0-9]/g, '').slice(0, CODE_LENGTH))}
            keyboardType="number-pad"
            maxLength={CODE_LENGTH}
            autoFocus
            accessibilityLabel="Código de seis dígitos"
          />
        </View>

        <View style={styles.resendRow}>
          <Text style={styles.resendText}>¿No te llegó?</Text>
          <TouchableOpacity accessibilityLabel="Mandar de nuevo">
            <Text style={styles.resendLink}>Mandar de nuevo</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={onChangeNumber}
          activeOpacity={0.8}
          accessibilityLabel="Cambiar número"
        >
          <Text style={styles.secondaryButtonText}>Cambiar número</Text>
        </TouchableOpacity>

        <View style={styles.helper}>
          <Text style={styles.helperTitle}>Puedo leerte el código.</Text>
          <Text style={styles.helperSub}>Si lo recibís, decime "léelo".</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgCanvas,
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
  bold: {
    fontFamily: fonts.bodyBold,
    color: colors.textPrimary,
  },
  codeWrap: {
    position: 'relative',
  },
  overlayInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 20,
    opacity: 0,
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    marginBottom: 16,
  },
  resendText: {
    fontFamily: fonts.body,
    fontSize: fontSize.caption,
    color: colors.textSecondary,
  },
  resendLink: {
    fontFamily: fonts.bodyBold,
    fontSize: fontSize.caption,
    color: colors.accentSun,
  },
  secondaryButton: {
    height: touch.comfortable,
    backgroundColor: colors.bgElevated,
    borderWidth: 2,
    borderColor: colors.textPrimary,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontFamily: fonts.bodyBold,
    fontSize: fontSize.body,
    color: colors.textPrimary,
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
