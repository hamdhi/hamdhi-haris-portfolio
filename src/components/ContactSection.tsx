'use client';
import ContactForm from './ContactForm';

interface ContactProps {
  email: string;
  location: string;
}

export default function Contact({ email, location }: ContactProps) {
  return (
    <section id="contact" className="relative z-10 max-w-7xl mx-auto px-6 py-32 border-t border-white/5">
      <div className="grid md:grid-cols-2 gap-20 items-center">
        {/* Left Side: Info */}
        <div>
          <h2 className="text-5xl font-bold mb-6">
            Let's <span className="text-cyan-400">Initialize</span> <br /> a Connection.
          </h2>
          <p className="text-slate-400 mb-10 leading-relaxed text-lg italic">
            Currently available for intern software engineering opportunities. 
            Open to discussing Java, Next.js, and backend architecture projects.
          </p>
          
          {/* Terminal-style metadata */}
          <div className="space-y-4 mono text-sm text-slate-500">
            <p>{`> Location: ${location}`}</p>
            <p>{`> Email: ${email}`}</p>
            <p className="flex items-center gap-2">
              {`> Status: `} 
              <span className="text-cyan-400 animate-pulse">Ready to Scale</span>
            </p>
          </div>
        </div>

        {/* Right Side: Interactive Form */}
        <div className="relative">
          {/* Subtle glow behind the form */}
          <div className="absolute -inset-4 bg-cyan-400/5 blur-3xl rounded-full pointer-events-none" />
          <ContactForm />
        </div>
      </div>
    </section>
  );
}