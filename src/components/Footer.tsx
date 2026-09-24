'use client';

interface FooterProps {
  name: string;
  version: string;
}

export default function Footer({ name, version }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 py-10 text-center border-t border-accent/10">
      <div className="absolute left-1/2 top-0 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

      <div className="flex flex-col gap-2">
        <p className="mono text-[10px] text-accent/80 tracking-widest uppercase">
          Build {version} // Designed & Engineered by <span className="text-slate-900 dark:text-white">{name}</span>
        </p>
        <p className="mono text-[8px] text-slate-500 uppercase tracking-tighter">
          © {currentYear} All Rights Reserved
        </p>
      </div>
    </footer>
  );
}