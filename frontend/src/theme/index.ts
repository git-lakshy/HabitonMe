export const Colors = {
  primary: '#32CD32', // Lime Green
  secondary: '#000000', // Black
  background: '#000000',
  surface: '#1A1A1A', // Dark gray surface
  text: '#FFFFFF',
  textSecondary: '#AAAAAA',
  accent: '#32CD32',
  error: '#FF3B30',
  success: '#32CD32',
  gray: '#2C2C2E',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const Typography = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    color: Colors.text,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: Colors.text,
  },
  body: {
    fontSize: 16,
    color: Colors.text,
  },
  caption: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
};
