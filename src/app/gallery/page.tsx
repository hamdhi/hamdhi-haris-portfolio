import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
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
    <main className="relative min-h-screen bg-[var(--background)] text-slate-900 dark:text-white transition-colors duration-300">
      <Navbar />
      
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-20 pt-32 md:px-10">
        <div className="mb-10 flex items-end justify-between border-b border-slate-200 pb-5 dark:border-white/10">
          <div>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-accent">Field notes / 06</p>
            <h1 className="text-5xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-7xl">
              Moments from <span className="text-accent">the work.</span>
            </h1>
          </div>
          <p className="hidden max-w-xs text-right text-sm leading-5 text-slate-500 md:block">Meetups, workshops, and rooms where ideas became practical.</p>
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