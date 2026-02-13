"use client";

import { useState, useEffect } from "react";
import { Power, Loader2, ShieldAlert, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function MaintenanceToggle() {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);

  // Fetch current status on load
  useEffect(() => {
    async function getStatus() {
      const { data, error } = await supabase
        .from("app_config")
        .select("is_active")
        .eq("key", "maintenance_mode")
        .single();

      if (!error && data) {
        setIsActive(data.is_active);
      }
      setLoading(false);
    }
    getStatus();
  }, []);

  const handleToggle = async () => {
    setUpdating(true);
    const newState = !isActive;

    const { error } = await supabase
      .from("app_config")
      .update({ is_active: newState })
      .eq("key", "maintenance_mode");

    if (!error) {
      setIsActive(newState);
    } else {
      alert("System Error: Could not update maintenance protocol.");
      console.error(error);
    }
    setUpdating(false);
  };

  if (loading) return <Loader2 className="animate-spin text-cyan-400" size={20} />;

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-slate-900/50">
      <div className={`p-2 rounded-lg ${isActive ? "bg-red-500/20 text-red-500" : "bg-green-500/20 text-green-500"}`}>
        {isActive ? <ShieldAlert size={20} /> : <ShieldCheck size={20} />}
      </div>

      <div className="flex-1">
        <h3 className="text-sm font-bold text-white uppercase tracking-tight">
          Maintenance_Mode
        </h3>
        <p className="text-[10px] text-slate-500 font-mono">
          STATUS: {isActive ? "RESTRICTED_ACCESS" : "PUBLIC_LIVE"}
        </p>
      </div>

      <button
        onClick={handleToggle}
        disabled={updating}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
          isActive ? "bg-red-600" : "bg-slate-700"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isActive ? "translate-x-6" : "translate-x-1"
          }`}
        />
        {updating && (
          <div className="absolute -right-6">
            <Loader2 className="animate-spin text-white" size={12} />
          </div>
        )}
      </button>
    </div>
  );
}