import { create } from 'zustand';
import { api } from '../api/httpClient';

export const useAppThemeStore = create((set) => ({
  themeMode: 'dark', // Default
  loadingTheme: false,
  lastFetchedAt: null,

  fetchTheme: async () => {
    set({ loadingTheme: true });
    try {
      const { data } = await api.get('/api/app-settings/theme');
      set({ 
        themeMode: data.themeMode,
        lastFetchedAt: new Date()
      });
      
      // Sync with local storage
      localStorage.setItem('vite-ui-theme', data.themeMode);
      
      // Apply theme immediately
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(data.themeMode);
    } catch (error) {
      console.error('Failed to fetch theme:', error);
    } finally {
      set({ loadingTheme: false });
    }
  },
}));
