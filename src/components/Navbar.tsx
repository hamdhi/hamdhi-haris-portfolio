'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Terminal } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Identity', href: '#home' },
    { name: 'Arsenal', href: '#stack' },
    { name: 'Vault', href: '#projects' },
    { name: 'Logs', href: '#contact' },
  ];

  return (
    <nav className="fixed w-full z-50 border-b border-white/10 bg-[#020617]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
          <Terminal className="text-cyan-400" size={20} />
          <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            HamdhiNygma
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-10 text-[10px] font-bold uppercase tracking-[0.3em]">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="hover:text-cyan-400 transition-colors">
              {link.name}
            </a>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-cyan-400" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#020617] border-b border-white/10 overflow-hidden"
          >
            <div className="flex flex-col items-center py-8 space-y-6 font-mono text-sm">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="hover:text-cyan-400 transition-colors"
                >
                  {`> ${link.name}`}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}