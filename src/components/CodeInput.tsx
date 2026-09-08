import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts, radius } from '../theme';

interface Props {
  length?: number;
  value: string;
}

export function CodeInput({ length = 6, value }: Props) {
  const chars = value.padEnd(length, ' ').split('').slice(0, length);
  const activeIndex = value.length < length ? value.length : -1;

  return (
    <View style={styles.grid}>
      {chars.map((c, i) => {
        const filled = c.trim().length > 0;
        const active = i === activeIndex;
        return (
          <View
            key={i}
            style={[
              styles.cell,
              filled && styles.cellFilled,
              active && styles.cellActive,
            ]}
          >
            <Text style={styles.cellText}>{filled ? c : ''}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  cell: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: colors.bgElevated,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellFilled: {
    borderColor: colors.accentSun,
    backgroundColor: colors.bgSubtle,
  },
  cellActive: {
    borderColor: colors.accentSun,
    shadowColor: colors.accentSun,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 3,
  },
  cellText: {
    fontFamily: fonts.bodyBold,
    fontSize: 26,
    color: colors.textPrimary,
  },
});
