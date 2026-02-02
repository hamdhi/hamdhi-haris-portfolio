'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Terminal } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const navLinks = [
    { name: 'Identity', href: '/#home' },
    { name: 'Tech', href: '/#stack' },
    { name: 'Projects', href: '/#projects' },
    { name: 'Contact', href: '/#contact' },
    { name: 'Gallery', href: '/gallery' },
    
  ];

  useEffect(() => {
    if (pathname !== '/') return;

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
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
        <Link href="/#home" className="flex items-center gap-2 font-bold text-xl tracking-tighter cursor-pointer">
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
              <Link key={link.name} href={link.href} className="relative px-4 py-2 group">
                {/* Text: Solid White when active */}
                <span className={`relative z-10 transition-colors duration-200 ${isActive ? 'text-white' : 'text-white-500 group-hover:text-cyan-400'}`}>
                  {link.name}
                </span>

                {/* Tech Scan Animation - Triggered independently per link */}
                {isActive && (
                  <div className="absolute inset-0 flex flex-col justify-end">
                    {/* The Scan Bar: Grows from center-out, no sliding from other links */}
                    <motion.div
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{ scaleX: 1, opacity: 1 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="h-[2px] bg-cyan-400 shadow-[0_0_10px_#22d3ee]"
                    />
                    {/* Subtle static glow to make text pop */}
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

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="md:hidden bg-[#020617] border-b border-white/10 overflow-hidden"
          >
            <div className="flex flex-col items-stretch py-8 font-mono text-sm">
              {navLinks.map((link) => {
                const isGallery = link.href === '/gallery';
                const isActive = isGallery
                  ? pathname === '/gallery'
                  : (pathname === '/' && activeSection === link.href.replace('/#', ''));

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`px-10 py-4 transition-all border-l-2 flex justify-between items-center ${isActive
                      ? 'bg-cyan-400/10 text-white border-cyan-400'
                      : 'text-slate-400 border-transparent hover:text-white'
                      }`}
                  >
                    <span>{link.name}</span>
                    {isActive && <motion.span layoutId="mobile-indicator" className="text-cyan-400">READY_</motion.span>}
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