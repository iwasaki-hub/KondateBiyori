import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, layout, radius, spacing, typography } from '../theme/tokens';
import { AppIcon, type IconName } from './AppIcon';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  icon?: IconName;
};

export function AppButton({ label, onPress, variant = 'primary', disabled = false, icon }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === 'primary' ? styles.primary : styles.secondary,
        pressed && (variant === 'primary' ? styles.primaryPressed : styles.secondaryPressed),
        disabled && styles.disabled,
      ]}
    >
      {icon ? <AppIcon name={icon} tone={variant === 'primary' ? 'inverse' : 'primary'} state={disabled ? 'disabled' : 'default'} /> : null}
      <Text style={[styles.label, variant === 'primary' && styles.primaryLabel, disabled && styles.disabledLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: layout.touchTarget, paddingVertical: spacing.md, paddingHorizontal: spacing.lg, borderRadius: radius.sm, borderWidth: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: spacing.sm },
  primary: { backgroundColor: colors.primary, borderColor: colors.primary },
  secondary: { backgroundColor: colors.surface, borderColor: colors.border },
  primaryPressed: { backgroundColor: colors.primaryPressed, borderColor: colors.primaryPressed },
  secondaryPressed: { backgroundColor: colors.soft },
  disabled: { backgroundColor: colors.disabled, borderColor: colors.disabled },
  label: { ...typography.label, color: colors.primary, flexShrink: 1, textAlign: 'center' },
  primaryLabel: { color: colors.onPrimary },
  disabledLabel: { color: colors.disabledText },
});
