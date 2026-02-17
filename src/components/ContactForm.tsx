'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Send, Loader2 } from 'lucide-react';

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
    }
  }
  
  return (
    // Outer border gradient updated for green depth
    <div className="relative p-1 bg-gradient-to-br from-[#2F9A58]/30 via-[#2F9A58]/10 to-black rounded-2xl">
      {/* Form background changed to a deep greenish-slate for consistency */}
      <form onSubmit={handleSubmit} className="bg-[#020a05] p-8 rounded-2xl space-y-6">
        <div>
          <label className="block text-[10px] font-bold text-[#2F9A58] uppercase mb-2 tracking-widest">Full_Name</label>
          <input required name="name" className="w-full bg-white/5 border border-white/10 p-4 rounded-lg focus:outline-none focus:border-[#2F9A58] transition text-white" />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-[#2F9A58] uppercase mb-2 tracking-widest">Email_Address</label>
          <input required name="email" type="email" className="w-full bg-white/5 border border-white/10 p-4 rounded-lg focus:outline-none focus:border-[#2F9A58] transition text-white" />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-[#2F9A58] uppercase mb-2 tracking-widest">Message_Data</label>
          <textarea required name="message" rows={4} className="w-full bg-white/5 border border-white/10 p-4 rounded-lg focus:outline-none focus:border-[#2F9A58] transition text-white" />
        </div>
        
        <button disabled={loading} className="w-full flex items-center justify-center gap-3 bg-white text-black font-bold py-4 rounded-lg hover:bg-[#2F9A58] hover:text-white transition duration-300 group shadow-lg shadow-[#2F9A58]/20">
          {loading ? <Loader2 className="animate-spin" /> : <><Send size={18} /> TRANSMIT_MESSAGE</>}
        </button>

        {status === 'success' && <p className="text-center text-[#2F9A58] text-xs font-mono">MESSAGE_RECEIVED_SUCCESSFULLY</p>}
        {status === 'error' && <p className="text-center text-emerald-400 text-xs font-mono">TRANSMISSION_FAILED_RETRY</p>}
      </form>
    </div>
  );
}