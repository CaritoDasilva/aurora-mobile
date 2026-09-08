import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Message } from '../types';
import { colors, fonts, fontSize, radius } from '../theme';

interface Props {
  message: Message;
}

export function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user';
  return (
    <View style={[styles.row, isUser ? styles.rowUser : styles.rowAurora]}>
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAurora]}>
        {!isUser && <Text style={styles.eyebrow}>AURORA</Text>}
        <Text style={[styles.text, isUser ? styles.textUser : styles.textAurora]}>
          {message.text}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    marginVertical: 6,
    paddingHorizontal: 12,
  },
  rowUser: {
    alignItems: 'flex-end',
  },
  rowAurora: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '82%',
    borderRadius: radius.lg,
    borderWidth: 2,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  bubbleUser: {
    backgroundColor: colors.accentSun,
    borderColor: colors.accentSun,
    borderBottomRightRadius: radius.sm,
  },
  bubbleAurora: {
    backgroundColor: colors.bgElevated,
    borderColor: colors.borderSubtle,
    borderBottomLeftRadius: radius.sm,
  },
  eyebrow: {
    fontFamily: fonts.bodyBold,
    fontSize: fontSize.eyebrow,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.accentSun,
    marginBottom: 6,
  },
  text: {
    fontFamily: fonts.body,
    fontSize: fontSize.body,
    lineHeight: 32,
  },
  textUser: {
    color: colors.textOnAccent,
  },
  textAurora: {
    color: colors.textPrimary,
  },
});
