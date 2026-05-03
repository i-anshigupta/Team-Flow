import { create } from 'zustand';

export const useTheme = create((set) => ({
  theme: localStorage.getItem('theme') || 'light',
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    return { theme: newTheme };
  }),
  initTheme: () => set((state) => {
    document.documentElement.setAttribute('data-theme', state.theme);
    return state;
  })
}));
