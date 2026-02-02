'use client';
import { useState, useEffect } from 'react';
import { Upload, LayoutDashboard, LogOut, CheckCircle2, Trash2, AlertTriangle, Github, Globe } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import MessageLogs from '@/components/MessageLogs';

export default function AdminDashboard() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [projects, setProjects] = useState<any[]>([]);
    const [form, setForm] = useState({
        projectName: '', description: '', learned: '', technologies: '', githubUrl: '', liveUrl: ''
    });

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

    const router = useRouter();
    const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

    const loadProjects = async () => {
        const res = await fetch('/api/admin/get-projects');
        if (res.ok) setProjects(await res.json());
    };

    useEffect(() => { loadProjects(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        Object.entries(form).forEach(([key, val]) => {
            if (key === 'technologies') formData.append(key, JSON.stringify(val.split(',').map(t => t.trim())));
            else formData.append(key, val);
        });
        files.forEach(file => formData.append('images', file));

        const res = await fetch('/api/admin/save-project', { method: 'POST', body: formData });
        if (res.ok) {
            setSuccess(true);
            setTimeout(() => setSuccess(false), 2000);
            setForm({ projectName: '', description: '', learned: '', technologies: '', githubUrl: '', liveUrl: '' });
            setFiles([]);
            loadProjects();
        }
        setLoading(false);
    };

    const executeDelete = async () => {
        const res = await fetch('/api/admin/delete-project', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ projectName: projectToDelete }),
        });
        if (res.ok) {
            loadProjects();
            setShowDeleteModal(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#020617] text-white p-8 font-sans">
            <div className="max-w-5xl mx-auto">
                <header className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
                    <div className="flex items-center gap-3"><LayoutDashboard className="text-cyan-400" /> <h1 className="text-2xl font-bold uppercase">Admin_Panel</h1></div>
                    <button onClick={() => supabase.auth.signOut().then(() => router.push('/'))} className="text-xs font-mono text-slate-400 hover:text-red-400 transition-colors flex items-center gap-2"><LogOut size={16} /> LOGOUT</button>
                </header>

                <section className="mb-16">
                    <form onSubmit={handleSubmit} className="bg-[#0f172a] border border-cyan-500/20 rounded-2xl p-8 space-y-4 shadow-2xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input required value={form.projectName} placeholder="Project Name" className="bg-slate-900 border border-slate-800 p-3 rounded-lg outline-none focus:border-cyan-500" onChange={e => setForm({ ...form, projectName: e.target.value })} />
                            <input required value={form.technologies} placeholder="Tech (e.g. Java, React)" className="bg-slate-900 border border-slate-800 p-3 rounded-lg outline-none focus:border-cyan-500" onChange={e => setForm({ ...form, technologies: e.target.value })} />
                            <input value={form.githubUrl} placeholder="Github URL" className="bg-slate-900 border border-slate-800 p-3 rounded-lg outline-none focus:border-cyan-500" onChange={e => setForm({ ...form, githubUrl: e.target.value })} />
                            <input value={form.liveUrl} placeholder="Live URL" className="bg-slate-900 border border-slate-800 p-3 rounded-lg outline-none focus:border-cyan-500" onChange={e => setForm({ ...form, liveUrl: e.target.value })} />
                        </div>
                        <textarea required value={form.description} placeholder="Description" className="w-full bg-slate-900 border border-slate-800 p-3 rounded-lg h-20 outline-none" onChange={e => setForm({ ...form, description: e.target.value })} />
                        <textarea required value={form.learned} placeholder="Lessons Learned" className="w-full bg-slate-900 border border-slate-800 p-3 rounded-lg h-20 outline-none" onChange={e => setForm({ ...form, learned: e.target.value })} />
                        <div className="border-2 border-dashed border-slate-800 p-6 rounded-xl text-center relative hover:border-cyan-500/50 transition-colors">
                            <input type="file" multiple required className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setFiles(Array.from(e.target.files || []))} />
                            <Upload className="mx-auto text-slate-500 mb-1" size={20} />
                            <p className="text-xs text-slate-500">{files.length > 0 ? `${files.length} selected` : 'Select Screenshots'}</p>
                        </div>
                        <button type="submit" disabled={loading} className="w-full bg-cyan-600 hover:bg-cyan-500 py-4 rounded-xl font-bold uppercase tracking-widest transition-all">
                            {loading ? 'Syncing...' : success ? 'Deployed Successfully' : 'Sync_To_Portfolio'}
                        </button>
                    </form>
                </section>

                <section>
                    <div className="bg-[#0f172a] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                        <table className="w-full text-left">
                            <thead><tr className="bg-slate-900/50 border-b border-white/5 text-[10px] text-slate-400 font-mono"><th className="p-4">Project</th><th className="p-4">Links</th><th className="p-4 text-right">Actions</th></tr></thead>
                            <tbody className="divide-y divide-white/5">
                                {projects.map((proj, i) => (
                                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="p-4 font-bold text-cyan-400">{proj.projectName}</td>
                                        <td className="p-4 flex gap-3 text-slate-500">
                                            {proj.githubUrl && <Github size={14} />} {proj.liveUrl && <Globe size={14} />}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button onClick={() => { setProjectToDelete(proj.projectName); setShowDeleteModal(true) }} className="text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={18} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
            <MessageLogs />


            {showDeleteModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-[#0f172a] border border-red-500/30 p-8 rounded-2xl max-w-sm w-full shadow-2xl animate-in zoom-in-95">
                        <div className="flex flex-col items-center text-center">
                            <AlertTriangle className="text-red-500 mb-4" size={32} />
                            <h2 className="text-xl font-bold mb-2">Destroy Asset?</h2>
                            <p className="text-slate-400 text-sm mb-6">Permanently delete "{projectToDelete}"? This cannot be undone.</p>
                            <div className="flex gap-3 w-full font-mono text-xs">
                                <button onClick={() => setShowDeleteModal(false)} className="flex-1 bg-slate-800 py-3 rounded-lg">CANCEL</button>
                                <button onClick={executeDelete} className="flex-1 bg-red-600 py-3 rounded-lg font-bold">CONFIRM</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}