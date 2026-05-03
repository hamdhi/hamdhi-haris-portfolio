"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Trash2, Edit2, Plus, Save, X, Loader2, Briefcase, Trophy, Code, UploadCloud, GripVertical } from "lucide-react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
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
  sort_order?: number;
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
  const [orderChanged, setOrderChanged] = useState(false);

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
        // Sort items by sort_order
        setItems(Array.isArray(data) ? data.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)) : []);
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

  const handleReorder = (newOrder: any[]) => {
    setItems(newOrder);
    setOrderChanged(true);
  };

  const handleSaveOrder = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    
    try {
      await Promise.all(items.map((item, index) => {
        const payload = { ...item, sort_order: index };
        return fetch(apiEndpoint, {
          method: "PUT",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
      }));
      setOrderChanged(false);
      fetchItems();
    } catch (error) {
      console.error("Error saving order:", error);
      alert("Failed to save order.");
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
    <div className="w-full space-y-8 bg-[#041A0B] rounded-2xl p-4 md:p-8 border border-white/10 shadow-xl">
      
      {/* TABS */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between border-b border-white/10 pb-6 gap-5">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2 tracking-tight">
            Content Manager
            {loading && <Loader2 className="animate-spin text-[#2F9A58]" size={20} />}
        </h2>
        
        <div className="flex flex-wrap w-full lg:w-auto bg-[#020A05] p-1.5 rounded-xl border border-white/10 gap-1 shadow-inner">
            {['experience', 'leadership', 'projects'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold capitalize transition-all ${
                    activeTab === tab 
                    ? 'bg-[#2F9A58] text-white shadow-lg shadow-[#2F9A58]/20' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                 {tab === 'projects' ? <Code size={16}/> : tab === 'experience' ? <Briefcase size={16}/> : <Trophy size={16}/>} 
                 {tab}
              </button>
            ))}
        </div>
      </div>

      {/* FORM SECTION */}
      <motion.div layout className="bg-[#05150A] p-5 md:p-8 rounded-2xl border border-[#2F9A58]/20 shadow-2xl">
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
                   <label className="text-xs text-slate-400 font-bold mb-1.5 block uppercase tracking-wider">Technologies (comma separated)</label>
                   <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="React, Node, SQL" className="input-style" />
                </div>

                <div>
                    <label className="text-xs text-slate-400 font-bold mb-1.5 block uppercase tracking-wider">Project Images (Multi-select supported)</label>
                    <div className="flex mb-3">
                        <label className={`cursor-pointer flex justify-center items-center gap-2 bg-[#020A05] border border-slate-600 hover:border-[#2F9A58] hover:bg-slate-800 px-5 py-3 rounded-lg text-xs font-bold text-white transition-all w-full sm:w-auto shadow-sm ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            <UploadCloud size={16} /> {uploading ? "Uploading..." : "Upload Images"}
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
                        className="input-style text-xs font-mono opacity-70" 
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
                    <div className="flex mb-2 mt-1 md:mt-0">
                        <label className={`cursor-pointer flex justify-center items-center gap-2 bg-[#020A05] border border-slate-600 hover:border-[#2F9A58] hover:bg-slate-800 px-4 py-2.5 rounded-lg text-xs font-bold text-white transition-all w-full sm:w-auto shadow-sm ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            <UploadCloud size={16} /> {uploading ? "Uploading..." : "Upload Image"}
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

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/5 mt-2">
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/10 pb-4 gap-4">
          <h3 className="text-2xl font-bold text-white capitalize tracking-tight">
              {activeTab} List
          </h3>
          {orderChanged && (
            <button 
              onClick={handleSaveOrder}
              disabled={loading}
              className="flex items-center justify-center w-full sm:w-auto gap-2 bg-[#2F9A58] hover:bg-[#247c46] text-white px-4 py-2.5 rounded-lg text-sm font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-50 hover:-translate-y-0.5"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Save Order
            </button>
          )}
        </div>
        
        <div className="max-h-[60vh] overflow-y-auto overflow-x-hidden pr-2 list-container">
          <Reorder.Group axis="y" values={items} onReorder={handleReorder} className="flex flex-col gap-4">
            <AnimatePresence>
              {items.map((item) => (
                <Reorder.Item
                  key={item.id}
                  value={item}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col sm:flex-row justify-between bg-[#05150A] hover:bg-[#0A2210] border border-white/10 p-4 md:p-5 rounded-2xl sm:items-center group cursor-grab active:cursor-grabbing gap-4 sm:gap-6 shadow-sm hover:shadow-md transition-all overflow-hidden"
                >
                  <div className="flex items-center gap-3 md:gap-5 flex-1 min-w-0 pointer-events-none">
                     <div className="text-slate-500 hover:text-[#2F9A58] transition-colors pointer-events-auto shrink-0">
                        <GripVertical size={20} />
                     </div>
                     <div className="h-12 w-12 md:h-16 md:w-16 shrink-0 bg-slate-900 rounded-xl overflow-hidden border border-white/10 relative shadow-inner">
                         {activeTab === 'projects' 
                            ? (item.imageUrls?.[0] ? <img src={item.imageUrls[0]} alt="prev" className="h-full w-full object-cover" /> : <div className="h-full w-full bg-slate-800" />)
                            : (item.image ? <img src={item.image} alt="prev" className="h-full w-full object-cover" /> : <div className="h-full w-full bg-slate-800" />)
                         }
                     </div>
                     <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-white truncate text-base md:text-lg mb-0.5">{item.title || item.projectName}</h4>
                        <p className="text-xs md:text-sm text-slate-400 truncate">{item.desc || item.description}</p>
                     </div>
                  </div>

                  <div className="flex gap-2 shrink-0 justify-end pointer-events-auto pt-3 sm:pt-0 border-t border-white/5 sm:border-none mt-2 sm:mt-0 w-full sm:w-auto">
                    <button onPointerDown={(e) => e.stopPropagation()} onClick={() => startEdit(item)} className="flex-1 sm:flex-none flex justify-center items-center p-2.5 text-[#2F9A58] bg-[#2F9A58]/5 hover:bg-[#2F9A58]/20 rounded-lg transition-colors border border-[#2F9A58]/10 hover:border-[#2F9A58]/30"><Edit2 size={18} /></button>
                    <button onPointerDown={(e) => e.stopPropagation()} onClick={() => handleDelete(item)} className="flex-1 sm:flex-none flex justify-center items-center p-2.5 text-red-400 bg-red-400/5 hover:bg-red-500/20 hover:text-red-300 rounded-lg transition-colors border border-red-500/10 hover:border-red-500/30"><Trash2 size={18} /></button>
                  </div>
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>
          
          {items.length === 0 && !loading && (
             <div className="text-center py-10 text-slate-500 italic border border-dashed border-white/10 rounded-lg">
                No items found in {activeTab}.
             </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .input-style { @apply w-full bg-[#031007] border-2 border-slate-700/60 rounded-xl p-3.5 text-sm focus:border-[#2F9A58] focus:ring-4 focus:ring-[#2F9A58]/20 outline-none transition-all text-white placeholder:text-slate-500 shadow-inner hover:border-slate-500/80; }
        .btn-primary { @apply flex items-center justify-center flex-1 sm:flex-none gap-2 bg-[#2F9A58] hover:bg-[#247c46] text-white font-bold px-8 py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:-translate-y-0.5; }
        .btn-secondary { @apply flex items-center justify-center flex-1 sm:flex-none gap-2 bg-[#020A05] border border-slate-600 hover:border-slate-400 hover:bg-slate-800 text-white px-8 py-3.5 rounded-xl transition-all; }
        .list-container::-webkit-scrollbar { width: 6px; }
        .list-container::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); border-radius: 8px; }
        .list-container::-webkit-scrollbar-thumb { background: rgba(47, 154, 88, 0.3); border-radius: 8px; }
        .list-container::-webkit-scrollbar-thumb:hover { background: rgba(47, 154, 88, 0.5); }
      `}</style>
    </div>
  );
}