'use client';
import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Terminal } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const isManualScrolling = useRef(false); // Ref to prevent observer jump during manual scroll

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
    <nav className="fixed w-full z-50 border-b border-white/10 bg-[#020a05]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        <Link 
          href="/#home" 
          onClick={(e) => handleScroll(e, '/#home')}
          className="flex items-center gap-2 font-bold text-xl tracking-tighter cursor-pointer"
        >
          <Terminal className="text-[#2F9A58]" size={20} />
          <span className="bg-gradient-to-r from-[#2F9A58] to-[#2F9A58] bg-clip-text text-transparent">
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
                  isActive ? 'text-white' : 'text-slate-500 group-hover:text-[#2F9A58]'
                }`}>
                  {link.name}
                </span>

                {isActive && (
                  <div className="absolute inset-0 flex flex-col justify-end">
                    <motion.div
                      layoutId="activeTab"
                      className="h-[2px] bg-[#2F9A58] shadow-[0_0_10px_#2F9A58]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                    <div className="absolute inset-0 bg-[#2F9A58]/10" />
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        <button className="md:hidden text-[#2F9A58]" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-[#020a05] border-b border-white/10"
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
                      isActive ? 'bg-[#2F9A58]/10 text-white border-[#2F9A58]' : 'text-slate-400 border-transparent'
                    }`}
                  >
                    <span>{link.name}</span>
                    {isActive && <span className="text-[#2F9A58]">READY_</span>}
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