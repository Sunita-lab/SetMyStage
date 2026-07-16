import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { getEvents } from "../services/eventService";

const CATEGORIES = ["All", "Concert", "Conference", "Workshop", "Meetup", "Sports", "Festival", "Other"];

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (err) {
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "All" || event.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [events, search, category]);

  if (loading) return <p className="text-center mt-10 text-mist">Loading events...</p>;
  if (error) return <p className="text-center mt-10 text-danger">{error}</p>;

  return (
    <div className="min-h-screen bg-background px-6 md:px-12 py-10">
      <h1 className="font-heading font-bold text-3xl md:text-4xl text-ink mb-8">
        Discover Events
      </h1>

      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-mist" size={18} />
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-border rounded-input pl-11 pr-4 py-3 text-ink bg-surface focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition ${
                category === cat
                  ? "bg-primary text-white"
                  : "bg-surface text-mist border border-border hover:border-secondary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-2">🎭</p>
          <p className="text-mist">The stage is waiting.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Link
              key={event._id}
              to={`/events/${event.slug}`}
              className="group bg-surface rounded-card overflow-hidden border border-border hover:border-secondary shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
            >
              {/* Banner / Gradient placeholder */}
              <div
                className="h-40 flex items-center justify-center relative"
                style={{
                  background: "linear-gradient(135deg, #312E81 0%, #6D28D9 100%)",
                }}
              >
                <span className="font-heading font-bold text-5xl text-white/30">
                  {event.category?.charAt(0)}
                </span>
                <span className="absolute top-3 right-3 bg-accent text-ink px-3 py-1 rounded-full text-xs font-semibold">
                  {event.category}
                </span>
              </div>

              <div className="p-5">
                <h2 className="font-heading font-semibold text-lg text-ink mb-1 group-hover:text-secondary transition">
                  {event.title}
                </h2>
                <p className="text-mist text-sm mb-3">
                  {new Date(event.startDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                  {event.location?.city && ` · ${event.location.city}`}
                </p>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-primary">
                    {event.isPaid ? `From ₹${event.price}` : "Free"}
                  </span>
                  <span className="text-xs text-mist">
                    {event.registeredCount}/{event.capacity} registered
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default EventsPage;