"use client"; // <--- Add this line first!
import Navbar from '@/components/Navbar';
import SpiderBg from '@/components/SpiderBg';
import { getCvUrl, supabase } from '@/lib/supabase';
import Hero from '@/components/Hero';
import Contact from '@/components/ContactSection';
import Footer from '@/components/Footer';
import TechStack from '@/components/TechStack';
import Projects from '@/components/Projects';
import { useEffect, useRef } from 'react';
import ExperienceLeadership from '@/components/Experience';
import AboutMe from '@/components/AboutMe';
import SystemTelemetry from '@/components/SystemTelemetry';
import ScrollToTop from '@/components/ScrollToTop';
import { motion, useInView } from 'framer-motion';

function RevealWrapper({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  useEffect(() => {
    // This calls the SQL function to track profile views
    const trackView = async () => {
      try {
        // Check if an admin session is currently active
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          return; // Skip incrementing views if admin is logged in
        }

        await supabase.rpc('increment_views');
      } catch (error) {
        // Fail silently if Supabase is paused or unreachable
        console.error('Failed to increment views:', error);
      }
    };
    
    trackView();
  }, []);

  /////
  const cvLink = getCvUrl();

  return (
    <main className="relative min-h-screen bg-slate-50 dark:bg-[#07111f] text-slate-900 dark:text-white selection:bg-accent/30 overflow-x-hidden transition-colors duration-300"> 
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-accent z-[100] shadow-[0_0_16px_var(--accent)]" />

      {/* Spider Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <SpiderBg />
      </div>

      {/* Navigation Bar */}
      <Navbar />

      <div className="relative z-10 flex flex-col gap-10 md:gap-20 pb-10">
        <Hero cvLink={cvLink} />
        
        <RevealWrapper>
          <AboutMe />
        </RevealWrapper>

        <RevealWrapper>
          <TechStack />
        </RevealWrapper>
       
        <RevealWrapper>
          <Projects />
        </RevealWrapper>

        <RevealWrapper>
          <ExperienceLeadership />
        </RevealWrapper>

        <RevealWrapper>
          <SystemTelemetry GITHUB_USERNAME="hamdhi" />
        </RevealWrapper>

        <RevealWrapper>
          <Contact email="hamdhiharis@gmail.com" location="Sri Lanka" />
        </RevealWrapper>
      </div>

      {/* Footer Section */}
      <Footer name="Hamdhi Haris" version="1.0.01"/>

      <ScrollToTop />
      
    </main>
  );
}