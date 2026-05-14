"use client";

import { useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";

export default function GlobalThemeSync() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const applyHue = (newHue: string) => {
      let styleEl = document.getElementById("dynamic-theme-accent");
      if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = "dynamic-theme-accent";
        document.head.appendChild(styleEl);
      }
      styleEl.innerHTML = `:root { --accent-hue: ${newHue}; --color-accent: hsl(${newHue}, 89%, 48%); --color-accent-light: hsl(${newHue}, 89%, 60%); --color-accent-dark: hsl(${newHue}, 89%, 30%); }`;
      
      // Save locally to prevent flash on future loads
      localStorage.setItem("accentHue", newHue); 
      // Dispatch event to update Telemetry graphs instantly
      window.dispatchEvent(new Event("theme-change"));
    };

    // 1. Fetch current global hue on mount
    supabase.from("app_config").select("value").eq("key", "accent_hue").single().then(({ data }) => {
      if (data?.value) applyHue(data.value);
    });

    // 2. Subscribe to live changes pushed by the Admin
    const channel = supabase.channel("theme_sync")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "app_config", filter: "key=eq.accent_hue" }, (payload) => {
        if (payload.new?.value) applyHue(payload.new.value);
      }).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [supabase]);

  return null;
}