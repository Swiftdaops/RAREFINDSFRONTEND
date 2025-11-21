import { useEffect } from 'react';
import { useAppThemeStore } from '../../store/appThemeStore';

export function AppThemeListener() {
  const fetchTheme = useAppThemeStore((s) => s.fetchTheme);
  const themeEndpointMissing = useAppThemeStore((s) => s.themeEndpointMissing);

  useEffect(() => {
    // Fetch on mount unless endpoint known missing
    if (!themeEndpointMissing) fetchTheme();

    // Re-fetch on focus only if endpoint exists
    const onFocus = () => {
      if (!themeEndpointMissing) fetchTheme();
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [fetchTheme, themeEndpointMissing]);

  return null;
}
