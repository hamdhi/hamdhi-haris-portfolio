'use client';
import ContactForm from './ContactForm';
import { Mail, Github, Linkedin, MessageCircle, Phone } from 'lucide-react';

interface ContactProps {
  email: string;
  location: string;
}

export default function Contact({ email, location }: ContactProps) {
  return (
    <section id="contact" className="relative z-10 max-w-7xl mx-auto px-6 py-32 border-t border-slate-200 dark:border-white/5">
      <div className="grid md:grid-cols-2 gap-20 items-center">
        {/* Left Side: Info */}
        <div>
          <h2 className="text-5xl font-bold mb-6 text-slate-900 dark:text-white">
            Let's <span className="text-[#0EA5E9]">Initialize</span> <br /> a Connection.
          </h2>
          <p className="text-slate-400 mb-10 leading-relaxed text-lg italic">
            Currently available for intern software engineering opportunities. 
            Open to discussing Java, Next.js, and backend architecture projects.
          </p>
          
          {/* Terminal-style metadata */}
          <div className="space-y-4 mono text-sm text-slate-500 mb-10">
            <p>{`> Location: ${location}`}</p>
            <p>{`> Email: ${email}`}</p>
            <p className="flex items-center gap-2">
              {`> Status: `} 
              <span className="text-[#0EA5E9] animate-pulse">Ready to Scale</span>
            </p>
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap gap-4">
            <a 
              href={`mailto:${email}`}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-white/5 hover:bg-[#0EA5E9]/10 border border-slate-200 dark:border-white/10 hover:border-[#0EA5E9]/50 rounded-lg text-slate-600 dark:text-slate-300 hover:text-[#0EA5E9] transition-all font-mono text-xs shadow-sm hover:shadow-[0_0_15px_rgba(14,165,233,0.2)]"
            >
              <Mail size={16} /> EMAIL
            </a>
            <a 
              href="https://github.com/hamdhi"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-white/5 hover:bg-[#0EA5E9]/10 border border-slate-200 dark:border-white/10 hover:border-[#0EA5E9]/50 rounded-lg text-slate-600 dark:text-slate-300 hover:text-[#0EA5E9] transition-all font-mono text-xs shadow-sm hover:shadow-[0_0_15px_rgba(14,165,233,0.2)]"
            >
              <Github size={16} /> GITHUB
            </a>
            <a 
              href="https://www.linkedin.com/in/hamdhi-haris-68994a1b4/" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-white/5 hover:bg-[#0EA5E9]/10 border border-slate-200 dark:border-white/10 hover:border-[#0EA5E9]/50 rounded-lg text-slate-600 dark:text-slate-300 hover:text-[#0EA5E9] transition-all font-mono text-xs shadow-sm hover:shadow-[0_0_15px_rgba(14,165,233,0.2)]"
            >
              <Linkedin size={16} /> LINKEDIN
            </a>
            <a 
              href="https://wa.me/94702031483" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-white/5 hover:bg-[#0EA5E9]/10 border border-slate-200 dark:border-white/10 hover:border-[#0EA5E9]/50 rounded-lg text-slate-600 dark:text-slate-300 hover:text-[#0EA5E9] transition-all font-mono text-xs shadow-sm hover:shadow-[0_0_15px_rgba(14,165,233,0.2)]"
            >
              <MessageCircle size={16} /> WHATSAPP
            </a>
            <a 
              href="tel:+94702031483"
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-white/5 hover:bg-[#0EA5E9]/10 border border-slate-200 dark:border-white/10 hover:border-[#0EA5E9]/50 rounded-lg text-slate-600 dark:text-slate-300 hover:text-[#0EA5E9] transition-all font-mono text-xs shadow-sm hover:shadow-[0_0_15px_rgba(14,165,233,0.2)]"
            >
              <Phone size={16} /> PHONE
            </a>
          </div>
        </div>

        {/* Right Side: Interactive Form */}
        <div className="relative">
          {/* Subtle green glow behind the form */}
          <div className="absolute -inset-4 bg-[#0EA5E9]/5 blur-3xl rounded-full pointer-events-none" />
          <ContactForm />
        </div>
      </div>


      
    </section>
  );
}