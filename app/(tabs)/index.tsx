import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { AppButton } from '../../src/components/AppButton';
import { AppCard } from '../../src/components/AppCard';
import { AppIcon } from '../../src/components/AppIcon';
import { AppScreen } from '../../src/components/AppScreen';
import { screenStyles as s } from '../../src/theme/screenStyles';

export default function WeekScreen() {
  const router = useRouter();
  return (
    <AppScreen>
      <View style={s.header}>
        <Text style={s.eyebrow}>家族の食卓に、ほっとする時間を。</Text>
        <Text accessibilityRole="header" style={s.title}>こんだて日和</Text>
        <Text style={s.body}>毎日の「何を作ろう」を、少し軽く。{ '\n' }おいしい一週間を、ここから。</Text>
      </View>
      <AppCard>
        <View style={s.row}><AppIcon name="week" /><Text style={s.label}>今週の献立</Text></View>
        <View style={s.iconBadge}><AppIcon name="cooking" size={48} tone="orange" /></View>
        <Text accessibilityRole="header" style={s.heading}>まだ献立がありません</Text>
        <Text style={s.body}>家族に合わせた一週間の夕食と、買い物の準備をひとつに。</Text>
        <AppButton label="献立づくりは準備中" icon="meal" disabled />
        <Text style={s.small}>献立を提案する機能は、これからお届けします。</Text>
      </AppCard>
      <AppButton label="買い物リストを見る" icon="shopping" variant="secondary" onPress={() => router.push('/shopping')} />
      <View style={s.notice}>
        <AppIcon name="info" />
        <Text style={s.small}>食卓を囲む日々が、もっと心地よく。家族の好みを大切にした献立づくりを目指しています。</Text>
      </View>
    </AppScreen>
  );
}
