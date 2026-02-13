import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SpiderBg from '@/components/SpiderBg';
import EventCard from '@/components/EventCard';

const EVENTS = [
  {
    title: "NSBM Hackathon 2025",
    date: "MARCH 2025",
    location: "NSBM Green University",
    images: ["/events/hack-1.jpg", "/events/hack-2.jpg", "/events/hack-3.jpg", "/events/hack-4.jpg"],
    knowledge: "Deepened my understanding of real-time collaboration using WebSockets and learned how to pitch technical solutions to a non-technical jury."
  },
  {
    title: "Java Dev Meetup",
    date: "JAN 2026",
    location: "Colombo, Sri Lanka",
    images: ["/events/meetup-1.jpg", "/events/meetup-2.jpg"],
    knowledge: "Gained insights into Java 21 Virtual Threads and how they optimize high-concurrency Spring Boot applications."
  }
];

export default function GalleryPage() {
  return (
    <main className="relative min-h-screen bg-[#020617] text-white">
      <SpiderBg />
      <Navbar />
      
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 uppercase tracking-tighter">
            Event_<span className="text-cyan-400">Archive</span>
          </h1>
          <p className="text-slate-400 mono text-sm lowercase max-w-xl">
            {`> Documentation of my participation in tech meetups, workshops, and competitive programming events.`}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {EVENTS.map((event, idx) => (
            <EventCard key={idx} {...event} />
          ))}
        </div>
      </section>

      <Footer name="Hamdhi Haris" version="1.0.02" />
    </main>
  );
}