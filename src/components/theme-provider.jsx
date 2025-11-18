// ThemeProvider removed — provide a minimal no-op API so remaining imports don't break
import React from "react";

export function ThemeProvider({ children }) {
  return <>{children}</>;
}

export const useTheme = () => ({ theme: "light", setTheme: () => {} });