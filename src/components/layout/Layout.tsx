
import React, { ReactNode, useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, X, Sun, Moon, User, Users, Calendar, FileText, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { useIsMobile } from '@/hooks/use-mobile';

type NavItem = {
  name: string;
  path: string;
  icon: React.ReactNode;
  highlight?: boolean;
};

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme, userSpace, getSpaceColor } = useTheme();
  const location = useLocation();
  const isMobile = useIsMobile();

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('sidebar');
      if (isMobile && sidebar && !sidebar.contains(event.target as Node) && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobile, sidebarOpen]);

  const navItems: NavItem[] = [
    { 
      name: 'Dashboard', 
      path: '/', 
      icon: <span className="material-icons">dashboard</span> 
    },
    { 
      name: 'Macha Space', 
      path: '/macha', 
      icon: <User className="h-4 w-4" />,
      highlight: userSpace === 'macha'
    },
    { 
      name: 'Veerendra Space', 
      path: '/veerendra', 
      icon: <User className="h-4 w-4" />,
      highlight: userSpace === 'veerendra' 
    },
    { 
      name: 'Hackathons', 
      path: '/hackathons', 
      icon: <Calendar className="h-4 w-4" /> 
    },
  ];

  // Get current path for highlighting
  const currentPath = location.pathname;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Mobile header */}
      <header className="sticky top-0 z-40 flex justify-between items-center px-4 h-14 border-b bg-background sm:px-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
        <Link to="/" className="flex items-center">
          <span className="font-bold text-lg">HackBuddy</span>
          <Badge variant="outline" className="ml-2">PWA</Badge>
        </Link>
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </Button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          id="sidebar"
          className={cn(
            "fixed inset-y-0 left-0 z-30 w-64 flex-shrink-0 flex-col bg-sidebar border-r pt-16 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:z-auto",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navItems.map((item) => {
                const isActive = item.path === '/' 
                  ? currentPath === '/' 
                  : currentPath.startsWith(item.path);
                
                const highlightColor = item.highlight ? getSpaceColor() : '';
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? `${highlightColor || 'bg-accent'} ${highlightColor ? 'text-white' : 'text-accent-foreground'}`
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                    onClick={() => isMobile && setSidebarOpen(false)}
                  >
                    {item.icon}
                    <span className="ml-3">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="px-4 py-2 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">App Version</span>
                </div>
                <Badge variant="outline">1.0.0</Badge>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="container px-4 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
