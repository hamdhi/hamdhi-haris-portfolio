'use client';

interface FooterProps {
  name: string;
  version: string;
}

export default function Footer({ name, version }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 py-10 text-center border-t border-white/5">
      <div className="flex flex-col gap-2">
        <p className="mono text-[10px] text-slate-500 tracking-widest uppercase">
          Build {version} // Designed & Engineered by {name}
        </p>
        <p className="mono text-[8px] text-slate-600 uppercase tracking-tighter">
          © {currentYear} All Rights Reserved
        </p>
      </div>
    </footer>
  );
}