"use client";
import { useState, useEffect } from 'react';
import { Upload, LayoutDashboard, LogOut, Trash2, AlertTriangle, Github, Globe, Pencil, X } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import MessageLogs from '@/components/MessageLogs';
import StatsOverview from '@/components/StatsOverview';

export default function AdminDashboard() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [projects, setProjects] = useState<any[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    
    const [form, setForm] = useState({
        projectName: '', description: '', learned: '', technologies: '', githubUrl: '', liveUrl: ''
    });

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

    const router = useRouter();
    const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

    // Load projects with a timestamp to bypass browser cache
    const loadProjects = async () => {
        try {
            const res = await fetch(`/api/admin/get-projects?t=${Date.now()}`, { 
                cache: 'no-store' 
            });
            if (res.ok) {
                const data = await res.json();
                setProjects(data);
            }
        } catch (error) {
            console.error("Failed to load projects", error);
        }
    };

    useEffect(() => { loadProjects(); }, []);

    const handleEdit = (proj: any) => {
        setIsEditing(true);
        setForm({
            projectName: proj.projectName,
            description: proj.description,
            learned: proj.learned,
            technologies: proj.technologies.join(', '),
            githubUrl: proj.githubUrl || '',
            liveUrl: proj.liveUrl || ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setIsEditing(false);
        setForm({ projectName: '', description: '', learned: '', technologies: '', githubUrl: '', liveUrl: '' });
        setFiles([]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        
        Object.entries(form).forEach(([key, val]) => {
            if (key === 'technologies') formData.append(key, JSON.stringify(val.split(',').map(t => t.trim())));
            else formData.append(key, val);
        });
        
        files.forEach(file => formData.append('images', file));

        const endpoint = isEditing ? '/api/admin/update-project' : '/api/admin/save-project';
        const res = await fetch(endpoint, { method: 'POST', body: formData });

        if (res.ok) {
            setSuccess(true);
            resetForm();
            // This line triggers the "Auto-Refresh" by re-fetching the updated list
            await loadProjects(); 
            setTimeout(() => setSuccess(false), 2000);
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
            await loadProjects();
            setShowDeleteModal(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#020617] text-white p-8 font-sans">
            <div className="max-w-5xl mx-auto">
                <header className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
                    <div className="flex items-center gap-3">
                        <LayoutDashboard className="text-cyan-400" /> 
                        <h1 className="text-2xl font-bold uppercase tracking-tighter">Admin_Panel</h1>
                    </div>
                    <button onClick={() => supabase.auth.signOut().then(() => router.push('/'))} className="text-xs font-mono text-slate-400 hover:text-red-400 flex items-center gap-2">
                        <LogOut size={16} /> LOGOUT
                    </button>
                </header>

                <StatsOverview />

                <section className="mb-16">
                    <form onSubmit={handleSubmit} className={`bg-[#0f172a] border ${isEditing ? 'border-yellow-500/40' : 'border-cyan-500/20'} rounded-2xl p-8 space-y-4 shadow-2xl`}>
                        <div className="flex justify-between items-center">
                            <h2 className="text-xs font-mono text-slate-500">{isEditing ? '// UPDATE_MODE' : '// CREATE_MODE'}</h2>
                            {isEditing && <button type="button" onClick={resetForm} className="text-slate-400 hover:text-white transition-colors"><X size={18}/></button>}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input required value={form.projectName} readOnly={isEditing} placeholder="Project Name" className={`bg-slate-900 border border-slate-800 p-3 rounded-lg outline-none focus:border-cyan-500 ${isEditing ? 'opacity-50 cursor-not-allowed' : ''}`} onChange={e => setForm({ ...form, projectName: e.target.value })} />
                            <input required value={form.technologies} placeholder="Tech (e.g. React, Next.js)" className="bg-slate-900 border border-slate-800 p-3 rounded-lg outline-none focus:border-cyan-500" onChange={e => setForm({ ...form, technologies: e.target.value })} />
                            <input value={form.githubUrl} placeholder="Github URL" className="bg-slate-900 border border-slate-800 p-3 rounded-lg outline-none focus:border-cyan-500" onChange={e => setForm({ ...form, githubUrl: e.target.value })} />
                            <input value={form.liveUrl} placeholder="Live URL" className="bg-slate-900 border border-slate-800 p-3 rounded-lg outline-none focus:border-cyan-500" onChange={e => setForm({ ...form, liveUrl: e.target.value })} />
                        </div>
                        <textarea required value={form.description} placeholder="Description" className="w-full bg-slate-900 border border-slate-800 p-3 rounded-lg h-20 outline-none focus:border-cyan-500" onChange={e => setForm({ ...form, description: e.target.value })} />
                        <textarea required value={form.learned} placeholder="Key Takeaways" className="w-full bg-slate-900 border border-slate-800 p-3 rounded-lg h-20 outline-none focus:border-cyan-500" onChange={e => setForm({ ...form, learned: e.target.value })} />
                        
                        <div className="border-2 border-dashed border-slate-800 p-6 rounded-xl text-center relative hover:border-cyan-500/50 transition-all">
                            <input type="file" multiple required={!isEditing} className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setFiles(Array.from(e.target.files || []))} />
                            <Upload className="mx-auto text-slate-500 mb-2" size={24} />
                            <p className="text-xs text-slate-500">
                                {files.length > 0 ? `${files.length} selected` : isEditing ? 'Keep existing or upload NEW images' : 'Upload Project Screenshots'}
                            </p>
                        </div>

                        <button type="submit" disabled={loading} className={`w-full ${isEditing ? 'bg-yellow-600 hover:bg-yellow-500' : 'bg-cyan-600 hover:bg-cyan-500'} py-4 rounded-xl font-bold uppercase tracking-widest transition-all shadow-lg`}>
                            {loading ? 'Processing...' : success ? 'System Updated' : isEditing ? 'Confirm_Changes' : 'Sync_Project'}
                        </button>
                    </form>
                </section>

                <section>
                    <div className="bg-[#0f172a] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                        <table className="w-full text-left">
                            <thead className="bg-slate-900/50 text-[10px] text-slate-500 font-mono border-b border-white/5 uppercase">
                                <tr><th className="p-4">Project</th><th className="p-4">Tech</th><th className="p-4 text-right">Actions</th></tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {projects.map((proj, i) => (
                                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="p-4 font-bold text-cyan-400">{proj.projectName}</td>
                                        <td className="p-4 text-xs text-slate-400">{proj.technologies.slice(0, 3).join(', ')}</td>
                                        <td className="p-4 text-right space-x-4">
                                            <button onClick={() => handleEdit(proj)} className="text-slate-500 hover:text-yellow-400"><Pencil size={18} /></button>
                                            <button onClick={() => { setProjectToDelete(proj.projectName); setShowDeleteModal(true) }} className="text-slate-500 hover:text-red-400"><Trash2 size={18} /></button>
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
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#0f172a] border border-red-500/30 p-8 rounded-2xl max-w-sm w-full text-center">
                        <AlertTriangle className="text-red-500 mx-auto mb-4" size={40} />
                        <h2 className="text-xl font-bold mb-2">Delete Project?</h2>
                        <p className="text-slate-400 text-sm mb-6">"{projectToDelete}" will be permanently removed.</p>
                        <div className="flex gap-3 font-mono text-xs">
                            <button onClick={() => setShowDeleteModal(false)} className="flex-1 bg-slate-800 py-3 rounded-lg hover:bg-slate-700">CANCEL</button>
                            <button onClick={executeDelete} className="flex-1 bg-red-600 py-3 rounded-lg font-bold hover:bg-red-500">DELETE</button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}