'use client';
import { FolderGit2 } from 'lucide-react';
import ProjectCard from './ProjectCard';


export default function Projects() {
  return (
    <section id="projects" className="relative z-10 max-w-7xl mx-auto px-6 py-32">
      <div className="flex items-center gap-4 mb-20">
        <FolderGit2 className="text-cyan-400" />
        <h2 className="text-4xl font-bold uppercase tracking-tighter">Project_Vault</h2>
      </div>
      <div className="grid md:grid-cols-2 gap-12">

        <ProjectCard projectName="Bidify The Auction Management System" description="Online tuition marketplace focusing on mentor matchmaking and secure payments." learned="Mastered Java Spring Boot layered architecture and handled complex PostgreSQL relational mapping for tutor schedules." technologies={["Java", "Spring", "PostgreSQL"]} imageUrls={["/projects/AuctionManagementSystem/1.png", "/projects/AuctionManagementSystem/2.png"]} githubUrl="https://github.com/..." />
        <ProjectCard projectName="Bidify The Auction Management System" description="Online tuition marketplace focusing on mentor matchmaking and secure payments." learned="Mastered Java Spring Boot layered architecture and handled complex PostgreSQL relational mapping for tutor schedules." technologies={["Java", "Spring", "PostgreSQL"]} imageUrls={["/projects/AuctionManagementSystem/1.png", "/projects/AuctionManagementSystem/2.png"]} githubUrl="https://github.com/..." />

      </div>
    </section>
  );
}