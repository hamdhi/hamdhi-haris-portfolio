'use client';
import { useState, useEffect } from 'react';
import { FolderGit2, MessageSquare, Eye, TrendingUp, Zap } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';

export default function StatsOverview() {
  const [stats, setStats] = useState({ projects: 0, messages: 0, views: 0 });
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function fetchAllStats() {
      try {
        // 1. Fetch Local Projects Count
        const projRes = await fetch('/api/admin/get-projects');
        const projData = await projRes.json();

        // 2. Fetch Supabase Messages Count
        const { count: msgCount } = await supabase
          .from('contact_messages')
          .select('*', { count: 'exact', head: true });

        // 3. Fetch Profile Views
        const { data: viewData } = await supabase
          .from('profile_stats')
          .select('count')
          .eq('metric_name', 'profile_views')
          .single();

        setStats({
          projects: Array.isArray(projData) ? projData.length : 0,
          messages: msgCount || 0,
          views: viewData?.count || 0
        });
      } catch (err) {
        console.error("Dashboard sync error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAllStats();
    
    // Optional: Realtime update for the stats if a new message comes in
    const channel = supabase
      .channel('stats_sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contact_messages' }, () => {
        fetchAllStats();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // Swapped colors from red variations to emerald/green variations
  const cards = [
    { label: 'Project_Vault', val: stats.projects, icon: FolderGit2, color: 'text-[#2F9A58]', bg: 'bg-[#2F9A58]/10' },
    { label: 'Client_Comms', val: stats.messages, icon: MessageSquare, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'System_Views', val: stats.views, icon: Eye, color: 'text-[#2F9A58]', bg: 'bg-[#2F9A58]/10' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-[#0f172a] border border-white/5 p-5 rounded-2xl group hover:border-[#2F9A58]/20 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">{card.label}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white tracking-tighter">
                  {loading ? '---' : card.val}
                </span>
                <TrendingUp size={12} className="text-slate-600" />
              </div>
            </div>
            <div className={`p-3 rounded-xl ${card.bg} ${card.color}`}>
              <card.icon size={20} />
            </div>
          </div>
          
          <div className="mt-4 flex items-center gap-2">
            <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
              <div 
                className={`h-full ${card.color.startsWith('text-[#') ? 'bg-[#2F9A58]' : 'bg-emerald-400'} opacity-40 transition-all duration-1000`} 
                style={{ width: loading ? '0%' : '100%' }}
              />
            </div>
            <Zap size={10} className="text-slate-700" />
          </div>
        </div>
      ))}
    </div>
  );
}