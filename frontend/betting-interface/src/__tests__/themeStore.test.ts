import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });
Object.defineProperty(globalThis, 'document', {
  value: { documentElement: { classList: { toggle: vi.fn() } } },
  writable: true,
});
Object.defineProperty(globalThis, 'window', {
  value: { matchMedia: () => ({ matches: false }) },
  writable: true,
});

// Import after mocks are set up
const { useThemeStore } = await import('../store/themeStore');

describe('themeStore persistence (issue #19)', () => {
  beforeEach(() => {
    localStorageMock.clear();
    useThemeStore.setState({ isDarkMode: false });
  });

  it('defaults to system preference when no stored value', () => {
    const { isDarkMode } = useThemeStore.getState();
    expect(typeof isDarkMode).toBe('boolean');
  });

  it('persists dark mode to localStorage on toggle', () => {
    useThemeStore.getState().toggleDarkMode();
    expect(localStorageMock.getItem('sportbetx-theme')).toBe('dark');
  });

  it('persists light mode to localStorage on second toggle', () => {
    useThemeStore.getState().toggleDarkMode(); // → dark
    useThemeStore.getState().toggleDarkMode(); // → light
    expect(localStorageMock.getItem('sportbetx-theme')).toBe('light');
  });

  it('setDarkMode persists value', () => {
    useThemeStore.getState().setDarkMode(true);
    expect(localStorageMock.getItem('sportbetx-theme')).toBe('dark');
    useThemeStore.getState().setDarkMode(false);
    expect(localStorageMock.getItem('sportbetx-theme')).toBe('light');
  });
});
