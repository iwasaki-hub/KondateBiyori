import { Text, View } from 'react-native';
import { AppCard } from '../../src/components/AppCard';
import { AppIcon } from '../../src/components/AppIcon';
import { AppScreen } from '../../src/components/AppScreen';
import { screenStyles as s } from '../../src/theme/screenStyles';

export default function SettingsScreen() {
  return (
    <AppScreen>
      <View style={s.header}>
        <View style={s.iconBadge}><AppIcon name="settings" size={32} tone="brown" /></View>
        <Text accessibilityRole="header" style={s.title}>設定</Text>
        <Text style={s.body}>家族の暮らしに合う、献立づくりへ。</Text>
      </View>
      <AppCard>
        <Text accessibilityRole="header" style={s.heading}>家族設定</Text>
        <Text style={s.body}>家族の人数や好み、調理時間を設定できるようになります。</Text>
        <Text style={s.eyebrow}>準備中</Text>
      </AppCard>
      <AppCard>
        <Text accessibilityRole="header" style={s.heading}>利用プラン</Text>
        <Text style={s.body}>プランの提供は準備中です。現在、購入や課金の機能はありません。</Text>
        <Text style={s.eyebrow}>準備中</Text>
      </AppCard>
      <AppCard>
        <View style={s.row}><AppIcon name="info" tone="brown" /><Text accessibilityRole="header" style={s.heading}>アプリ情報</Text></View>
        <Text style={s.label}>こんだて日和 · 0.1.0</Text>
        <Text style={s.small}>家族の食卓を支える、週間献立アプリです。</Text>
      </AppCard>
    </AppScreen>
  );
}
