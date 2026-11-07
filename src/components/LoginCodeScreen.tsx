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
  /** Verifica el código; si es incorrecto, lanza un error con mensaje para la persona. */
  onVerify: (code: string) => Promise<void>;
  /** Pide un código nuevo. */
  onResend: () => Promise<void>;
}

const CODE_LENGTH = 6;

export function LoginCodeScreen({ phone, onChangeNumber, onVerify, onResend }: Props) {
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  // Al completar los seis números se verifica solo; si falla, se limpia para reintentar.
  useEffect(() => {
    if (code.length !== CODE_LENGTH || busy) return;
    setBusy(true);
    setError(null);
    setInfo(null);
    onVerify(code)
      .catch((e: any) => {
        setError(e?.message ?? 'Algo salió mal. Inténtalo de nuevo.');
        setCode('');
      })
      .finally(() => setBusy(false));
  }, [code]);

  async function handleResend() {
    setError(null);
    setInfo(null);
    try {
      await onResend();
      setCode('');
      setInfo('Listo, te mandé un código nuevo.');
    } catch (e: any) {
      setError(e?.message ?? 'Algo salió mal. Inténtalo de nuevo.');
    }
  }

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
        <Text style={styles.screenTitle}>Escribe el código</Text>
        <Text style={styles.screenHint}>
          Te mandamos un mensaje a <Text style={styles.bold}>+56 {phone}</Text>. Búscalo y escribe los seis números.
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
            editable={!busy}
            autoFocus
            accessibilityLabel="Código de seis dígitos"
          />
        </View>

        {busy && <Text style={styles.infoText}>Revisando tu código…</Text>}
        {info && <Text style={styles.infoText}>{info}</Text>}
        {error && (
          <Text style={styles.errorText} accessibilityLiveRegion="polite">
            {error}
          </Text>
        )}

        <View style={styles.resendRow}>
          <Text style={styles.resendText}>¿No te llegó?</Text>
          <TouchableOpacity onPress={handleResend} accessibilityLabel="Mandar de nuevo">
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
          <Text style={styles.helperSub}>Si lo recibes, dime "léelo".</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  errorText: {
    fontFamily: fonts.bodyBold,
    fontSize: fontSize.label,
    color: colors.error,
    marginBottom: 12,
  },
  infoText: {
    fontFamily: fonts.body,
    fontSize: fontSize.label,
    color: colors.textSecondary,
    marginBottom: 12,
  },
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
