'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const { error } = await supabase.from('contact_messages').insert({
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    });

    setLoading(false);
    if (error) setStatus('error');
    else {
      setStatus('success');
      (e.target as HTMLFormElement).reset();
      setTimeout(() => setStatus('idle'), 5000); // Reset status after 5s
    }
  }

  const formVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };
  
  return (
    // Outer border gradient updated for green depth
    <div className="relative p-1 bg-gradient-to-br from-[#2F9A58]/30 via-[#2F9A58]/10 to-black rounded-2xl">
      {/* Form background changed to a deep greenish-slate for consistency */}
      <motion.form 
        variants={formVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        onSubmit={handleSubmit} 
        className="bg-[#020a05] p-8 rounded-2xl space-y-6"
      >
        <motion.div variants={itemVariants}>
          <label className="block text-[10px] font-bold text-[#2F9A58] uppercase mb-2 tracking-widest">Full_Name</label>
          <input required name="name" className="w-full bg-white/5 border border-white/10 p-4 rounded-lg focus:outline-none focus:border-[#2F9A58] focus:ring-4 focus:ring-[#2F9A58]/10 transition-all text-white placeholder:text-white/20 shadow-inner" placeholder="Enter your name..." />
        </motion.div>
        <motion.div variants={itemVariants}>
          <label className="block text-[10px] font-bold text-[#2F9A58] uppercase mb-2 tracking-widest">Email_Address</label>
          <input required name="email" type="email" className="w-full bg-white/5 border border-white/10 p-4 rounded-lg focus:outline-none focus:border-[#2F9A58] focus:ring-4 focus:ring-[#2F9A58]/10 transition-all text-white placeholder:text-white/20 shadow-inner" placeholder="john@domain.com" />
        </motion.div>
        <motion.div variants={itemVariants}>
          <label className="block text-[10px] font-bold text-[#2F9A58] uppercase mb-2 tracking-widest">Message_Data</label>
          <textarea required name="message" rows={4} className="w-full bg-white/5 border border-white/10 p-4 rounded-lg focus:outline-none focus:border-[#2F9A58] focus:ring-4 focus:ring-[#2F9A58]/10 transition-all text-white resize-none placeholder:text-white/20 shadow-inner" placeholder="Initialize communication protocol..." />
        </motion.div>
        
        <motion.button 
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading} 
          className="w-full flex items-center justify-center gap-3 bg-white text-black font-bold py-4 rounded-lg hover:bg-[#2F9A58] hover:text-white transition-colors duration-300 group shadow-[0_0_20px_rgba(47,154,88,0.1)] hover:shadow-[0_0_25px_rgba(47,154,88,0.4)] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="animate-spin" /> : <><Send size={18} /> TRANSMIT_MESSAGE</>}
        </motion.button>

        {/* Animated Status Messages */}
        <div className="h-6">
          <AnimatePresence mode="wait">
            {status === 'success' && (
              <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="flex items-center justify-center gap-2 text-center text-[#2F9A58] text-xs font-mono">
                <CheckCircle2 size={14} /> MESSAGE_RECEIVED_SUCCESSFULLY
              </motion.p>
            )}
            {status === 'error' && (
              <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="flex items-center justify-center gap-2 text-center text-red-400 text-xs font-mono">
                <AlertCircle size={14} /> TRANSMISSION_FAILED_RETRY
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.form>
    </div>
  );
}