'use client';
import { useState, useEffect } from 'react';
import { Mail, User, Clock, MessageSquare, ShieldAlert, Zap, Trash2, Loader2 } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';

export default function MessageLogs() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Initialize Supabase Browser Client
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    // 1. Initial Data Fetch
    const fetchInitialMessages = async () => {
      try {
        const res = await fetch('/api/admin/get-messages');
        const data = await res.json();
        if (Array.isArray(data)) {
          setMessages(data);
        }
      } catch (error) {
        console.error("Failed to load initial messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialMessages();

    // 2. Realtime Subscription for Live Updates
    const channel = supabase
      .channel('admin_messages_feed')
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'contact_messages' 
        },
        (payload) => {
          setMessages((current) => [payload.new, ...current]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  // --- DELETE HANDLER ---
  const handleDelete = async (id: string) => {
    if (!confirm("Destroy this communication record?")) return;
    
    setDeletingId(id);
    try {
      const res = await fetch('/api/admin/delete-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        // Optimistic UI Update: Remove from local state instantly
        setMessages(current => current.filter(m => m.id !== id));
      } else {
        alert("Failed to delete record from database.");
      }
    } catch (err) {
      console.error("Deletion error:", err);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="mt-20 flex items-center gap-3 text-[#2F9A58] font-mono text-xs animate-pulse">
        <Zap size={14} className="animate-bounce" />
        ESTABLISHING_LIVE_UPLINK...
      </div>
    );
  }

  return (
    <section className="mt-20 space-y-6">
      {/* Section Header with Live Indicator */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <MessageSquare className="text-[#2F9A58]" size={20} />
          <h2 className="text-sm font-mono text-slate-400 uppercase tracking-[0.3em]">Communication_Logs</h2>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1 bg-[#2F9A58]/5 rounded-full border border-[#2F9A58]/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2F9A58] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2F9A58]"></span>
          </span>
          <span className="text-[10px] font-mono text-[#2F9A58] font-bold uppercase tracking-tighter">Live_Feed</span>
        </div>
      </div>

      {/* Messages Grid */}
      <div className="grid gap-4">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div 
              key={msg.id} 
              className="group relative bg-[#0f172a] border border-white/5 p-5 rounded-2xl hover:border-[#2F9A58]/30 transition-all animate-in fade-in slide-in-from-top-4 duration-500"
            >
              {/* Delete Button - Appears on Hover */}
              <button 
                onClick={() => handleDelete(msg.id)}
                disabled={deletingId === msg.id}
                className="absolute top-4 right-4 p-2 text-slate-600 hover:text-[#2F9A58] hover:bg-[#2F9A58]/10 rounded-lg transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
              >
                {deletingId === msg.id ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
              </button>

              <div className="flex flex-col md:flex-row justify-between gap-4 mb-4 pr-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#2F9A58]/10 flex items-center justify-center border border-[#2F9A58]/20 text-[#2F9A58]">
                    <User size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-tight">{msg.name}</h4>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                      <Mail size={10} /> {msg.email}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-slate-600 font-mono text-[9px] bg-black/20 px-3 py-1 rounded-full self-start border border-white/5">
                  <Clock size={10} />
                  {new Date(msg.created_at).toLocaleString([], {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  })}
                </div>
              </div>

              <div className="relative p-4 bg-slate-950/50 rounded-xl border border-white/5 text-sm text-slate-300 leading-relaxed italic">
                <span className="text-[#2F9A58]/20 font-serif text-3xl absolute -top-1 -left-1 select-none">"</span>
                {msg.message}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/5 rounded-3xl">
            <ShieldAlert className="text-slate-700 mb-2" size={32} />
            <p className="text-slate-600 font-mono text-xs uppercase tracking-widest">No_Transmissions_Detected</p>
          </div>
        )}
      </div>
    </section>
  );
}