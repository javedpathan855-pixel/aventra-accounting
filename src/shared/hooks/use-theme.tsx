"use client";

import { useTheme as useNextTheme } from "next-themes";

const useTheme = () => {
  const { theme, setTheme, resolvedTheme, themes, systemTheme } =
    useNextTheme();

  return {
    theme,
    setTheme,
    resolvedTheme,
    themes,
    systemTheme,
  };
};

export default useTheme;
