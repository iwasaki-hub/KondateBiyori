export const colors = {
  primary: '#C5452D',
  primaryPressed: '#A63622',
  orange: '#F28C45',
  honey: '#F4C566',
  background: '#FFF8F0',
  surface: '#FFFFFF',
  text: '#4B3027',
  muted: '#775D50',
  border: '#ECD8C7',
  soft: '#FFF0E3',
  selected: '#FFF5EE',
  disabled: '#EADFD5',
  disabledText: '#725F52',
  onPrimary: '#FFFFFF',
} as const;

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48 } as const;
export const radius = { sm: 12, md: 20, lg: 28, pill: 999 } as const;
export const typography = {
  title: { fontSize: 32, lineHeight: 44, fontWeight: '700' },
  heading: { fontSize: 22, lineHeight: 32, fontWeight: '700' },
  body: { fontSize: 16, lineHeight: 28 },
  label: { fontSize: 14, lineHeight: 24, fontWeight: '600' },
  small: { fontSize: 13, lineHeight: 22 },
} as const;
export const layout = { maxWidth: 600, touchTarget: 48, tabHeight: 72 } as const;
export const iconSizes = { small: 20, medium: 24, large: 32, hero: 48 } as const;
export const iconStroke = { normal: 1.8, selected: 2.5 } as const;
