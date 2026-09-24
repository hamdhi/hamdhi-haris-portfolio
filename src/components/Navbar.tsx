'use client';
import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Terminal, Sun, Moon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const isManualScrolling = useRef(false); // Ref to prevent observer jump during manual scroll

  // Theme state
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setMounted(true);
      setIsDark(document.documentElement.classList.contains('dark'));
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  const toggleTheme = () => {
    setIsDark((prevIsDark) => {
      const newTheme = !prevIsDark;
      const root = document.documentElement;
      
      if (newTheme) {
        root.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        root.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return newTheme;
    });
  };

  const navLinks = useMemo(() => [
    { name: 'Identity', href: '/#home' },
    { name: 'Tech', href: '/#stack' },
    { name: 'Projects', href: '/#projects' },
    { name: 'Experience', href: '/#experience' },
    { name: 'Contact', href: '/#contact' },
    { name: 'Gallery', href: '/gallery' },
  ], []);

  const handleScroll = useCallback((e: React.MouseEvent, href: string) => {
    if (href.startsWith('/#') && pathname === '/') {
      e.preventDefault();
      const id = href.replace('/#', '');
      const element = document.getElementById(id);
      
      if (element) {
        isManualScrolling.current = true; // Lock the observer
        setActiveSection(id); // Set active immediately on click
        
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });

        // Release lock after scroll completes
        setTimeout(() => {
          isManualScrolling.current = false;
        }, 1000);
      }
      setIsOpen(false);
    }
  }, [pathname]);

  useEffect(() => {
    if (pathname !== '/') return;

    const observerOptions = {
      root: null,
      // Increased the detection area slightly to -20% / -70% 
      // so short sections like 'Experience' are easier to catch.
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      if (isManualScrolling.current) return; // Ignore if we are currently clicking a link

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id.toLowerCase());
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [pathname]);

  return (
    <nav className="fixed z-50 w-full border-b border-slate-200 bg-[var(--surface)]/90 backdrop-blur-xl transition-colors duration-300 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        <Link 
          href="/#home" 
          onClick={(e) => handleScroll(e, '/#home')}
          className="flex items-center gap-2 font-bold text-xl tracking-tighter cursor-pointer"
        >
          <Terminal className="text-accent" size={20} />
          <span className="bg-gradient-to-r from-accent to-accent bg-clip-text text-transparent">
            HamdhiHaris
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-4 text-[10px] font-bold uppercase tracking-[0.3em]">
          {navLinks.map((link) => {
            const isGallery = link.href === '/gallery';
            const linkId = link.href.includes('#') ? link.href.split('#')[1].toLowerCase() : '';
            const isActive = isGallery ? pathname === '/gallery' : (pathname === '/' && activeSection === linkId);

            return (
              <Link 
                key={link.name} 
                href={link.href}
                onClick={(e) => handleScroll(e, link.href)}
                className="relative px-4 py-2 group"
                prefetch={false} 
              >
                <span className={`relative z-10 transition-colors duration-200 ${
              isActive ? 'text-accent dark:text-white' : 'text-slate-500 group-hover:text-accent'
                }`}>
                  {link.name}
                </span>

                {isActive && (
                    <div className="absolute inset-x-4 bottom-0 flex flex-col justify-end">
                    <motion.div
                      layoutId="activeTab"
                        className="h-[2px] bg-accent"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          {mounted && (
            <button onClick={toggleTheme} aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'} className="flex h-11 w-11 items-center justify-center text-slate-500 transition-colors hover:text-accent">
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          )}
          <button className="flex h-11 w-11 items-center justify-center text-accent md:hidden" onClick={() => setIsOpen(!isOpen)} aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={isOpen}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="border-b border-slate-200 bg-[var(--surface)] md:hidden dark:border-white/10"
          >
            <div className="flex flex-col items-stretch py-8 font-mono text-sm">
              {navLinks.map((link) => {
                const linkId = link.href.includes('#') ? link.href.split('#')[1].toLowerCase() : '';
                const isActive = link.href === '/gallery' ? pathname === '/gallery' : (pathname === '/' && activeSection === linkId);
                
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleScroll(e, link.href)}
                    className={`px-10 py-4 border-l-2 flex justify-between items-center ${
                  isActive ? 'bg-accent/10 text-accent dark:text-white border-accent' : 'text-slate-500 dark:text-slate-400 border-transparent'
                    }`}
                  >
                    <span>{link.name}</span>
                    {isActive && <span className="text-accent">READY_</span>}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}