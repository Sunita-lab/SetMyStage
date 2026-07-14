import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../services/eventService";

function CreateEventPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Concert",
    startDate: "",
    endDate: "",
    mode: "offline",
    capacity: "",
    location: {
      venue: "",
      city: "",
      state: "",
      country: "India",
    },
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Agar field location ke andar hai (jaise "location.city"), usko alag handle karo
    if (name.startsWith("location.")) {
      const locationField = name.split(".")[1];
      setFormData({
        ...formData,
        location: { ...formData.location, [locationField]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const event = await createEvent({
        ...formData,
        capacity: Number(formData.capacity),
      });
      navigate(`/events/${event.slug}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="max-w-2xl mx-auto bg-surface rounded-card shadow-md p-8 border border-border">
        <h1 className="font-heading font-bold text-2xl text-primary mb-6">
          Create New Event
        </h1>

        {error && <p className="text-danger text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Event Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border border-border rounded-input px-4 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-secondary"
          />

          <textarea
            name="description"
            placeholder="Event Description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full border border-border rounded-input px-4 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-secondary"
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border border-border rounded-input px-4 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-secondary"
          >
            <option value="Concert">Concert</option>
            <option value="Conference">Conference</option>
            <option value="Workshop">Workshop</option>
            <option value="Meetup">Meetup</option>
            <option value="Sports">Sports</option>
            <option value="Festival">Festival</option>
            <option value="Other">Other</option>
          </select>

          <select
            name="mode"
            value={formData.mode}
            onChange={handleChange}
            className="w-full border border-border rounded-input px-4 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-secondary"
          >
            <option value="offline">Offline</option>
            <option value="online">Online</option>
            <option value="hybrid">Hybrid</option>
          </select>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-mist">Start Date & Time</label>
              <input
                type="datetime-local"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full border border-border rounded-input px-4 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
            <div>
              <label className="text-sm text-mist">End Date & Time</label>
              <input
                type="datetime-local"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                className="w-full border border-border rounded-input px-4 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
          </div>

          {formData.mode !== "online" && (
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="location.venue"
                placeholder="Venue"
                value={formData.location.venue}
                onChange={handleChange}
                className="w-full border border-border rounded-input px-4 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <input
                type="text"
                name="location.city"
                placeholder="City"
                value={formData.location.city}
                onChange={handleChange}
                className="w-full border border-border rounded-input px-4 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
          )}

          <input
            type="number"
            name="capacity"
            placeholder="Capacity (max attendees)"
            value={formData.capacity}
            onChange={handleChange}
            required
            min={1}
            className="w-full border border-border rounded-input px-4 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-secondary"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-secondary text-white font-semibold py-2 rounded-btn hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Event"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateEventPage;