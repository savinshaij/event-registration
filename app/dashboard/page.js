// pages/add-event.js
"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase"; // Firestore
import { collection, addDoc, serverTimestamp, getDocs, deleteDoc, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { storage as appwriteStorage, ID } from "@/lib/appwrite";

export default function AddEventPage() {
  // In useState initial form:
const [form, setForm] = useState({
  title: "",
  category: "",       // <-- added category here
  description: "",
  location: "",
  startDate: "",
  endDate: "",
  totalSeats: "",
  trending: "",
  image: null,
});


  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // Fetch events from Firestore
  useEffect(() => {
    async function fetchEvents() {
      const q = query(collection(db, "events"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      setEvents(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    }
    fetchEvents();
  }, [refresh]);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      await deleteDoc(doc(db, "events", id));
      setRefresh((r) => !r);
    }
  };

  const handleTrending = async (id, trending) => {
    if (!trending) {
      // Ask for trending number
      const trendingNumber = prompt("Enter trending number (e.g. 1, 2, 3):");
      if (!trendingNumber || isNaN(trendingNumber)) return;
      await updateDoc(doc(db, "events", id), { trending: parseInt(trendingNumber) });
    } else {
      await updateDoc(doc(db, "events", id), { trending: 0 });
    }
    setRefresh((r) => !r);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = "";

      if (form.image) {
        const uploadedFile = await appwriteStorage.createFile(
          process.env.NEXT_PUBLIC_APPWRITE_BUCKET,
          ID.unique(),
          form.image
        );

        imageUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET}/files/${uploadedFile.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`;
      }

      await addDoc(collection(db, "events"), {
        title: form.title,
        description: form.description,
        location: form.location,
        startDate: form.startDate,
        endDate: form.endDate,
        totalSeats: parseInt(form.totalSeats),
        remainingSeats: parseInt(form.totalSeats),
        trending: parseInt(form.trending) || 0,
        image: imageUrl,
        createdAt: serverTimestamp(),
      });

      alert("Event added successfully!");
      setForm({
        title: "",
        description: "",
        location: "",
        startDate: "",
        endDate: "",
        totalSeats: "",
        trending: "",
        image: null,
      });
      setRefresh((r) => !r);
    } catch (error) {
      console.error("Error adding event:", error);
      alert("Failed to add event.");
    } finally {
      setLoading(false);
    }
  };

  // Filter events by search
  const filteredEvents = events.filter(
    (event) =>
      event.title?.toLowerCase().includes(search.toLowerCase()) ||
      event.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-start justify-center bg-gray-100 dark:bg-zinc-900 py-10 px-2 gap-8 transition-colors">
      {/* Left: Event List */}
      <div className="w-full md:w-1/2 bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-6 border border-gray-300 dark:border-zinc-700">
        {/* Search Bar */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Search events..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-1 border border-gray-300 dark:border-zinc-700 px-4 py-2 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-zinc-700"
          />
          <button
            className="px-5 py-2 bg-black dark:bg-zinc-200 text-white dark:text-black rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-zinc-100 transition"
            onClick={() => setSearch(searchInput)}
          >
            Search
          </button>
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center text-zinc-900 dark:text-white">Events</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto pr-2">
          {filteredEvents.length === 0 && (
            <div className="text-gray-400 dark:text-zinc-500 text-center col-span-full">No events found.</div>
          )}
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="border border-gray-300 dark:border-zinc-700 rounded-xl p-4 flex flex-col gap-2 bg-gray-50 dark:bg-zinc-900 shadow-sm"
            >
              <div className="font-semibold text-lg truncate text-zinc-900 dark:text-zinc-100">{event.title}</div>
              <div className="text-xs text-gray-600 dark:text-zinc-400 truncate">{event.location}</div>
              <div className="text-xs text-gray-600 dark:text-zinc-400">
                {event.startDate} - {event.endDate}
              </div>
              <div className="flex items-center gap-2 flex-wrap mt-2">
                <span className={`text-xs px-2 py-1 rounded-full ${event.trending && event.trending > 0 ? "bg-yellow-200 text-yellow-800 dark:bg-yellow-300 dark:text-yellow-900" : "bg-gray-200 text-gray-600 dark:bg-zinc-700 dark:text-zinc-200"}`}>
                  {event.trending && event.trending > 0 ? `Trending #${event.trending}` : "Not Trending"}
                </span>
                <button
                  className={`text-xs px-3 py-1 rounded border border-gray-300 dark:border-zinc-700 font-medium transition ${
                    event.trending && event.trending > 0
                      ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-200 dark:text-yellow-900 dark:hover:bg-yellow-300"
                      : "bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
                  }`}
                  onClick={() => handleTrending(event.id, event.trending)}
                  title={event.trending && event.trending > 0 ? "Remove Trending" : "Add Trending"}
                >
                  {event.trending && event.trending > 0 ? "Remove Trending" : "Add Trending"}
                </button>
                <button
                  className="ml-auto text-xs px-3 py-1 rounded border border-gray-300 dark:border-zinc-700 bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-200 hover:bg-red-100 dark:hover:bg-red-800 font-medium transition"
                  onClick={() => handleDelete(event.id)}
                  title="Delete"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Right: Event Form */}
      <div className="w-full md:w-1/2 max-w-md bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-8 border border-gray-300 dark:border-zinc-700 mx-auto mt-8 md:mt-0">
        <h1 className="text-2xl font-semibold mb-2 text-zinc-900 dark:text-white text-center">Add New Event</h1>
        <h2 className="text-sm font-semibold mb-6 text-gray-600 dark:text-zinc-400 text-center">
          Fill out the form to register your event
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
         <div className="flex gap-4">
  <div className="flex-1">
    <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-300 mb-1">Event Title</label>
    <input
      type="text"
      name="title"
      placeholder="Event Title"
      required
      value={form.title}
      onChange={handleChange}
      className="w-full border border-gray-300 dark:border-zinc-700 px-4 py-2 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-zinc-700"
    />
  </div>
 <div className="flex-1">
  <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-300 mb-1">Category</label>
  <select
    name="category"
    required
    value={form.category}
    onChange={handleChange}
    className="w-full border border-gray-300 dark:border-zinc-700 px-4 py-2 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-zinc-700"
  >
    <option value="" disabled>
      Select category
    </option>
    <option value="music">Music</option>
    <option value="tech">Tech</option>
    <option value="art">Art</option>
    <option value="other">Other</option>
  </select>
</div>

</div>
          <div>
            <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-300 mb-1">Description</label>
            <textarea
              name="description"
              placeholder="Description"
              required
              value={form.description}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-zinc-700 px-4 py-2 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-zinc-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-300 mb-1">Location</label>
            <input
              type="text"
              name="location"
              placeholder="Location"
              required
              value={form.location}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-zinc-700 px-4 py-2 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-zinc-700"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-300 mb-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                required
                value={form.startDate}
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-zinc-700 px-4 py-2 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-zinc-700"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-300 mb-1">End Date</label>
              <input
                type="date"
                name="endDate"
                required
                value={form.endDate}
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-zinc-700 px-4 py-2 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-zinc-700"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-300 mb-1">Total Seats</label>
              <input
                type="number"
                name="totalSeats"
                placeholder="Total Seats"
                required
                value={form.totalSeats}
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-zinc-700 px-4 py-2 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-zinc-700"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-300 mb-1">Trending (number)</label>
              <input
                type="number"
                name="trending"
                placeholder="Trending (number)"
                value={form.trending}
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-zinc-700 px-4 py-2 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-zinc-700"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-300 mb-1">Event Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-zinc-700 px-4 py-2 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-zinc-700"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black dark:bg-zinc-200 text-white dark:text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-zinc-100 transition disabled:bg-gray-400 dark:disabled:bg-zinc-700"
          >
            {loading ? "Submitting..." : "Add Event"}
          </button>
        </form>
      </div>
    </div>
  );
}
