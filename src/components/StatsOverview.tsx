'use client';
import { useState, useEffect } from 'react';
import { FolderGit2, MessageSquare, Eye, TrendingUp, Zap, BarChart2, ExternalLink } from 'lucide-react';
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
        // 1. Fetch Local Projects Count safely
        let projectsCount = 0;
        try {
          const projRes = await fetch('/api/admin/projects');
          if (projRes.ok) {
            const projData = await projRes.json();
            projectsCount = Array.isArray(projData) ? projData.length : 0;
          }
        } catch (e) {
          console.error("Failed to fetch projects count", e);
        }

        // 2. Fetch Supabase Messages Count
        const { count: msgCount } = await supabase
          .from('contact_messages')
          .select('*', { count: 'exact', head: true });

        // 3. Fetch Profile Views
        const { data: viewData } = await supabase
          .from('profile_stats')
          .select('count')
          .eq('metric_name', 'profile_views')
          .maybeSingle(); // Changed to maybeSingle to prevent errors if row doesn't exist

        setStats({
          projects: projectsCount,
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
    { label: 'Project_Vault', val: stats.projects, icon: FolderGit2, color: 'text-accent', bg: 'bg-accent/10' },
    { label: 'Client_Comms', val: stats.messages, icon: MessageSquare, color: 'text-sky-400', bg: 'bg-sky-400/10' },
    { label: 'System_Views', val: stats.views, icon: Eye, color: 'text-accent', bg: 'bg-accent/10' }
  ];

  return (
    <div className="mb-12">
      {/* Header & Vercel Quick Link */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-4 px-1 gap-4">
        <h3 className="text-sm font-mono text-slate-400 uppercase tracking-[0.3em]">System_Metrics</h3>
        <a 
          href="https://vercel.com/dashboard" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center w-full sm:w-auto gap-2 text-xs font-bold font-mono text-accent bg-accent/10 hover:bg-accent/20 border border-accent/20 px-4 py-2.5 rounded-lg transition-all shadow-sm"
        >
          <BarChart2 size={16} /> ADVANCED_ANALYTICS <ExternalLink size={14} />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-[#0F172A] dark:bg-[#0F172A] border border-slate-200 dark:border-white/5 p-5 rounded-2xl group hover:border-accent/20 transition-all shadow-sm">
            <div className="flex justify-between items-start">
              <div >
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">{card.label}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white-900 dark:text-white tracking-tighter">
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
              <div className="h-1 flex-1 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${card.color.startsWith('text-accent') ? 'bg-accent' : 'bg-sky-400'} opacity-40 transition-all duration-1000`} 
                  style={{ width: loading ? '0%' : '100%' }}
                />
              </div>
              <Zap size={10} className="text-slate-700" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}