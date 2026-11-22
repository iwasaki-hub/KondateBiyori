import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { Recipe } from '../data/recipe-schema';
import { formatIngredientQuantity, MAX_SERVINGS, MIN_SERVINGS, scaledIngredients } from '../recipes/servings';
import { colors, layout, radius, spacing, typography } from '../theme/tokens';
import { AppButton } from './AppButton';
import { AppCard } from './AppCard';

type Props = {
  recipe: Recipe;
  initialServings: number;
  onClose: () => void;
};

export function RecipeDetail({ recipe, initialServings, onClose }: Props) {
  const [servings, setServings] = useState(() =>
    Math.max(MIN_SERVINGS, Math.min(MAX_SERVINGS, Math.round(initialServings))));
  const ingredients = scaledIngredients(recipe, servings);

  return (
    <AppCard>
      <AppButton label="週間献立へ戻る" variant="secondary" onPress={onClose} />
      <Text accessibilityRole="header" style={styles.title}>{recipe.name}</Text>
      <Text style={styles.meta}>調理時間の目安：{recipe.cookingMinutes}分</Text>
      <Text style={styles.meta}>元のレシピ：{recipe.servings}人分</Text>

      <View style={styles.section}>
        <Text accessibilityRole="header" style={styles.heading}>材料の人数を調整</Text>
        <View style={styles.stepper}>
          <View style={styles.adjust}><AppButton label="1人減らす" variant="secondary"
            disabled={servings <= MIN_SERVINGS}
            onPress={() => setServings(previous => Math.max(MIN_SERVINGS, previous - 1))} /></View>
          <Text accessibilityLabel={`現在の分量は${servings}人分`} style={styles.servings}>{servings}人分</Text>
          <View style={styles.adjust}><AppButton label="1人増やす" variant="secondary"
            disabled={servings >= MAX_SERVINGS}
            onPress={() => setServings(previous => Math.min(MAX_SERVINGS, previous + 1))} /></View>
        </View>
        <Text style={styles.hint}>1〜10人分の材料量を計算します。変更はこの画面の表示だけに反映され、保存済みの献立は変わりません。</Text>
      </View>

      <View style={styles.section}>
        <Text accessibilityRole="header" style={styles.heading}>材料（{servings}人分）</Text>
        {ingredients.map((ingredient, index) => (
          <View key={`${ingredient.name}-${index}`} style={styles.ingredient}>
            <Text style={styles.ingredientName}>{ingredient.name}</Text>
            <Text style={styles.quantity}>{formatIngredientQuantity(ingredient.quantity, ingredient.unit)}</Text>
          </View>
        ))}
        <Text style={styles.hint}>材料の量は目安です。個・本・枚・束も小数で表示される場合があるため、調理時に調整してください。</Text>
      </View>

      <View style={styles.section}>
        <Text accessibilityRole="header" style={styles.heading}>作り方</Text>
        {recipe.steps.map((step, index) => (
          <View key={index} style={styles.instruction}>
            <Text style={styles.stepNumber}>{index + 1}</Text>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.hint}>材料・作り方はサンプルです。アレルギーの安全は保証できません。食品表示を確認し、十分に加熱してください。</Text>
      <AppButton label="閉じて週間献立に戻る" onPress={onClose} />
    </AppCard>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.heading, color: colors.text },
  meta: { ...typography.body, color: colors.muted },
  section: { gap: spacing.md },
  heading: { ...typography.heading, color: colors.text },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  adjust: { flex: 1, minWidth: 0 },
  servings: { ...typography.label, color: colors.text, minWidth: 57, textAlign: 'center' },
  hint: { ...typography.small, color: colors.muted },
  ingredient: { minHeight: layout.touchTarget, borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: spacing.sm, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  ingredientName: { ...typography.body, color: colors.text, flex: 1 },
  quantity: { ...typography.body, fontWeight: '600', color: colors.text },
  instruction: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  stepNumber: { backgroundColor: colors.soft, color: colors.primary, borderRadius: radius.pill, textAlign: 'center', width: 32, lineHeight: 32, fontWeight: '700' },
  stepText: { ...typography.body, color: colors.text, flex: 1 },
});
