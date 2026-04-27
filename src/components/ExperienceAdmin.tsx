"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Trash2, Edit2, Plus, Save, X, Loader2, Briefcase, Trophy, Code, UploadCloud } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase"; 

// --- TYPES ---
interface BaseItem {
  id?: number;
}

interface ExpItem extends BaseItem {
  title: string;
  org: string;
  date: string;
  desc: string;
  image: string;
  tags: string[];
}

// --- INITIAL STATES ---
const initialExpState = { title: "", org: "", date: "", desc: "", image: "", tags: [] };
const initialProjectState = { projectName: "", description: "", learned: "", technologies: [], imageUrls: [], githubUrl: "", liveUrl: "" };

export default function ExperienceAdmin() {
  const router = useRouter();

  // --- AUTH STATE ---
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  // --- DATA STATES ---
  const [activeTab, setActiveTab] = useState<'experience' | 'leadership' | 'projects'>('experience');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  
  // --- FORM STATES ---
  const [formData, setFormData] = useState<any>(initialExpState);
  const [originalItem, setOriginalItem] = useState<any>(null);
  const [uploadFolder, setUploadFolder] = useState<string>("");
  const [tagInput, setTagInput] = useState("");
  const [imageInput, setImageInput] = useState(""); 

  const apiEndpoint = `/api/admin/${activeTab}`; 

  // 1. AUTHENTICATION CHECK
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.replace("/dev-login");
        } else {
          setIsAuthorized(true);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        router.replace("/dev-login");
      } finally {
        setAuthChecking(false);
      }
    };

    checkSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!session) router.replace("/dev-login");
    });

    return () => subscription.unsubscribe();
  }, [router]);

  // 2. FETCH DATA
  useEffect(() => {
    if (isAuthorized) {
      fetchItems();
      resetForm();
    }
  }, [activeTab, isAuthorized]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiEndpoint}?t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Failed to fetch items", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      
      setUploading(true);
      const files = Array.from(e.target.files); 
      const newUrls: string[] = [];

      const uploadPromises = files.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const folder = uploadFolder || `proj_${Date.now()}`;
        const filePath = `${activeTab}/${folder}/${fileName}`; 

        const { error: uploadError } = await supabase.storage
          .from('portfolio-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('portfolio-images')
          .getPublicUrl(filePath);

        return data.publicUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      newUrls.push(...uploadedUrls);

      if (activeTab === 'projects') {
        // Overwrite existing images instead of appending them
        const combinedImages = [...newUrls];
        
        setImageInput(combinedImages.join(', '));
        setFormData({ ...formData, imageUrls: combinedImages });
      } else {
        const firstUrl = newUrls[0];
        setFormData({ ...formData, image: firstUrl });
      }

    } catch (error: any) {
      console.error(error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
      e.target.value = ''; 
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // SECURED: Get token for server-side verification
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    let payload = { ...formData };

    if (activeTab === 'projects') {
      payload.technologies = tagInput.split(',').map(t => t.trim()).filter(t => t);
      payload.imageUrls = imageInput.split(',').map(t => t.trim()).filter(t => t);
    } else {
      payload.tags = tagInput.split(',').map(t => t.trim()).filter(t => t);
      payload.image = formData.image; 
    }

    try {
      const method = isEditing ? "PUT" : "POST";
      const res = await fetch(apiEndpoint, {
        method,
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // <--- Token sent here
        },
        body: JSON.stringify(payload),
      });
      
      if (!res.ok) throw new Error("Failed to save");

      // --- SMART CLEANUP: SYNC FOLDER CONTENTS WITH SAVED URLS ---
      // Guaranteed to delete orphaned images that pile up!
      try {
        if (uploadFolder && uploadFolder.startsWith('proj_')) {
          const folderPath = `${activeTab}/${uploadFolder}`;
          const { data: existingFiles } = await supabase.storage.from('portfolio-images').list(folderPath);

          if (existingFiles && existingFiles.length > 0) {
            // Get clean filenames that we actually want to keep
            const finalUrls = activeTab === 'projects' ? (payload.imageUrls || []) : (payload.image ? [payload.image] : []);
            const keptFilenames = finalUrls.map((url: string) => url.split('?')[0].split('/').pop());

            // Any file in the folder that isn't in our keep list gets purged
            const filesToDelete = existingFiles
              .filter(file => !keptFilenames.includes(file.name) && file.name !== '.emptyFolderPlaceholder')
              .map(file => `${folderPath}/${file.name}`);

            if (filesToDelete.length > 0) await supabase.storage.from('portfolio-images').remove(filesToDelete);
          }
        }
      } catch (err) {
        console.error("Storage sync error:", err);
      }

      resetForm();
      fetchItems();
    } catch (error) {
      console.error("Error saving:", error);
      alert("Failed to save item.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (item: any) => {
    if (!confirm("Delete this item? This cannot be undone.")) return;
    setLoading(true);

    // SECURED: Get token for server-side verification
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    try {
      const res = await fetch(apiEndpoint, {
        method: "DELETE",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // <--- Token sent here
        },
        body: JSON.stringify({ id: item.id }),
      });

      if (!res.ok) throw new Error("Failed to delete from DB");

      // --- COMPLETE FOLDER DELETION ---
      let folderName = null;
      const img = activeTab === 'projects' ? item.imageUrls?.[0] : item.image;
      if (img) {
         const match = img.match(new RegExp(`/${activeTab}/(proj_[^/]+)`));
         if (match) folderName = match[1];
      }

      if (folderName && folderName.startsWith('proj_')) {
        // If organized in a folder, delete absolutely everything inside it
        const folderPath = `${activeTab}/${folderName}`;
        const { data: files } = await supabase.storage.from('portfolio-images').list(folderPath);
        if (files && files.length > 0) {
           const pathsToDelete = files.map(f => `${folderPath}/${f.name}`);
           await supabase.storage.from('portfolio-images').remove(pathsToDelete);
        }
      } else {
        // Fallback for older items without folders
        const extractPath = (url: string) => {
          try {
            const parts = url.split('/portfolio-images/');
            return parts.length > 1 ? parts[1] : null;
          } catch { return null; }
        };
        const imagesToDelete: string[] = [];
        if (activeTab === 'projects') {
          if (Array.isArray(item.imageUrls)) item.imageUrls.forEach((url: string) => { const p = extractPath(url); if(p) imagesToDelete.push(p); });
        } else if (item.image) {
          const path = extractPath(item.image);
          if (path) imagesToDelete.push(path);
        }
        if (imagesToDelete.length > 0) await supabase.storage.from('portfolio-images').remove(imagesToDelete);
      }

      fetchItems();
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Error deleting item.");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (item: any) => {
    setIsEditing(item.id);
    setOriginalItem(item);
    setFormData(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Try to extract existing folder name, fallback to a new one
    let folder = `proj_${Date.now()}`;
    const img = activeTab === 'projects' ? item.imageUrls?.[0] : item.image;
    if (img) {
       const match = img.match(new RegExp(`/${activeTab}/(proj_[^/]+)`));
       if (match) folder = match[1];
    }
    setUploadFolder(folder);

    if (activeTab === 'projects') {
      setTagInput(item.technologies?.join(", ") || "");
      setImageInput(item.imageUrls?.join(", ") || "");
    } else {
      setTagInput(item.tags?.join(", ") || "");
    }
  };

  const resetForm = () => {
    setIsEditing(null);
    setOriginalItem(null);
    setFormData(activeTab === 'projects' ? initialProjectState : initialExpState);
    setTagInput("");
    setImageInput("");
    setUploadFolder(`proj_${Date.now()}`);
  };

  if (authChecking || !isAuthorized) {
    return (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-[#2F9A58]">
            <Loader2 className="animate-spin" size={48} />
            <p className="text-white font-mono text-sm uppercase tracking-widest animate-pulse">
                Verifying Security Credentials...
            </p>
        </div>
    );
  }

  return (
    <div className="w-full space-y-8 bg-green-950/50 rounded-xl p-6 border border-white/5">
      
      {/* TABS */}
      <div className="flex flex-col md:flex-row items-center justify-between border-b border-white/10 pb-6 gap-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Content Manager
            {loading && <Loader2 className="animate-spin text-[#2F9A58]" size={20} />}
        </h2>
        
        <div className="flex bg-green-950/50 p-1 rounded-lg border border-white/10">
            {['experience', 'leadership', 'projects'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium capitalize transition-all ${
                    activeTab === tab 
                    ? 'bg-[#2F9A58] text-white shadow-lg shadow-[#2F9A58]/20' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                 {tab === 'projects' ? <Code size={16}/> : tab === 'experience' ? <Briefcase size={16}/> : <Trophy size={16}/>} 
                 {tab}
              </button>
            ))}
        </div>
      </div>

      {/* FORM SECTION */}
      <motion.div layout className="bg-green-950/50 p-6 rounded-xl border border-white/10 shadow-xl">
        <h3 className="text-lg font-semibold text-[#2F9A58] mb-4 flex items-center gap-2">
          {isEditing ? <Edit2 size={18} /> : <Plus size={18} />}
          {isEditing ? `Edit ${activeTab}` : `Add New ${activeTab}`}
        </h3>

        <form onSubmit={handleSubmit} className="grid gap-4">
          
          {activeTab === 'projects' ? (
             <>
                <div className="grid md:grid-cols-2 gap-4">
                  <input name="projectName" placeholder="Project Name" value={formData.projectName} onChange={handleChange} required className="input-style" />
                  <input name="learned" placeholder="Key Learnings" value={formData.learned} onChange={handleChange} className="input-style" />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                   <input name="githubUrl" placeholder="GitHub URL" value={formData.githubUrl} onChange={handleChange} className="input-style" />
                   <input name="liveUrl" placeholder="Live Demo URL" value={formData.liveUrl} onChange={handleChange} className="input-style" />
                </div>
                <textarea name="description" placeholder="Project Description" value={formData.description} onChange={handleChange} rows={3} className="input-style" />
                
                <div>
                   <label className="text-xs text-slate-500 font-bold mb-1 block">Technologies (comma separated)</label>
                   <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="React, Node, SQL" className="input-style" />
                </div>

                <div>
                    <label className="text-xs text-slate-500 font-bold mb-1 block">Project Images (Multi-select supported)</label>
                    <div className="flex gap-2 mb-2">
                        <label className={`cursor-pointer flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded text-xs text-white transition-colors ${uploading ? 'opacity-50' : ''}`}>
                            <UploadCloud size={14} /> {uploading ? "Uploading..." : "Upload Images"}
                            <input 
                                type="file" 
                                accept="image/*" 
                                multiple 
                                onChange={handleImageUpload} 
                                disabled={uploading} 
                                className="hidden" 
                            />
                        </label>
                    </div>
                    <input 
                        value={imageInput} 
                        onChange={(e) => setImageInput(e.target.value)} 
                        placeholder="Image URLs (comma separated)" 
                        className="input-style text-xs font-mono" 
                    />
                </div>
             </>
          ) : (
             <>
                <div className="grid md:grid-cols-2 gap-4">
                  <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} required className="input-style" />
                  <input name="org" placeholder="Organization" value={formData.org} onChange={handleChange} required className="input-style" />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <input name="date" placeholder="Date (2023 - Present)" value={formData.date} onChange={handleChange} className="input-style" />
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                        <label className={`cursor-pointer flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded text-[10px] text-white transition-colors ${uploading ? 'opacity-50' : ''}`}>
                            <UploadCloud size={12} /> {uploading ? "Uploading..." : "Upload"}
                            <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="hidden" />
                        </label>
                    </div>
                    <input name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} className="input-style" />
                  </div>
                </div>
                <textarea name="desc" placeholder="Description" value={formData.desc} onChange={handleChange} rows={3} className="input-style" />
                <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="Tags (comma separated)" className="input-style" />
             </>
          )}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading || uploading} className="btn-primary">
              <Save size={18} /> {isEditing ? "Update" : "Save"}
            </button>
            {isEditing && (
              <button type="button" onClick={resetForm} className="btn-secondary">
                <X size={18} /> Cancel
              </button>
            )}
          </div>
        </form>
      </motion.div>

      {/* LIST SECTION */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white border-b border-white/10 pb-2 capitalize">
            {activeTab} List
        </h3>
        
        <div className="grid gap-4">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-between bg-slate-900/30 border border-white/5 p-4 rounded-lg items-center group"
              >
                <div className="flex items-center gap-4 overflow-hidden">
                   <div className="h-12 w-12 shrink-0 bg-slate-800 rounded overflow-hidden border border-white/10 relative">
                       {activeTab === 'projects' 
                          ? (item.imageUrls?.[0] ? <img src={item.imageUrls[0]} alt="prev" className="h-full w-full object-cover" /> : <div className="h-full w-full bg-slate-800" />)
                          : (item.image ? <img src={item.image} alt="prev" className="h-full w-full object-cover" /> : <div className="h-full w-full bg-slate-800" />)
                       }
                   </div>
                   <div className="min-w-0">
                      <h4 className="font-bold text-white truncate">{item.title || item.projectName}</h4>
                      <p className="text-xs text-slate-400 truncate max-w-md">{item.desc || item.description}</p>
                   </div>
                </div>

                <div className="flex gap-2 shrink-0 ml-4">
                  <button onClick={() => startEdit(item)} className="p-2 text-[#2F9A58] hover:bg-[#2F9A58]/10 rounded transition-colors"><Edit2 size={18} /></button>
                  <button onClick={() => handleDelete(item)} className="p-2 text-[#2F9A58]/80 hover:bg-[#2F9A58]/10 rounded transition-colors"><Trash2 size={18} /></button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {items.length === 0 && !loading && (
             <div className="text-center py-10 text-slate-500 italic border border-dashed border-white/10 rounded-lg">
                No items found in {activeTab}.
             </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .input-style { @apply w-full bg-slate-950 border border-white/10 rounded p-3 text-sm focus:border-[#2F9A58] outline-none transition-colors text-white placeholder:text-slate-600; }
        .btn-primary { @apply flex items-center gap-2 bg-[#2F9A58] hover:bg-[#247c46] text-white font-bold px-6 py-2.5 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed; }
        .btn-secondary { @apply flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-2.5 rounded transition-colors; }
      `}</style>
    </div>
  );
}