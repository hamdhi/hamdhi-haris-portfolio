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

  // Changed Loader to accent color
  if (loading) return <Loader2 className="animate-spin text-accent" size={20} />;

  return (
    <div className="flex w-full items-center justify-between gap-4 rounded-xl border border-slate-200 bg-[var(--surface)] p-3 shadow-sm dark:border-white/10 dark:bg-white/5 md:p-4 sm:w-auto">
      <div className={`rounded-lg p-2 ${isActive ? "bg-accent/20 text-accent" : "bg-slate-200 text-slate-500 dark:bg-slate-800"}`}>
        {isActive ? <ShieldAlert size={18} /> : <ShieldCheck size={18} />}
      </div>

      <div className="flex-1 pr-4">
        <h3 className="truncate text-xs font-bold uppercase tracking-tight text-slate-900 dark:text-white md:text-sm">
          Maintenance_Mode
        </h3>
        <p className="text-[10px] text-slate-500 font-mono">
          STATUS: {isActive ? "RESTRICTED_ACCESS" : "PUBLIC_LIVE"}
        </p>
      </div>

      <button
        onClick={handleToggle}
        disabled={updating}
        aria-label="Toggle maintenance mode"
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
          isActive ? "bg-accent" : "bg-slate-300 dark:bg-slate-700"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isActive ? "translate-x-6" : "translate-x-1"
          }`}
        />
        {updating && (
          <div className="absolute -right-6">
            <Loader2 className="animate-spin text-accent" size={12} />
          </div>
        )}
      </button>
    </div>
  );
}