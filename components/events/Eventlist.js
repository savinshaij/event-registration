"use client";

import React, { useState, useEffect } from "react";
import { fetchEvents } from "@/lib/firebase";
import { useRouter } from "next/navigation"; // ✅ App Router version

function EventList() {
  const router = useRouter(); // ✅ Works in client components only

  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetchEvents()
      .then(setEvents)
      .catch((err) => console.error("Failed to fetch events", err));
  }, []);

  const filteredEvents = events.filter((event) => {
    const title = event.title?.toLowerCase() || "";
    const lowerSearchTerm = searchTerm.toLowerCase();
    const categoryMatch =
      selectedCategory === "All" ||
      title.includes(selectedCategory.toLowerCase());
    return title.includes(lowerSearchTerm) && categoryMatch;
  });

  function formatDate(date) {
    if (!date) return "TBA";
    const d = typeof date.toDate === "function" ? date.toDate() : new Date(date);
    return d.toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-4 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          className="flex-1 px-4 py-2 border rounded"
          placeholder="Search events"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="px-4 py-2 border rounded"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option>All</option>
          <option>Music</option>
          <option>Tech</option>
          <option>Art</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="border rounded-xl p-4 shadow hover:shadow-lg transition"
          >
            <img
              src={event.image || "/fallback.png"}
              alt={event.title}
              className="w-full h-40 object-cover rounded-md mb-3"
            />
            <h2 className="text-xl font-semibold mb-1">{event.title}</h2>
            <p className="text-sm mb-2">{event.description}</p>
            <div className="text-sm text-gray-500 mb-1">
              📍 {event.location}
            </div>
            <div className="text-sm text-gray-500">
              🗓️ {formatDate(event.startDate)}
            </div>
            <button
              className="mt-3 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
              onClick={() => router.push(`/booking/${event.id}`)}
            >
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EventList;
