import { useRef, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation, Autoplay } from 'swiper/modules';

import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from '@/lib/firebase'; // adjust path as needed

export default function HeroSlider() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);

  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function fetchTrendingEvents() {
      // Query top 5 trending events ordered by createdAt descending
      // You can change orderBy field to 'popularity' or any other trending metric
      const q = query(collection(db, "events"), orderBy("createdAt", "desc"), limit(5));
      const snapshot = await getDocs(q);
      const fetchedEvents = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(fetchedEvents);
    }

    fetchTrendingEvents();
  }, []);

  useEffect(() => {
    if (
      swiperRef.current &&
      swiperRef.current.params &&
      prevRef.current &&
      nextRef.current
    ) {
      swiperRef.current.params.navigation.prevEl = prevRef.current;
      swiperRef.current.params.navigation.nextEl = nextRef.current;
      swiperRef.current.navigation.destroy();
      swiperRef.current.navigation.init();
      swiperRef.current.navigation.update();
    }
  }, [events]); // Re-run when events change

  if (events.length === 0) {
    return <div>Loading events...</div>;
  }
// Add this helper function to format Firestore Timestamp or fallback to a string
function formatDate(date) {
  if (!date) return 'Date TBA';

  
  if (typeof date.toDate === 'function') {
    return date.toDate().toLocaleString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

 
  const parsed = new Date(date);
  if (!isNaN(parsed)) {
    return parsed.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  return 'Date TBA';
}

  return (
    <div className="w-full relative bg-white dark:bg-zinc-900 transition-colors">
      <Swiper
        modules={[Navigation, Autoplay]}
        loop
        autoplay={{ delay: 5000 }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        className="h-[420px] sm:h-[500px] overflow-hidden"
      >
        {events.map((event, idx) => (
          <SwiperSlide key={event.id}>
            <div
              className="h-[420px] sm:h-[500px] bg-cover bg-center relative flex items-start justify-start"
              style={{ backgroundImage: `url(${event.image || '/default-event.jpg'})` }}
            >
              {/* Left mask overlay using Tailwind gradient */}
              <div className="absolute left-0 top-0 h-full w-[45%] z-10 pointer-events-none bg-gradient-to-r from-white via-white/80 to-white/0 dark:from-zinc-900 dark:via-zinc-900/80 dark:to-zinc-900/0" />

              {/* Top and bottom border fades */}
              <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-white/70 to-transparent dark:from-zinc-900/80" />
              <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-white/70 to-transparent dark:from-zinc-900/80" />

              {/* Slide Content */}
              <div className="relative z-30 p-4 sm:p-8 max-w-xs flex flex-col justify-end items-start h-full w-[30%] ml-7">
                <span className="text-lg sm:text-sm md:text-lg font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-300 mb-4">
                  # Tech Trending Event {idx + 1}
                </span>
                <h2 className="text-xl sm:text-xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
                  {event.title || 'Untitled Event'}
                </h2>
                <p className="text-md sm:text-md md:text-lg text-zinc-700 dark:text-zinc-200 mb-6 max-w-xs">
                  {event.description || 'No description available.'}
                </p>
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-lg sm:text-xl md:text-md text-zinc-500 dark:text-zinc-400">
                    Start: {formatDate(event.startDate)}
                  </span>
                </div>
                <a
                  href={event.link || '#'}
                  className="inline-block bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold px-3 py-3 rounded-xl shadow hover:bg-zinc-800 dark:hover:bg-zinc-100 transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book Now
                </a>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Nav Buttons */}
      <div className="absolute bottom-6 right-6 z-40 flex gap-3">
        <button
          ref={prevRef}
          className="w-12 h-12 flex items-center justify-center bg-zinc-900/80 dark:bg-white/80 hover:bg-accent text-white dark:text-zinc-900 text-2xl rounded-full shadow-lg transition border border-zinc-200 dark:border-zinc-700"
          aria-label="Previous"
        >
          ◀
        </button>
        <button
          ref={nextRef}
          className="w-12 h-12 flex items-center justify-center bg-zinc-900/80 dark:bg-white/80 hover:bg-accent text-white dark:text-zinc-900 text-2xl rounded-full shadow-lg transition border border-zinc-200 dark:border-zinc-700"
          aria-label="Next"
        >
          ▶
        </button>
      </div>
    </div>
  );
}
