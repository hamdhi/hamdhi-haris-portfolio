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
    <div className="relative p-1 bg-gradient-to-br from-cyan-400/20 to-purple-600/20 rounded-2xl">
      <form onSubmit={handleSubmit} className="bg-[#020617] p-8 rounded-2xl space-y-6">
        <div>
          <label className="block text-[10px] font-bold text-cyan-400 uppercase mb-2">Full_Name</label>
          <input required name="name" className="w-full bg-white/5 border border-white/10 p-4 rounded-lg focus:outline-none focus:border-cyan-400 transition" />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-cyan-400 uppercase mb-2">Email_Address</label>
          <input required name="email" type="email" className="w-full bg-white/5 border border-white/10 p-4 rounded-lg focus:outline-none focus:border-cyan-400 transition" />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-cyan-400 uppercase mb-2">Message_Data</label>
          <textarea required name="message" rows={4} className="w-full bg-white/5 border border-white/10 p-4 rounded-lg focus:outline-none focus:border-cyan-400 transition" />
        </div>
        
        <button disabled={loading} className="w-full flex items-center justify-center gap-3 bg-white text-black font-bold py-4 rounded-lg hover:bg-cyan-400 transition duration-300 group">
          {loading ? <Loader2 className="animate-spin" /> : <><Send size={18} /> TRANSMIT_MESSAGE</>}
        </button>

        {status === 'success' && <p className="text-center text-cyan-400 text-xs mono">MESSAGE_RECEIVED_SUCCESSFULLY</p>}
        {status === 'error' && <p className="text-center text-red-400 text-xs mono">TRANSMISSION_FAILED_RETRY</p>}
      </form>
    </div>
  );
}