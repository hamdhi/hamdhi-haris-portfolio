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
        <main className="min-h-screen bg-[#020617] text-white p-8 font-sans">
            <div className="max-w-5xl mx-auto space-y-12">
                
                {/* 1. Header & Logout */}
                <header className="flex justify-between items-center border-b border-white/10 pb-6">
                    <div className="flex items-center gap-3">
                        <LayoutDashboard className="text-cyan-400" /> 
                        <h1 className="text-2xl font-bold uppercase tracking-tighter">Admin_Panel</h1>
                    </div>
                     <div>
                            <MaintenanceToggle/>
                    </div>
                    <button 
                        onClick={handleLogout} 
                        className="text-xs font-mono text-slate-400 hover:text-red-400 flex items-center gap-2 transition-colors"
                    >
                        <LogOut size={16} /> LOGOUT
                       
                    </button>
                </header>

                {/* 2. Stats Overview */}
                <StatsOverview />

                {/* 3. Unified Manager (Projects + Experience + Leadership) */}
                {/* This component now handles EVERYTHING you deleted from this file */}
                <ExperienceAdmin />

                {/* 4. Messages */}
                <MessageLogs />

            </div>
        </main>
    );
}