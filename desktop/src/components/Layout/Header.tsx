import React, { useState, useEffect } from 'react';
import { motion, useAnimationControls, AnimatePresence, Variants } from 'framer-motion';
// Mock TanStack Router types and components
type RouterLink = React.FC<{
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}>;

// Simple Link component that acts like a router link but doesn't navigate
const Link: RouterLink = ({ to, children, className, onClick }) => (
  <div
    className={className}
    onClick={(e) => {
      e.preventDefault();
      if (onClick) onClick();
    }}
    style={{ cursor: "pointer" }}
  >
    {children}
  </div>
);
// Mock next-themes
interface ThemeProviderContext {
  theme: string | undefined;
  setTheme: (theme: string) => void;
  resolvedTheme?: string;
}

const useTheme = (): ThemeProviderContext => {
  const [theme, setThemeState] = useState<string>("light");

  useEffect(() => {
    // Check if user has dark mode preference
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setThemeState(isDark ? "dark" : "light");
  }, []);

  const setTheme = (newTheme: string) => {
    setThemeState(newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return {
    theme,
    setTheme,
    resolvedTheme: theme,
  };
};
import { Sun, Moon, Menu, X, Cpu, Code, Settings, Home } from 'lucide-react';
import { KledLogo } from '../ui/logo/KledLogo';

// Modern Framer Motion animations
// Router state hook mock
const useRouterState = () => {
  return {
    location: {
      pathname: window.location.pathname
    }
  };
};

// Properly typed Framer Motion variants
const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const item: Variants = {
  hidden: { y: 20, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  }
};

const glow: Variants = {
  initial: {
    boxShadow: '0 0 0px rgba(50, 200, 255, 0)'
  },
  animate: {
    boxShadow: '0 0 20px rgba(50, 200, 255, 0.3)',
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse" as const
    }
  }
};

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Workspaces', path: '/workspaces', icon: Cpu },
  { name: 'Code Interpreter', path: '/interpreter', icon: Code },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export default function Header() {
  const { resolvedTheme, setTheme } = useTheme();
  const routerState = useRouterState();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const controls = useAnimationControls();

  // Create a pulse effect when the component mounts
  useEffect(() => {
    controls.start({
      scale: [1, 1.05, 1],
      transition: { duration: 1.5, ease: "easeInOut" }
    });
  }, [controls]);

  // Handle scroll events for header transparency effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Get current route
  const currentPath = routerState.location.pathname;

  // Background transition based on scroll position
  const bgOpacity = scrolled ? 0.8 : 0;
  const backdropBlur = scrolled ? 10 : 0;
  const shadowOpacity = scrolled ? 0.1 : 0;

  // Handle theme toggle with animation
  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');

    // Add a quick pulse animation when toggling theme
    controls.start({
      scale: [1, 1.1, 1],
      transition: { duration: 0.3, ease: "easeInOut" }
    });
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 data-[tauri-drag-region]:tauri-drag-region"
      data-tauri-drag-region
    >
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{
          backgroundColor: `rgba(10, 10, 20, ${bgOpacity})`,
          backdropFilter: `blur(${backdropBlur}px)`,
          boxShadow: `0 4px 30px rgba(0, 0, 0, ${shadowOpacity})`,
        }}
        className="transition-all duration-300 ease-in-out"
        data-tauri-drag-region
      >
        <div className="container mx-auto px-4" data-tauri-drag-region>
          <div className="flex h-16 items-center justify-between" data-tauri-drag-region>
            {/* Logo section with pulse effect */}
            <motion.div
              animate={controls}
              className="flex items-center"
              data-tauri-drag-region
            >
              <Link to="/" className="flex items-center">
                <KledLogo variant={resolvedTheme === 'dark' ? 'light' : 'dark'} />
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <motion.nav
              variants={container}
              initial="hidden"
              animate="show"
              className="hidden md:flex items-center space-x-1"
              data-tauri-drag-region
            >
              {navItems.map((item) => {
                const isActive = currentPath === item.path;
                const Icon = item.icon;

                return (
                  <motion.div key={item.path} variants={item} className="relative">
                    <Link
                      to={item.path}
                      className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? 'text-blue-400'
                          : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      <Icon size={18} />
                      <span>{item.name}</span>
                    </Link>

                    {/* Active indicator with glow effect */}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavHighlight"
                        className="absolute h-1 bottom-0 left-0 right-0 mx-4 bg-blue-500 rounded-t-full"
                        initial={{ boxShadow: '0 0 0px rgba(50, 200, 255, 0)' }}
                        animate={{
                          boxShadow: '0 0 20px rgba(50, 200, 255, 0.3)',
                          transition: {
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "reverse" as const
                          }
                        }}
                      />
                    )}
                  </motion.div>
                );
              })}
            </motion.nav>

            {/* Right-side controls */}
            <div className="flex items-center space-x-3" data-tauri-drag-region>
              {/* Theme toggle with motion */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-800/50 text-gray-300"
                aria-label="Toggle theme"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={resolvedTheme === 'dark' ? 'dark' : 'light'}
                    initial={{ y: -20, opacity: 0, rotate: -30 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: 20, opacity: 0, rotate: 30 }}
                    transition={{ duration: 0.2 }}
                  >
                    {resolvedTheme === 'dark' ? (
                      <Sun className="w-5 h-5" />
                    ) : (
                      <Moon className="w-5 h-5" />
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.button>

              {/* Mobile menu button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-full hover:bg-gray-800/50 text-gray-300"
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={isMobileMenuOpen ? 'open' : 'closed'}
                    initial={{ scale: 0, opacity: 0, rotate: -30 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0, opacity: 0, rotate: 30 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isMobileMenuOpen ? (
                      <X className="w-5 h-5" />
                    ) : (
                      <Menu className="w-5 h-5" />
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.button>

              {/* Waitlist button with gradient and glow */}
              <motion.div
                className="hidden md:block"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/waitlist"
                  className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-teal-400 shadow-lg shadow-blue-500/20"
                >
                  <motion.span
                    animate={{
                      boxShadow: ['0 0 0px rgba(59, 130, 246, 0)', '0 0 15px rgba(59, 130, 246, 0.5)', '0 0 0px rgba(59, 130, 246, 0)'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "loop"
                    }}
                    className="absolute inset-0 rounded-md"
                  />
                  Join Waitlist
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-gray-900/95 backdrop-blur-lg border-b border-white/10"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const isActive = currentPath === item.path;
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.path}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 p-3 rounded-md ${
                        isActive
                          ? 'bg-blue-500/20 text-blue-300'
                          : 'text-gray-300 hover:bg-gray-800/50'
                      }`}
                    >
                      <Icon size={18} />
                      <span>{item.name}</span>
                    </Link>
                  </motion.div>
                );
              })}

              {/* Mobile waitlist button */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 24, delay: 0.2 }}
                className="mt-4"
              >
                <Link
                  to="/waitlist"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-center p-3 rounded-md font-medium text-white bg-gradient-to-r from-blue-500 to-teal-400"
                >
                  Join Waitlist
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
