'use client';
import TechCard from './TechCard';

export default function TechStack() {
  return (
    <section id="stack" className="relative z-10 max-w-7xl mx-auto px-6 py-32">
      <h2 className="text-4xl font-bold mb-16 text-center">
        Tech <span className="text-cyan-400">Arsenal</span>
      </h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
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
  );
}