'use client';
import TechCard from './TechCard';
import { motion } from 'framer-motion';

const technologies = [
  { name: "Java", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg", tags: "JDK 21 / OOP", proficiency: 80, isMain: true },
  { name: "Spring Boot", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg", tags: "REST / JPA / Security", proficiency: 80, isMain: true },
  { name: "MySQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg", tags: "RDBMS / SQL / Indexing", proficiency: 80, isMain: true },
  { name: "Supabase", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg", tags: "Database / Auth", proficiency: 60, isMain: true },
  { name: "Next.js", icon: "https://cdn.simpleicons.org/nextdotjs/white", tags: "SSR / App Router", proficiency: 60, isMain: false },
  { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg", tags: "Type Safety", proficiency: 60, isMain: false },
  { name: "HTML5", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg", tags: "Structure", proficiency: 90, isMain: false },
  { name: "CSS3", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg", tags: "Flex / Grid", proficiency: 80, isMain: false },
  { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg", tags: "NoSQL / Aggregation", proficiency: 70, isMain: false },
  { name: "IntelliJ", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/intellij/intellij-original.svg", tags: "Java IDE", proficiency: 90, isMain: false },
  { name: "VS Code", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg", tags: "Code Editor", proficiency: 90, isMain: false }
];

const row1 = technologies.slice(0, 6);
const row2 = technologies.slice(6);

// Duplicate arrays multiple times to ensure enough width for seamless infinite scroll on wide screens
const duplicatedRow1 = [...row1, ...row1, ...row1, ...row1];
const duplicatedRow2 = [...row2, ...row2, ...row2, ...row2];

export default function TechStack() {
  return (
    <section id="stack" className="relative z-10 mx-auto max-w-7xl overflow-hidden px-6 py-14 md:px-10 md:py-16">
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scroll-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
          display: flex;
          width: max-content;
        }
        .animate-scroll-reverse {
          animation: scroll-reverse 40s linear infinite;
          display: flex;
          width: max-content;
        }
        .animate-scroll:hover, .animate-scroll-reverse:hover {
          animation-play-state: paused;
        }
      `}</style>
      <div className="mb-8 flex items-baseline justify-between border-b border-slate-200 pb-5 dark:border-white/10">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
          Tools I use <span className="text-accent">often.</span>
        </h2>
        <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Stack / 02</span>
      </div>
      
      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] flex flex-col gap-4 md:gap-8 py-4">
        <motion.div className="animate-scroll gap-4 md:gap-8">
          {duplicatedRow1.map((tech, index) => (
            <div key={index} className="w-36 md:w-48 shrink-0">
              <TechCard {...tech} />
            </div>
          ))}
        </motion.div>

        <motion.div className="animate-scroll-reverse gap-4 md:gap-8">
          {duplicatedRow2.map((tech, index) => (
            <div key={index} className="w-36 md:w-48 shrink-0">
              <TechCard {...tech} />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}