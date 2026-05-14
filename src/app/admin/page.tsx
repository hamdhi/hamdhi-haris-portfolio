"use client";
import { LogOut, LayoutDashboard } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import MessageLogs from '@/components/MessageLogs';
import StatsOverview from '@/components/StatsOverview';
import ExperienceAdmin from '@/components/ExperienceAdmin';
import MaintenanceToggle from '@/components/MaintenanceToggle';
import ThemeAccentSlider from '@/components/ThemeAccentSlider';

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
        /* Updated background to generic dark theme */
        <main className="min-h-screen bg-slate-950 text-white p-4 md:p-8 font-sans">
            <div className="max-w-5xl mx-auto space-y-12">
                
                {/* 1. Header & Logout */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/10 pb-6">
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <LayoutDashboard className="text-accent" size={28} /> 
                        <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-tighter">Admin_Panel</h1>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center w-full md:w-auto gap-4 md:gap-6">
                        <MaintenanceToggle/>
                        <button 
                            onClick={handleLogout} 
                            className="justify-center text-xs font-bold font-mono text-slate-300 hover:text-white flex items-center gap-2 transition-all bg-white/5 border border-white/10 hover:bg-red-500/20 hover:border-red-500/50 px-5 py-3 rounded-lg shadow-sm"
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

                {/*Accent Color Slider */}
                <ThemeAccentSlider />


            </div>
        </main>
    );
}