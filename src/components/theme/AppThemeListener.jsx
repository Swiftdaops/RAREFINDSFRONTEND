import { useEffect } from 'react';
import { useAppThemeStore } from '../../store/appThemeStore';

export function AppThemeListener() {
  const fetchTheme = useAppThemeStore((s) => s.fetchTheme);

  useEffect(() => {
    // Fetch on mount
    fetchTheme();

    // Optional: Re-fetch on window focus to keep tabs in sync
    const onFocus = () => fetchTheme();
    window.addEventListener('focus', onFocus);
    
    return () => window.removeEventListener('focus', onFocus);
  }, [fetchTheme]);

  return null;
}
