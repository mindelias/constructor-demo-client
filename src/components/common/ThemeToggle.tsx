import { Moon, Sun } from 'lucide-react';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/store/uiStore';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export function ThemeToggle() {
  const { theme, setTheme } = useUIStore();
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    const actualTheme = theme === 'system' ? (prefersDark ? 'dark' : 'light') : theme;

    root.classList.remove('light', 'dark');
    root.classList.add(actualTheme);
  }, [theme, prefersDark]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  const isDark = theme === 'dark' || (theme === 'system' && prefersDark);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-9 w-9"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  );
}
