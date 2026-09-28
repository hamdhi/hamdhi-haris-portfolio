'use client';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EventCard from '@/components/EventCard';

interface GalleryEvent {
  id: number;
  title: string;
  date: string;
  location: string;
  images: string[];
  knowledge: string;
  sort_order?: number;
}

export default function GalleryPage() {
  const [events, setEvents] = useState<GalleryEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch('/api/admin/gallery');
        if (res.ok) {
          const data = await res.json();
          setEvents(Array.isArray(data) ? data.sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0)) : []);
        }
      } catch (error) {
        console.error("Failed to fetch gallery items", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

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

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-accent border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard key={event.id || event.title} {...event} />
            ))}
          </div>
        )}
      </section>

      <Footer name="Hamdhi Haris" version="1.0.02" />
    </main>
  );
}