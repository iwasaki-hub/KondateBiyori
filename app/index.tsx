import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>家族の食卓に、ほっとする時間を。</Text>
        <Text accessibilityRole="header" style={styles.title}>こんだて日和</Text>
        <Text style={styles.intro}>毎日の「何を作ろう」を、少し軽く。</Text>
        <View style={styles.card}>
          <Text style={styles.label}>今週の献立</Text>
          <Text accessibilityRole="header" style={styles.cardTitle}>まだ献立がありません</Text>
          <Text style={styles.description}>
            家族に合わせた一週間の夕食と、買い物の準備をひとつに。
          </Text>
          <View style={styles.notice}>
            <Text style={styles.noticeText}>献立づくりの機能は、ただいま準備中です。</Text>
          </View>
        </View>
        <Text style={styles.footer}>食卓を囲む日々が、もっと心地よく。</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FAF7EF' },
  content: { flexGrow: 1, width: '100%', maxWidth: 600, alignSelf: 'center', paddingHorizontal: 24, paddingVertical: 48 },
  eyebrow: { color: '#526454', fontSize: 14, lineHeight: 24, marginBottom: 12 },
  title: { color: '#264D3C', fontSize: 34, fontWeight: '700', marginBottom: 16 },
  intro: { color: '#526454', fontSize: 16, lineHeight: 28, marginBottom: 36 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 24, borderWidth: 1, borderColor: '#E1E7DB', padding: 24 },
  label: { color: '#526454', fontSize: 14, fontWeight: '600', marginBottom: 20 },
  cardTitle: { color: '#264D3C', fontSize: 21, fontWeight: '600', lineHeight: 32, marginBottom: 12 },
  description: { color: '#526454', fontSize: 16, lineHeight: 28 },
  notice: { backgroundColor: '#EEF3E9', borderRadius: 12, padding: 16, marginTop: 24 },
  noticeText: { color: '#264D3C', fontSize: 14, lineHeight: 24 },
  footer: { color: '#526454', fontSize: 13, lineHeight: 24, textAlign: 'center', marginTop: 32 },
});
