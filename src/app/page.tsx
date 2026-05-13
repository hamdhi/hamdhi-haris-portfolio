"use client"; // <--- Add this line first!
import Navbar from '@/components/Navbar';
import SpiderBg from '@/components/SpiderBg';
import { getCvUrl, supabase } from '@/lib/supabase';
import Hero from '@/components/Hero';
import Contact from '@/components/ContactSection';
import Footer from '@/components/Footer';
import TechStack from '@/components/TechStack';
import Projects from '@/components/Projects';
import { useEffect } from 'react';
import ExperienceLeadership from '@/components/Experience';
import AboutMe from '@/components/AboutMe';
import SystemTelemetry from '@/components/SystemTelemetry';
import ScrollToTop from '@/components/ScrollToTop';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

function RevealWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.95, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

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
    <main className="relative min-h-screen bg-[#041802] text-white selection:bg-[#2F9A58]/30 overflow-x-hidden"> 
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#2F9A58]/40 via-[#2F9A58] to-[#80EBA9] origin-left z-[100] shadow-[0_0_20px_#2F9A58]"
        style={{ scaleX }}
      />

      {/* Spider Background */}
      <motion.div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ y: backgroundY }}
      >
        <SpiderBg />
      </motion.div>

      {/* Navigation Bar */}
      <Navbar />

      <div className="relative z-10 flex flex-col gap-10 md:gap-20 pb-10">
        <motion.section 
          id="home"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <Hero cvLink={cvLink} />
        </motion.section>
        
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