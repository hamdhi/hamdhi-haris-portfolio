'use client';
import TechCard from './TechCard';
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 30, scale: 0.8 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 200, damping: 20 } }
};

export default function TechStack() {
  return (
    <section id="stack" className="relative z-10 max-w-7xl mx-auto px-6 py-32">
      <h2 className="text-4xl font-bold mb-16 text-center text-white">
        Tech <span className="text-[#2F9A58]">Arsenal</span>
      </h2>
      
      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8"
      >
        <motion.div variants={item}><TechCard name="Java" icon="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" tags="JDK 21 / OOP" proficiency={80} isMain={true} /></motion.div>
        <motion.div variants={item}><TechCard name="Spring Boot" icon="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg" tags="REST / JPA / Security" proficiency={80} isMain={true} /></motion.div>
        <motion.div variants={item}><TechCard name="MySQL" icon="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" tags="RDBMS / SQL / Indexing" proficiency={80} isMain={true} /></motion.div>
        <motion.div variants={item}><TechCard name="Supabase" icon="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg" tags="Database / Auth" proficiency={60} isMain={true} /></motion.div>
        <motion.div variants={item}><TechCard name="Next.js" icon="https://cdn.simpleicons.org/nextdotjs/white" tags="SSR / App Router" proficiency={60} isMain={false} /></motion.div>
        <motion.div variants={item}><TechCard name="TypeScript" icon="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" tags="Type Safety" proficiency={60} isMain={false} /></motion.div>
        <motion.div variants={item}><TechCard name="HTML5" icon="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" tags="Structure" proficiency={90} isMain={false} /></motion.div>
        <motion.div variants={item}><TechCard name="CSS3" icon="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" tags="Flex / Grid" proficiency={80} isMain={false} /></motion.div>
        <motion.div variants={item}><TechCard name="MongoDB" icon="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" tags="NoSQL / Aggregation" proficiency={70} isMain={false} /></motion.div>
        <motion.div variants={item}><TechCard name="IntelliJ" icon="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/intellij/intellij-original.svg" tags="Java IDE" proficiency={90} isMain={false} /></motion.div>
        <motion.div variants={item}><TechCard name="VS Code" icon="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" tags="Code Editor" proficiency={90} isMain={false} /></motion.div>
      </motion.div>
    </section>
  );
}