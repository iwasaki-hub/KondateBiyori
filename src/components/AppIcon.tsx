import ArrowLeft from 'lucide-react-native/icons/arrow-left';
import ArrowRight from 'lucide-react-native/icons/arrow-right';
import CalendarDays from 'lucide-react-native/icons/calendar-days';
import Check from 'lucide-react-native/icons/check';
import ChefHat from 'lucide-react-native/icons/chef-hat';
import Clock from 'lucide-react-native/icons/clock';
import Info from 'lucide-react-native/icons/info';
import Settings from 'lucide-react-native/icons/settings';
import ShoppingBasket from 'lucide-react-native/icons/shopping-basket';
import Utensils from 'lucide-react-native/icons/utensils';
import { colors, iconSizes, iconStroke } from '../theme/tokens';

const icons = {
  week: CalendarDays,
  shopping: ShoppingBasket,
  settings: Settings,
  meal: Utensils,
  cooking: ChefHat,
  time: Clock,
  back: ArrowLeft,
  forward: ArrowRight,
  info: Info,
  success: Check,
} as const;

const tones = {
  primary: colors.primary, orange: colors.orange, honey: colors.honey,
  brown: colors.text, muted: colors.muted, inverse: colors.onPrimary,
} as const;

export type IconName = keyof typeof icons;
export type IconTone = keyof typeof tones;
type Props = {
  name: IconName;
  size?: (typeof iconSizes)[keyof typeof iconSizes];
  tone?: IconTone;
  state?: 'default' | 'selected' | 'disabled';
  label?: string;
};

export function AppIcon({ name, size = iconSizes.medium, tone = 'primary', state = 'default', label }: Props) {
  const Icon = icons[name];
  return (
    <Icon
      size={size}
      color={state === 'disabled' ? colors.disabledText : tones[tone]}
      strokeWidth={state === 'selected' ? iconStroke.selected : iconStroke.normal}
      accessible={Boolean(label)}
      accessibilityRole={label ? 'image' : undefined}
      accessibilityLabel={label}
      accessibilityElementsHidden={!label}
      importantForAccessibility={label ? 'yes' : 'no-hide-descendants'}
    />
  );
}
