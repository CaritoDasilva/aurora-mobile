import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Message } from '../types';

interface Props {
  message: Message;
}

export function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user';
  return (
    <View style={[styles.row, isUser ? styles.rowUser : styles.rowAurora]}>
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAurora]}>
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
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  bubbleUser: {
    backgroundColor: '#E8845C',
    borderBottomRightRadius: 4,
  },
  bubbleAurora: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
  },
  text: {
    fontSize: 20,
    lineHeight: 28,
  },
  textUser: {
    color: '#FFFFFF',
  },
  textAurora: {
    color: '#2C1810',
  },
});
