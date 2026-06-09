import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

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
        <Text style={styles.buttonText}>✓  Sí</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.cancelButton]}
        onPress={onCancel}
        activeOpacity={0.8}
        accessibilityLabel="Cancelar acción"
      >
        <Text style={styles.buttonText}>✗  No</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  prompt: {
    fontSize: 22,
    color: '#2C1810',
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 20,
    fontWeight: '500',
  },
  button: {
    width: '100%',
    height: 64,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  confirmButton: {
    backgroundColor: '#4A8C6F',
  },
  cancelButton: {
    backgroundColor: '#C0392B',
    marginBottom: 0,
  },
  buttonText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
});
