"use client"; // <--- Add this line first!
import Navbar from '@/components/Navbar';
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
    <main className="relative min-h-screen bg-[var(--background)] text-slate-900 dark:text-white selection:bg-accent/30 overflow-x-hidden transition-colors duration-300"> 
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-accent z-[100] shadow-[0_0_16px_var(--accent)]" />

      {/* Navigation Bar */}
      <Navbar />

      <div className="relative z-10 pb-8">
        <Hero cvLink={cvLink} />
        <AboutMe />
        <TechStack />
        <Projects />
        <ExperienceLeadership />
        <SystemTelemetry GITHUB_USERNAME="hamdhi" />
        <Contact email="hamdhiharis@gmail.com" location="Sri Lanka" />
      </div>

      {/* Footer Section */}
      <Footer name="Hamdhi Haris" version="1.0.01"/>

      <ScrollToTop />
      
    </main>
  );
}