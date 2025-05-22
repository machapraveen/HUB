
import React from 'react';

type ThemeType = 'light' | 'dark';
type UserSpaceType = 'macha' | 'veerendra' | 'shared';

type ThemeContextType = {
  theme: ThemeType;
  userSpace: UserSpaceType;
  toggleTheme: () => void;
  setUserSpace: (space: UserSpaceType) => void;
  getSpaceColor: () => string;
};

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<ThemeType>(() => {
    // Check for saved theme - Only run on client side
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('hackbuddy-theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
      // Check system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark'; // Default fallback
  });

  const [userSpace, setUserSpace] = React.useState<UserSpaceType>(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.includes('macha')) return 'macha';
      if (path.includes('veerendra')) return 'veerendra';
    }
    return 'shared';
  });

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
      localStorage.setItem('hackbuddy-theme', theme);
    }
  }, [theme]);
  
  // Update user space when path changes
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleRouteChange = () => {
        const path = window.location.pathname;
        if (path.includes('macha')) setUserSpace('macha');
        else if (path.includes('veerendra')) setUserSpace('veerendra');
        else setUserSpace('shared');
      };
      
      window.addEventListener('popstate', handleRouteChange);
      return () => window.removeEventListener('popstate', handleRouteChange);
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const getSpaceColor = () => {
    if (userSpace === 'macha') {
      return theme === 'dark' ? 'bg-purple-700' : 'bg-purple-500';
    } else if (userSpace === 'veerendra') {
      return theme === 'dark' ? 'bg-blue-700' : 'bg-blue-500';
    }
    return theme === 'dark' ? 'bg-indigo-700' : 'bg-indigo-500';
  };

  return (
    <ThemeContext.Provider value={{ theme, userSpace, toggleTheme, setUserSpace, getSpaceColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
