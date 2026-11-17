import { Tabs } from 'expo-router';
import { Text, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppIcon, type IconName, type IconTone } from '../../src/components/AppIcon';
import { colors, layout, spacing, typography } from '../../src/theme/tokens';

const tabs: { route: 'index' | 'shopping' | 'settings'; title: string; icon: IconName; tone: IconTone }[] = [
  { route: 'index', title: '今週', icon: 'week', tone: 'primary' },
  { route: 'shopping', title: '買い物', icon: 'shopping', tone: 'orange' },
  { route: 'settings', title: '設定', icon: 'settings', tone: 'brown' },
];

export default function TabLayout() {
  const { fontScale } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  return (
    <Tabs screenOptions={{
      headerShown: false,
      sceneStyle: { backgroundColor: colors.background },
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.muted,
      tabBarActiveBackgroundColor: colors.selected,
      tabBarLabelPosition: 'below-icon',
      tabBarLabelStyle: { fontSize: typography.small.fontSize, fontWeight: '600' },
      tabBarItemStyle: { minHeight: layout.touchTarget, paddingVertical: spacing.xs },
      tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border, height: layout.tabHeight + insets.bottom + Math.max(0, fontScale - 1) * typography.small.lineHeight, paddingBottom: insets.bottom + spacing.xs, paddingTop: spacing.xs },
    }}>
      {tabs.map(tab => (
        <Tabs.Screen key={tab.route} name={tab.route} options={{
          title: tab.title,
          tabBarAccessibilityLabel: tab.title,
          tabBarLabel: ({ focused, color }) => <Text style={{ ...typography.small, color, fontWeight: focused ? '700' : '500' }}>{focused ? '• ' : ''}{tab.title}</Text>,
          tabBarIcon: ({ focused }) => <AppIcon name={tab.icon} tone={focused ? tab.tone : 'muted'} state={focused ? 'selected' : 'default'} />,
        }} />
      ))}
    </Tabs>
  );
}
