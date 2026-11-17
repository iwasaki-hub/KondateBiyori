import { StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from './tokens';

export const screenStyles = StyleSheet.create({
  header: { gap: spacing.sm },
  title: { ...typography.title, color: colors.text },
  heading: { ...typography.heading, color: colors.text },
  body: { ...typography.body, color: colors.muted },
  label: { ...typography.label, color: colors.text },
  eyebrow: { ...typography.label, color: colors.primary },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  iconBadge: { backgroundColor: colors.soft, borderRadius: radius.md, padding: spacing.lg, alignSelf: 'flex-start' },
  notice: { backgroundColor: colors.soft, borderRadius: radius.sm, padding: spacing.lg, gap: spacing.sm },
  small: { ...typography.small, color: colors.muted },
});
