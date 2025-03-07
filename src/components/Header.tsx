
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SheetTrigger, SheetContent, Sheet } from '@/components/ui/sheet';
import { CalendarClock, Home, Menu, X, Dumbbell, BarChart, TrendingUp, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  const { user, signOut } = useAuth();

  const handleClose = () => setIsOpen(false);

  // Helper function to determine if a path is active
  const isActivePath = (path: string): boolean => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    {
      name: 'Home',
      path: '/',
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      requiresAuth: true,
    },
    {
      name: 'Calendar',
      path: '/calendar',
      icon: <CalendarClock className="h-5 w-5" />,
      requiresAuth: true,
    },
    {
      name: 'Workout Library',
      path: '/workout-library',
      icon: <Dumbbell className="h-5 w-5" />,
      requiresAuth: true,
    },
    {
      name: 'Analytics',
      path: '/analytics',
      icon: <BarChart className="h-5 w-5" />,
      requiresAuth: true,
    },
    {
      name: 'Progression',
      path: '/progression',
      icon: <TrendingUp className="h-5 w-5" />,
      requiresAuth: true,
    },
  ];

  const filteredNavLinks = navLinks.filter(
    (link) => !link.requiresAuth || user
  );

  const renderNavLinks = () => {
    return filteredNavLinks.map((link) => (
      <li key={link.name}>
        <Link
          to={link.path}
          className={`flex items-center gap-2 text-base transition-colors ${
            isActivePath(link.path)
              ? 'font-medium text-primary'
              : 'text-foreground/80 hover:text-foreground'
          }`}
          onClick={handleClose}
        >
          {link.icon}
          {link.name}
        </Link>
      </li>
    ));
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <span className="font-bold text-xl">Elevate Fitness</span>
        </Link>

        {isMobile ? (
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80vw] sm:w-[350px]">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                  <span className="font-bold text-xl">Elevate Fitness</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClose}
                    className="rounded-full"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <nav className="flex-1">
                  <ul className="flex flex-col gap-5">
                    {renderNavLinks()}
                  </ul>
                </nav>
                <div className="pt-6 mt-auto border-t">
                  {user ? (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        signOut();
                        handleClose();
                      }}
                    >
                      Sign Out
                    </Button>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Link to="/auth" onClick={handleClose}>
                        <Button variant="default" className="w-full">
                          Sign In
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <div className="flex items-center gap-6">
            <nav>
              <ul className="flex items-center gap-6">
                {renderNavLinks()}
              </ul>
            </nav>
            {user ? (
              <Button variant="outline" size="sm" onClick={signOut}>
                Sign Out
              </Button>
            ) : (
              <Link to="/auth">
                <Button variant="default" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
