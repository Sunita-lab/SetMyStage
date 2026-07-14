import { useState, useEffect } from "react";
import { getEvents } from "../services/eventService";

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) return <p className="text-center mt-10 text-mist">Loading events...</p>;
  if (error) return <p className="text-center mt-10 text-danger">{error}</p>;

  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <h1 className="font-heading font-bold text-3xl text-ink mb-8">
        Discover Events
      </h1>

      {events.length === 0 ? (
        <p className="text-mist">No events found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-surface rounded-card shadow-md p-5 border border-border hover:shadow-lg transition"
            >
              <h2 className="font-heading font-semibold text-xl text-primary mb-2">
                {event.title}
              </h2>
              <p className="text-mist text-sm mb-3">{event.description}</p>
              <div className="flex justify-between items-center text-sm">
                <span className="text-ink">{event.location?.city}</span>
                <span className="bg-accent text-ink px-3 py-1 rounded-full text-xs font-semibold">
                  {event.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EventsPage;