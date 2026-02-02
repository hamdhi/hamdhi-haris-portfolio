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

export default function Home() {
  useEffect(() => {
    // This calls the SQL function you just created
    const trackView = async () => {
      await supabase.rpc('increment_views');
    };
    
    trackView();
  }, []);

  /////
  const cvLink = getCvUrl();

  return (
    <main className="relative min-h-screen bg-[#020617] text-white selection:bg-cyan-500/30">
      {/* Spider Background */}
      <SpiderBg />

      {/* Navigation Bar */}
      <Navbar />

      {/* Hero Section */}
      <Hero cvLink={cvLink} />

      {/* Tech Arsenal */}
      <TechStack />
     
      {/* Projects */}
      < Projects />

      {/* Contacts Section */}
      <Contact email="hamdhiharis@gmail.com" location="Sri Lanka" />

      {/* Footer Section */}
      <Footer name="Hamdhi Haris" version="1.0.01"/>

      
    </main>
  );
}