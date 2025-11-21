import { create } from 'zustand';
import { api } from '../api/httpClient';

export const useAppThemeStore = create((set) => ({
  themeMode: 'dark', // Default
  loadingTheme: false,
  lastFetchedAt: null,
  themeEndpointMissing: false,
  attemptedOnce: false,

  fetchTheme: async () => {
    const state = useAppThemeStore.getState();
    if (state.themeEndpointMissing) return; // endpoint confirmed missing
    // Throttle: only one attempt every 60s in dev, and avoid duplicate StrictMode double-call
    const now = Date.now();
    if (state.attemptedOnce && state.lastFetchedAt && (now - state.lastFetchedAt.getTime()) < 60000) return;
    set({ loadingTheme: true, attemptedOnce: true });
    try {
      const { data } = await api.get('/api/app-settings/theme');
      set({
        themeMode: data.themeMode,
        lastFetchedAt: new Date(),
      });

      // Sync with local storage
      localStorage.setItem('vite-ui-theme', data.themeMode);

      // Apply theme immediately
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(data.themeMode);
    } catch (error) {
      // If backend doesn't have a theme endpoint (404) or it's unreachable,
      // fall back to the user's stored theme or the store default and avoid
      // noisy repeated errors in the console.
      const status = error?.response?.status;
      if (status === 404) {
        const stored = localStorage.getItem('vite-ui-theme');
        const mode = stored || 'light';
        set({ themeMode: mode, themeEndpointMissing: true });
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(mode);
      } else {
        console.error('Failed to fetch theme:', error);
      }
    } finally {
      set({ loadingTheme: false });
    }
  },
}));
