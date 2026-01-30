import Navbar from '@/components/Navbar';
import TechCard from '@/components/TechCard';
import SpiderBg from '@/components/SpiderBg';
import { getCvUrl } from '@/lib/supabase';
import ContactForm from '@/components/ContactForm';
import { Download, Terminal, FolderGit2 } from 'lucide-react';

export default function Home() {
  const cvLink = getCvUrl();

  return (
    <main className="relative min-h-screen bg-[#020617] text-white selection:bg-cyan-500/30">
      <SpiderBg />
      <Navbar />

     {/* Hero Section */}
<section id='home' className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
  
  {/* Left Column: Text (Added order-2 md:order-1 to keep text above photo on mobile) */}
  <div className="order-2 md:order-1 relative z-20 text-center md:text-left">
    <p className="mono text-cyan-400 mb-4 tracking-widest text-sm md:text-base">// BSC (Hons) in Software Engineering(Ug)</p>
    <h1 className="text-5xl md:text-8xl font-bold leading-[0.9] mb-8">
      Engineering <br /> 
      <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
        Digital Flow.
      </span>
    </h1>
    <p className="text-slate-400 text-lg max-w-lg mb-12 mx-auto md:mx-0">
      Software Engineer specializing in Java and Spring Boot.
      Experienced in building backend systems, RESTful APIs, and database-driven applications.
      Focused on writing clean, maintainable code and engineering reliable digital systems.
    </p>
    <div suppressHydrationWarning={true} className="flex justify-center md:justify-start gap-4">
      <a 
        href={cvLink} 
        download 
        className="flex items-center gap-2 bg-gradient-to-r from-cyan-400 to-purple-600 px-8 py-4 font-bold text-black rounded-sm hover:scale-105 transition shadow-[0_0_20px_rgba(6,182,212,0.3)]"
      >
        <Download size={18} /> DOWNLOAD_CV
      </a>
    </div>
  </div>

 {/* Right Column: Biometric Photo Frame (Tech-Lock Version) */}
<div className="order-1 md:order-2 flex justify-center items-center">
  <div className="relative p-1 bg-gradient-to-br from-cyan-400/20 to-purple-600/20 rounded-sm">
    
    {/* Animated Corner Brackets */}
    <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-cyan-400 animate-pulse z-30" />
    <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-purple-500 animate-pulse z-30" />
    <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-purple-500 animate-pulse z-30" />
    <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-cyan-400 animate-pulse z-30" />

    <div className="relative w-64 h-64 md:w-96 md:h-96 overflow-hidden bg-slate-900 shadow-2xl">
      {/* The Scan Animation */}
      <div className="absolute top-0 w-full h-0.5 bg-cyan-400 shadow-[0_0_15px_#00f2ff] animate-[scan_4s_linear_infinite] z-20" />

      {/* Static Image (No zoom, No gray) */}
      <img
        src="/portfolio-img.jpeg"
        alt="Profile"
        className="w-full h-full object-cover"
      />

      {/* Cyber Overlay (Subtle vignette to make the edges feel techie) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none z-10" />

      {/* Bottom Label Overlay */}
      <div className="absolute bottom-4 left-4 mono text-[10px] bg-black/80 p-2 backdrop-blur-md border border-cyan-400/50 z-20">
        <div className="flex items-center gap-2">
           <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
           <p className="text-cyan-400 font-bold uppercase tracking-widest">Target_Locked: Dev</p>
        </div>
      </div>
    </div>
  </div>
</div>

</section>

      {/* Tech Arsenal */}
      <section id="stack" className="relative z-10 max-w-7xl mx-auto px-6 py-32">
        <h2 className="text-4xl font-bold mb-16 text-center">Tech <span className="text-cyan-400">Arsenal</span></h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
        <TechCard name="Java" icon="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" tags="JDK 21 / OOP" proficiency={80} isMain={true} />
        <TechCard name="Spring Boot" icon="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg" tags="REST / JPA / Security" proficiency={80} isMain={true} />
        <TechCard name="MySQL" icon="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" tags="RDBMS / SQL / Indexing" proficiency={80} isMain={true} />
        <TechCard name="Supabase" icon="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg" tags="Database / Auth" proficiency={60} isMain={true} />
        <TechCard name="Next.js" icon="https://cdn.simpleicons.org/nextdotjs/white" tags="SSR / App Router" proficiency={60} isMain={false} />
        <TechCard name="TypeScript" icon="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" tags="Type Safety" proficiency={60} isMain={false} />
        <TechCard name="HTML5" icon="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" tags="Structure" proficiency={90} isMain={false} />
        <TechCard name="CSS3" icon="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" tags="Flex / Grid" proficiency={80} isMain={false} />
        <TechCard name="MongoDB" icon="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" tags="NoSQL / Aggregation" proficiency={70} isMain={false} />
        <TechCard name="IntelliJ" icon="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/intellij/intellij-original.svg" tags="Java IDE" proficiency={90} isMain={false} />
        <TechCard name="VS Code" icon="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" tags="Code Editor" proficiency={90} isMain={false} />
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="relative z-10 max-w-7xl mx-auto px-6 py-32">
        <div className="flex items-center gap-4 mb-20">
          <FolderGit2 className="text-cyan-400" />
          <h2 className="text-4xl font-bold uppercase tracking-tighter">Project_Vault</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-12">
            <div className="group border border-white/5 bg-white/5 p-8 rounded-2xl hover:bg-white/10 transition">
                <h3 className="text-3xl font-bold mb-4">OpenEdu</h3>
                <p className="text-slate-400 italic mb-6 leading-relaxed">Online tuition marketplace. Focused on mentor-student matchmaking and secure payment gateways.</p>
                <div className="flex gap-4 mono text-[10px] text-cyan-400">
                    <span>#JAVA_SPRING</span><span>#POSTGRESQL</span>
                </div>
            </div>
            {/* Add Auction System project here similarly */}
        </div>
      </section>


      {/* Final Contact Section */}
      <section id="contact" className="relative z-10 max-w-7xl mx-auto px-6 py-32 border-t border-white/5">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-5xl font-bold mb-6">Let's <span className="text-cyan-400">Initialize</span> <br /> a Connection.</h2>
            <p className="text-slate-400 mb-10 leading-relaxed text-lg italic">
              Currently available for intern software engineering opportunities. Open to discussing Java, .NET, or mobile development projects.
            </p>
            <div className="space-y-4 mono text-sm text-slate-500">
              <p>{`> Location: Sri Lanka`}</p>
              <p>{`> Email: dev.contact@example.com`}</p>
              <p>{`> Status: Ready to Scale`}</p>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>


      <footer className="relative z-10 py-10 text-center border-t border-white/5">
        <p className="mono text-[10px] text-white-600 tracking-widest uppercase">
          Build 1.0.00 // Designed by hamdhi haris
        </p>
      </footer>
    </main>
  );
}