import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Polyline, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { colors, spacing, fontSize } from '../constants/theme';

interface MiniChartProps {
  data: number[];
  labels?: string[];
  title: string;
  color?: string;
  height?: number;
}

export const MiniChart: React.FC<MiniChartProps> = ({
  data,
  labels,
  title,
  color = colors.primary,
  height = 120,
}) => {
  if (!data.length) return null;

  const width = Dimensions.get('window').width - 72; // card padding + margins
  const padding = 8;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((val, i) => {
      const x = padding + (i / (data.length - 1)) * chartWidth;
      const y = padding + chartHeight - ((val - min) / range) * chartHeight;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Svg width={width} height={height}>
        <Polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
      {labels && labels.length > 0 && (
        <View style={styles.labels}>
          <Text style={styles.label}>{labels[0]}</Text>
          <Text style={styles.label}>{labels[labels.length - 1]}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.sm,
  },
  title: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xs,
  },
  label: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
});
