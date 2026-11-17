import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { AppButton } from '../../src/components/AppButton';
import { AppCard } from '../../src/components/AppCard';
import { AppIcon } from '../../src/components/AppIcon';
import { AppScreen } from '../../src/components/AppScreen';
import { screenStyles as s } from '../../src/theme/screenStyles';

export default function ShoppingScreen() {
  const router = useRouter();
  return (
    <AppScreen>
      <View style={s.header}>
        <View style={s.iconBadge}><AppIcon name="shopping" size={32} tone="orange" /></View>
        <Text accessibilityRole="header" style={s.title}>買い物リスト</Text>
        <Text style={s.body}>買うものがまとまると、買い物も気持ちも軽やかに。</Text>
      </View>
      <AppCard>
        <Text accessibilityRole="header" style={s.heading}>まだリストがありません</Text>
        <Text style={s.body}>献立に必要な食材を、見やすいリストにまとめる予定です。</Text>
        <View style={s.notice}>
          <Text style={s.label}>買い物リスト機能は準備中</Text>
          <Text style={s.small}>購入済みチェックや食材の追加は、今後対応します。</Text>
        </View>
      </AppCard>
      <AppButton label="今週の献立へ" icon="back" onPress={() => router.navigate('/')} />
    </AppScreen>
  );
}
