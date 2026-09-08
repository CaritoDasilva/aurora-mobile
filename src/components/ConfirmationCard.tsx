import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, fonts, fontSize, radius, touch } from '../theme';

interface Props {
  prompt: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationCard({ prompt, onConfirm, onCancel }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.prompt}>{prompt}</Text>
      <TouchableOpacity
        style={[styles.button, styles.confirmButton]}
        onPress={onConfirm}
        activeOpacity={0.8}
        accessibilityLabel="Confirmar acción"
      >
        <Text style={styles.buttonText}>Sí</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.cancelButton]}
        onPress={onCancel}
        activeOpacity={0.8}
        accessibilityLabel="Cancelar acción"
      >
        <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgElevated,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.borderSubtle,
    padding: 24,
    marginHorizontal: 12,
    marginBottom: 8,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  prompt: {
    fontFamily: fonts.body,
    fontSize: fontSize.body,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 20,
  },
  button: {
    width: '100%',
    height: touch.comfortable,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  confirmButton: {
    backgroundColor: colors.success,
  },
  cancelButton: {
    backgroundColor: colors.bgElevated,
    borderWidth: 2,
    borderColor: colors.error,
    marginBottom: 0,
  },
  buttonText: {
    fontFamily: fonts.bodyBold,
    fontSize: fontSize.body,
    color: colors.textOnAccent,
    letterSpacing: 0.5,
  },
  cancelButtonText: {
    color: colors.error,
  },
});
