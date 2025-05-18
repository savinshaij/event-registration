// app/booking/[eventid]/page.js
import { fetchEvents } from "@/lib/firebase";

function formatDate(date) {
  if (!date) return "Date TBA";
  const parsed = new Date(date);
  return !isNaN(parsed)
    ? parsed.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Date TBA";
}

export async function generateStaticParams() {
  const events = await fetchEvents();
  return events.map(event => ({
    eventid: event.id,
  }));
}

export default async function BookingPage({ params }) {
  const { eventid } = params;
  const events = await fetchEvents();
  const event = events.find(ev => ev.id === eventid);

  if (!event) {
    // Next.js 13 app router way of handling not found
    return <p>Event not found</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <img
        src={event.image}
        alt={event.title}
        className="w-full h-80 object-cover rounded-xl mb-6"
      />
      <h1 className="text-4xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">{event.title}</h1>
      <p className="text-zinc-700 dark:text-zinc-300 mb-6">{event.description}</p>

      <div className="grid gap-2 text-zinc-500 dark:text-zinc-400 mb-6">
        <div>📍 <strong>{event.location}</strong></div>
        <div>🗓️ Start Date: {formatDate(event.startDate)}</div>
        <div>🗓️ End Date: {formatDate(event.endDate)}</div>
        <div>🎟️ Remaining Seats: {event.remainingSeats} / {event.totalSeats}</div>
      </div>

      <button className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-6 py-3 rounded-lg font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition">
        Book Now
      </button>
    </div>
  );
}
