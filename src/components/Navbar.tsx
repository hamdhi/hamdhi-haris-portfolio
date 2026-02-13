'use client';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Terminal } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Memoize links to prevent unnecessary re-renders
  const navLinks = useMemo(() => [
    { name: 'Identity', href: '/#home' },
    { name: 'Tech', href: '/#stack' },
    { name: 'Projects', href: '/#projects' },
    { name: 'Experience', href: '/#experience' },
    { name: 'Contact', href: '/#contact' },
    { name: 'Gallery', href: '/gallery' },
  ], []);

  // Smoother manual scroll with dynamic offset calculation
  const handleScroll = useCallback((e: React.MouseEvent, href:string) => {
    if (href.startsWith('/#') && pathname === '/') {
      e.preventDefault();
      const id = href.replace('/#', '');
      const element = document.getElementById(id);
      
      if (element) {
        const offset = 80; // Navbar height
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
      setIsOpen(false);
    }
  }, [pathname]);

  // Lazy Intersection Observer - only runs on home page
  useEffect(() => {
    if (pathname !== '/') return;

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px', // Focused detection area
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [pathname]);

  return (
    <nav className="fixed w-full z-50 border-b border-white/10 bg-[#020617]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Brand/Logo */}
        <Link 
          href="/#home" 
          onClick={(e) => handleScroll(e, '/#home')}
          className="flex items-center gap-2 font-bold text-xl tracking-tighter cursor-pointer"
        >
          <Terminal className="text-cyan-400" size={20} />
          <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            HamdhiHaris
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4 text-[10px] font-bold uppercase tracking-[0.3em]">
          {navLinks.map((link) => {
            const isGallery = link.href === '/gallery';
            const isActive = isGallery
              ? pathname === '/gallery'
              : (pathname === '/' && activeSection === link.href.replace('/#', ''));

            return (
              <Link 
                key={link.name} 
                href={link.href}
                onClick={(e) => handleScroll(e, link.href)}
                className="relative px-4 py-2 group"
                prefetch={false} // Next.js Lazy Loading: only prefetch when hovered
              >
                <span className={`relative z-10 transition-colors duration-200 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-cyan-400'}`}>
                  {link.name}
                </span>

                {isActive && (
                  <div className="absolute inset-0 flex flex-col justify-end">
                    <motion.div
                      layoutId="activeTab"
                      className="h-[2px] bg-cyan-400 shadow-[0_0_10px_#22d3ee]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                    <div className="absolute inset-0 bg-cyan-400/10" />
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-cyan-400" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay - Animated for "Lazy" feel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-[#020617] border-b border-white/10"
          >
            <div className="flex flex-col items-stretch py-8 font-mono text-sm">
              {navLinks.map((link) => {
                const isActive = pathname === '/' && activeSection === link.href.replace('/#', '');
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleScroll(e, link.href)}
                    className={`px-10 py-4 border-l-2 flex justify-between items-center ${
                      isActive ? 'bg-cyan-400/10 text-white border-cyan-400' : 'text-slate-400 border-transparent'
                    }`}
                  >
                    <span>{link.name}</span>
                    {isActive && <span className="text-cyan-400">READY_</span>}
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