import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getEventBySlug } from "../services/eventService";

function EventDetailPage() {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getEventBySlug(slug);
        setEvent(data);
      } catch (err) {
        setError("Event not found");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [slug]);

  if (loading) return <p className="text-center mt-10 text-mist">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-danger">{error}</p>;

  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="max-w-3xl mx-auto bg-surface rounded-card shadow-md p-8 border border-border">
        <span className="bg-accent text-ink px-3 py-1 rounded-full text-xs font-semibold">
          {event.category}
        </span>

        <h1 className="font-heading font-bold text-3xl text-primary mt-4 mb-2">
          {event.title}
        </h1>

        <p className="text-mist mb-6">{event.description}</p>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-mist">Start Date</p>
            <p className="text-ink font-medium">
              {new Date(event.startDate).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-mist">End Date</p>
            <p className="text-ink font-medium">
              {new Date(event.endDate).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-mist">Mode</p>
            <p className="text-ink font-medium capitalize">{event.mode}</p>
          </div>
          <div>
            <p className="text-mist">Capacity</p>
            <p className="text-ink font-medium">
              {event.registeredCount} / {event.capacity} registered
            </p>
          </div>
          {event.location?.venue && (
            <div className="col-span-2">
              <p className="text-mist">Location</p>
              <p className="text-ink font-medium">
                {event.location.venue}, {event.location.city}
              </p>
            </div>
          )}
        </div>

        <p className="text-mist text-sm mt-6">
          Organized by{" "}
          <span className="text-ink font-medium">{event.organizer?.name}</span>
        </p>

        <Link to="/" className="inline-block mt-6 text-primary font-semibold">
          ← Back to Events
        </Link>
      </div>
    </div>
  );
}

export default EventDetailPage;