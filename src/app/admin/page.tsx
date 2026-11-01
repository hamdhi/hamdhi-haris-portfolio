"use client";
import { LogOut, LayoutDashboard, UploadCloud, FileText, HeartPulse, CheckCircle2, Loader2, ExternalLink } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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

    const [cvUploading, setCvUploading] = useState(false);
    const [cvStatus, setCvStatus] = useState<string | null>(null);
    const [cvUrl, setCvUrl] = useState<string>('');

    const [pinging, setPinging] = useState(false);
    const [pingStatus, setPingStatus] = useState<string | null>(null);
    const [lastPingTime, setLastPingTime] = useState<string | null>(null);

    useEffect(() => {
        document.documentElement.classList.remove('dark');
        const { data } = supabase.storage.from('assets').getPublicUrl('Hamdhi Resume.pdf');
        setCvUrl(`${data.publicUrl}?t=${Date.now()}`);

        const savedPing = localStorage.getItem('supabase_last_keepalive');
        if (savedPing) setLastPingTime(savedPing);
    }, [supabase]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/'); // Redirect to home or login after sign out
    };

    const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
            alert('Please select a valid PDF file.');
            e.target.value = '';
            return;
        }

        setCvUploading(true);
        setCvStatus('Purging old CV files...');

        try {
            // 1. List all existing files in 'assets' bucket and delete old CVs so storage never fills up
            const { data: existingFiles, error: listError } = await supabase.storage
                .from('assets')
                .list('', { limit: 100 });

            if (!listError && existingFiles && existingFiles.length > 0) {
                const filesToRemove = existingFiles
                    .filter(f => f.name !== '.emptyFolderPlaceholder' && (f.name.toLowerCase().endsWith('.pdf') || f.name === 'Hamdhi Resume.pdf'))
                    .map(f => f.name);

                if (filesToRemove.length > 0) {
                    await supabase.storage.from('assets').remove(filesToRemove);
                }
            } else {
                // Fallback direct removal of Hamdhi Resume.pdf
                await supabase.storage.from('assets').remove(['Hamdhi Resume.pdf']);
            }

            setCvStatus('Uploading as "Hamdhi Resume.pdf"...');

            // 2. Rename file automatically to 'Hamdhi Resume.pdf' and upload with upsert
            const renamedFile = new File([file], 'Hamdhi Resume.pdf', { type: 'application/pdf' });
            const { error: uploadError } = await supabase.storage
                .from('assets')
                .upload('Hamdhi Resume.pdf', renamedFile, {
                    cacheControl: '0',
                    upsert: true,
                    contentType: 'application/pdf',
                });

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('assets').getPublicUrl('Hamdhi Resume.pdf');
            setCvUrl(`${data.publicUrl}?t=${Date.now()}`);
            setCvStatus('CV Replaced & Live!');
            setTimeout(() => setCvStatus(null), 4000);
        } catch (err: any) {
            console.error('CV Upload Error:', err);
            alert(`CV upload failed: ${err.message || 'Unknown error'}`);
            setCvStatus(null);
        } finally {
            setCvUploading(false);
            e.target.value = '';
        }
    };

    const handleKeepAliveTrick = async () => {
        setPinging(true);
        setPingStatus('Refreshing Auth & DB Heartbeat...');

        try {
            // 1. Force a Supabase Auth session & user metadata refresh (updates activity/login timestamp in auth.users)
            await supabase.auth.refreshSession();
            await supabase.auth.updateUser({
                data: { last_keepalive_ping: new Date().toISOString() }
            });

            // 2. Perform real database read + write + storage ping to reset Supabase's 7-day inactivity timer
            const { data: configData } = await supabase
                .from('app_config')
                .select('is_active')
                .eq('key', 'maintenance_mode')
                .maybeSingle();

            if (configData !== null && configData !== undefined) {
                await supabase
                    .from('app_config')
                    .update({ is_active: configData.is_active })
                    .eq('key', 'maintenance_mode');
            }

            await supabase.storage.from('assets').list('', { limit: 1 });

            const nowStr = new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
            localStorage.setItem('supabase_last_keepalive', nowStr);
            setLastPingTime(nowStr);
            setPingStatus('7-Day Timer Reset & Session Extended!');
            setTimeout(() => setPingStatus(null), 4000);
        } catch (err: any) {
            console.error('Keep-Alive Error:', err);
            alert(`Keep-alive ping failed: ${err.message || 'Unknown error'}`);
            setPingStatus(null);
        } finally {
            setPinging(false);
        }
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

                {/* 1.5 Quick Actions: CV Auto-Replacer & Supabase 7-Day Keep-Alive */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* CV Manager Card */}
                    <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-[var(--surface)] p-5 shadow-sm transition-all hover:border-accent/30 dark:border-white/10">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-accent/10 p-3 text-accent">
                                    <FileText size={22} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-tight text-slate-900 dark:text-white">
                                        CV_Auto_Replacer
                                    </h3>
                                    <p className="font-mono text-[11px] text-slate-500">
                                        Deletes old CV &rarr; Renames to <span className="text-accent font-semibold">Hamdhi Resume.pdf</span> &rarr; Uploads
                                    </p>
                                </div>
                            </div>
                            {cvUrl && (
                                <a
                                    href={cvUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="View Current Live CV"
                                    className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 font-mono text-[10px] font-bold text-slate-500 transition-colors hover:border-accent hover:text-accent dark:border-white/10"
                                >
                                    LIVE_CV <ExternalLink size={12} />
                                </a>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-white/5">
                            <div className="font-mono text-[11px] text-slate-500 flex items-center gap-1.5">
                                {cvStatus ? (
                                    <span className="flex items-center gap-1.5 text-accent font-bold">
                                        {cvUploading ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                                        {cvStatus}
                                    </span>
                                ) : (
                                    <span>BUCKET: assets / Hamdhi Resume.pdf</span>
                                )}
                            </div>

                            <label className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 font-mono text-xs font-bold text-white shadow-sm transition-all hover:brightness-110 active:scale-[0.98] ${cvUploading ? 'pointer-events-none opacity-60' : ''}`}>
                                {cvUploading ? <Loader2 size={15} className="animate-spin" /> : <UploadCloud size={15} />}
                                {cvUploading ? 'PROCESSING...' : 'UPLOAD NEW CV'}
                                <input
                                    type="file"
                                    accept=".pdf,application/pdf"
                                    onChange={handleCvUpload}
                                    disabled={cvUploading}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>

                    {/* Supabase 7-Day Health / Login Booster Card */}
                    <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-[var(--surface)] p-5 shadow-sm transition-all hover:border-accent/30 dark:border-white/10">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400">
                                    <HeartPulse size={22} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-tight text-slate-900 dark:text-white">
                                        Supabase_Keep_Alive
                                    </h3>
                                    <p className="font-mono text-[11px] text-slate-500">
                                        1-Click Auth Refresh + DB Write + Storage Ping to bypass 7-day pause
                                    </p>
                                </div>
                            </div>
                            <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                                HEALTHY
                            </span>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-white/5">
                            <div className="font-mono text-[11px] text-slate-500 flex items-center gap-1.5">
                                {pingStatus ? (
                                    <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                                        {pinging ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                                        {pingStatus}
                                    </span>
                                ) : (
                                    <span>LAST_BOOST: {lastPingTime || 'Ready to ping'}</span>
                                )}
                            </div>

                            <button
                                onClick={handleKeepAliveTrick}
                                disabled={pinging}
                                className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 font-mono text-xs font-bold text-emerald-700 transition-all hover:bg-emerald-500 hover:text-white active:scale-[0.98] disabled:opacity-60 dark:text-emerald-400 dark:hover:bg-emerald-500 dark:hover:text-white"
                            >
                                {pinging ? <Loader2 size={15} className="animate-spin" /> : <HeartPulse size={15} />}
                                {pinging ? 'BOOSTING...' : 'BOOST LOGIN / 7-DAY RESET'}
                            </button>
                        </div>
                    </div>
                </section>

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