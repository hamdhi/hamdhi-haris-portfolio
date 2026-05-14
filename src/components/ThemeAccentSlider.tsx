'use client';
import { useState, useEffect } from 'react';
import { Paintbrush, RotateCcw, Save, Loader2 } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';

const PRESETS = [
  { name: 'Default Blue', hue: 199 },
  { name: 'Emerald Green', hue: 150 },
  { name: 'Amethyst Purple', hue: 270 },
  { name: 'Rose Pink', hue: 330 },
  { name: 'Amber Yellow', hue: 45 },
  { name: 'Crimson Red', hue: 350 },
];

export default function ThemeAccentSlider() {
  const [hue, setHue] = useState<number>(199); // Default to Sky Blue
  const [saving, setSaving] = useState<boolean>(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    // Fetch active global hue from Supabase on mount
    const fetchGlobalHue = async () => {
      const { data } = await supabase
        .from('app_config')
        .select('value')
        .eq('key', 'accent_hue')
        .single();
      if (data?.value) {
        setHue(Number(data.value));
      }
    };
    fetchGlobalHue();
  }, []);

  const updateHue = (newHue: number) => {
    setHue(newHue);
    
    let styleEl = document.getElementById('dynamic-theme-accent');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'dynamic-theme-accent';
      document.head.appendChild(styleEl);
    }
    styleEl.innerHTML = `:root { --accent-hue: ${newHue}; --color-accent: hsl(${newHue}, 89%, 48%); --color-accent-light: hsl(${newHue}, 89%, 60%); --color-accent-dark: hsl(${newHue}, 89%, 30%); }`;
    window.dispatchEvent(new Event('theme-change')); // Keep telemetry synced while dragging
  };

  const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateHue(Number(e.target.value));
  };

  const saveTheme = async () => {
    setSaving(true);
    await supabase
      .from('app_config')
      .update({ value: hue.toString() })
      .eq('key', 'accent_hue');
    setSaving(false);
  };

  const resetToDefault = async () => {
    updateHue(270);
    setSaving(true);
    await supabase
      .from('app_config')
      .update({ value: '270' })
      .eq('key', 'accent_hue');
    setSaving(false);
  };

  return (
    <div className="p-6 bg-black dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl  w-full mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Paintbrush className="text-accent transition-colors" size={24} />
          <h2 className="text-xl font-bold text-white-900 dark:text-white tracking-tight">Theme Accent</h2>
        </div>
        <button 
          onClick={resetToDefault} 
          className="p-2 text-slate-500 hover:text-accent hover:bg-accent/10 rounded-full transition-all"
          title="Reset to Default"
        >
          <RotateCcw size={18} />
        </button>
      </div>
      
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="block text-xs font-mono text-slate-500 uppercase tracking-widest">
              Hue Control: {hue}°
            </label>
            <div 
              className="w-4 h-4 rounded-full border border-slate-200 dark:border-white/10 shadow-sm transition-colors" 
              style={{ backgroundColor: `hsl(${hue}, 89%, 48%)` }}
            />
          </div>
          <input 
            type="range" 
            min="0" 
            max="360" 
            value={hue}
            onChange={handleHueChange}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer 
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white 
            [&::-webkit-slider-thumb]:shadow-[0_0_10px_var(--color-accent)] [&::-webkit-slider-thumb]:transition-colors
            [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 
            [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-accent [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white 
            [&::-moz-range-thumb]:shadow-[0_0_10px_var(--color-accent)] [&::-moz-range-thumb]:transition-colors"
            style={{ background: `linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)` }}
          />
        </div>

        {/* Preset Colors */}
        <div className="pt-2 border-t border-slate-200 dark:border-white/10">
          <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-3">
            Quick Presets
          </label>
          <div className="flex justify-between gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => updateHue(preset.hue)}
                title={preset.name}
                className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                  hue === preset.hue 
                    ? 'border-white dark:border-slate-800 scale-110 shadow-[0_0_10px_var(--color-accent)]' 
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
                style={{ backgroundColor: `hsl(${preset.hue}, 89%, 48%)` }}
              />
            ))}
          </div>
        </div>

        <button 
          onClick={saveTheme}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-accent text-white font-bold rounded-xl hover:brightness-110 transition-all shadow-[0_0_15px_var(--color-accent)] hover:shadow-[0_0_25px_var(--color-accent)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
        >
          {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          {saving ? 'SAVING...' : 'SAVE CONFIGURATION'}
        </button>
      </div>
    </div>
  );
}