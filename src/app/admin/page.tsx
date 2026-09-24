"use client";
import { LogOut, LayoutDashboard } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import MessageLogs from '@/components/MessageLogs';
import StatsOverview from '@/components/StatsOverview';
import ExperienceAdmin from '@/components/ExperienceAdmin';
import MaintenanceToggle from '@/components/MaintenanceToggle';

export default function AdminDashboard() {
    const router = useRouter();
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!, 
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/'); // Redirect to home or login after sign out
    };

    return (
        <main className="min-h-screen bg-[var(--background)] p-4 font-sans text-slate-900 dark:text-white md:p-8">
            <div className="mx-auto max-w-6xl space-y-8">
                
                {/* 1. Header & Logout */}
                <header className="flex flex-col items-start justify-between gap-6 border-b border-slate-200 pb-6 dark:border-white/10 md:flex-row md:items-center">
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <LayoutDashboard className="text-accent" size={28} /> 
                        <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-tighter">Admin_Panel</h1>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center w-full md:w-auto gap-4 md:gap-6">
                        <MaintenanceToggle/>
                        <button
                            onClick={handleLogout} 
                            className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-[var(--surface)] px-5 py-3 font-mono text-xs font-bold text-slate-600 shadow-sm transition-all hover:border-red-400 hover:bg-red-50 hover:text-red-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-red-500/20 dark:hover:text-white"
                        >
                            <LogOut size={16} /> LOGOUT
                        </button>
                    </div>
                </header>

                {/* 2. Stats Overview */}
                <StatsOverview />

                {/* 3. Unified Manager (Projects + Experience + Leadership) */}
                <ExperienceAdmin />

                {/* 4. Messages */}
                <MessageLogs />

            </div>
        </main>
    );
}