// Tokens del Aurora Design System (tema AM) — ver design_system/colors_and_type.css

export const colors = {
  bgCanvas: '#FFF8F0',
  bgElevated: '#FFFFFF',
  bgSubtle: '#FFEDE0',
  textPrimary: '#1B1B3A',
  textSecondary: '#4D4D6E',
  textOnAccent: '#FFFFFF',
  accentSun: '#C81E78',
  accentSunHover: '#A6175C',
  success: '#1F6034',
  warning: '#7A4500',
  error: '#8B1414',
  borderSubtle: '#E8D5C4',
  borderStrong: '#B89C84',
};

export const fonts = {
  body: 'AtkinsonHyperlegible_400Regular',
  bodyBold: 'AtkinsonHyperlegible_700Bold',
  display: 'Nunito_700Bold',
  displayBlack: 'Nunito_900Black',
};

export const fontSize = {
  h1: 40,
  h2: 32,
  bodyLg: 24,
  body: 22,
  label: 20,
  caption: 18,
  eyebrow: 13,
};

export const touch = {
  min: 56,
  comfortable: 64,
  voice: 88,
  voiceLg: 100,
  spacing: 16,
};

export const radius = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  pill: 999,
};

// --gradient-aurora (tema AM), noche -> dia
export const gradientAurora = {
  colors: ['#1B1B3A', '#3D1E5C', '#7A2D8F', '#C81E78', '#FF5C8A', '#FF8C42', '#FFCB47', '#FFF8F0'] as const,
  locations: [0, 0.18, 0.35, 0.52, 0.68, 0.82, 0.92, 1] as const,
};
