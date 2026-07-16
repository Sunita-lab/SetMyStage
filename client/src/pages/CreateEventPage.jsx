import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { createEvent } from "../services/eventService";
import { createTicket } from "../services/ticketService";

const STEPS = ["Basic", "Schedule", "Venue", "Tickets", "Publish"];

function CreateEventPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Concert",
    startDate: "",
    endDate: "",
    mode: "offline",
    capacity: "",
    location: { venue: "", city: "", state: "", country: "India" },
    ticket: { name: "General Entry", price: "", quantity: "", maxPerUser: "5" },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("location.")) {
      const field = name.split(".")[1];
      setFormData({ ...formData, location: { ...formData.location, [field]: value } });
    } else if (name.startsWith("ticket.")) {
      const field = name.split(".")[1];
      setFormData({ ...formData, ticket: { ...formData.ticket, [field]: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      const event = await createEvent({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        startDate: formData.startDate,
        endDate: formData.endDate,
        mode: formData.mode,
        capacity: Number(formData.capacity),
        location: formData.location,
      });

      await createTicket(event._id, {
        name: formData.ticket.name,
        price: Number(formData.ticket.price) || 0,
        quantity: Number(formData.ticket.quantity),
        maxPerUser: Number(formData.ticket.maxPerUser) || 5,
      });

      navigate(`/events/${event.slug}`);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border border-border rounded-input px-4 py-3 text-ink bg-surface focus:outline-none focus:ring-2 focus:ring-secondary transition";
  const labelClass = "text-sm text-ink font-medium block mb-1.5";

  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="max-w-xl mx-auto">
        <h1 className="font-heading font-bold text-2xl text-ink mb-8">Create Event</h1>

        {/* Step indicator */}
        <div className="flex items-center mb-10">
          {STEPS.map((label, i) => {
            const num = i + 1;
            const isDone = step > num;
            const isActive = step === num;
            return (
              <div key={label} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition ${
                      isDone
                        ? "bg-success text-white"
                        : isActive
                        ? "bg-primary text-white"
                        : "bg-surface border border-border text-mist"
                    }`}
                  >
                    {isDone ? <Check size={16} /> : num}
                  </div>
                  <span className="text-xs text-mist mt-1 hidden sm:block">{label}</span>
                </div>
                {num !== STEPS.length && (
                  <div className={`flex-1 h-0.5 mx-2 ${isDone ? "bg-success" : "bg-border"}`} />
                )}
              </div>
            );
          })}
        </div>

        {error && (
          <div className="bg-danger/10 border border-danger text-danger text-sm rounded-input px-4 py-3 mb-4">
            {error}
          </div>
        )}

        <div className="bg-surface rounded-card shadow-md p-8 border border-border">
          {/* Step 1 — Basic */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Event Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="e.g. Music Night 2026"
                />
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className={inputClass}
                  placeholder="Tell people what this event is about"
                />
              </div>
              <div>
                <label className={labelClass}>Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className={inputClass}>
                  {["Concert", "Conference", "Workshop", "Meetup", "Sports", "Festival", "Other"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Step 2 — Schedule */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Mode</label>
                <div className="grid grid-cols-3 gap-3">
                  {["offline", "online", "hybrid"].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setFormData({ ...formData, mode: m })}
                      className={`py-3 rounded-input border font-medium text-sm capitalize transition ${
                        formData.mode === m
                          ? "bg-primary text-white border-primary"
                          : "bg-surface text-mist border-border hover:border-secondary"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className={labelClass}>Start Date & Time</label>
                <input type="datetime-local" name="startDate" value={formData.startDate} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>End Date & Time</label>
                <input type="datetime-local" name="endDate" value={formData.endDate} onChange={handleChange} className={inputClass} />
              </div>
            </div>
          )}

          {/* Step 3 — Venue */}
          {step === 3 && (
            <div className="space-y-4">
              {formData.mode === "online" ? (
                <p className="text-mist text-sm">
                  This is an online event — venue details aren't required. You can add a meeting link later from the event settings.
                </p>
              ) : (
                <>
                  <div>
                    <label className={labelClass}>Venue Name</label>
                    <input type="text" name="location.venue" value={formData.location.venue} onChange={handleChange} className={inputClass} placeholder="e.g. City Hall" />
                  </div>
                  <div>
                    <label className={labelClass}>City</label>
                    <input type="text" name="location.city" value={formData.location.city} onChange={handleChange} className={inputClass} placeholder="e.g. Bhubaneswar" />
                  </div>
                  <div>
                    <label className={labelClass}>State</label>
                    <input type="text" name="location.state" value={formData.location.state} onChange={handleChange} className={inputClass} placeholder="e.g. Odisha" />
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 4 — Tickets */}
          {step === 4 && (
            <div className="space-y-4">
              <p className="text-mist text-sm mb-2">
                Set up your first ticket type. You can add more later.
              </p>
              <div>
                <label className={labelClass}>Ticket Name</label>
                <input type="text" name="ticket.name" value={formData.ticket.name} onChange={handleChange} className={inputClass} placeholder="e.g. General Entry" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Price (₹)</label>
                  <input type="number" name="ticket.price" value={formData.ticket.price} onChange={handleChange} className={inputClass} placeholder="0 for free" min={0} />
                </div>
                <div>
                  <label className={labelClass}>Quantity</label>
                  <input type="number" name="ticket.quantity" value={formData.ticket.quantity} onChange={handleChange} className={inputClass} placeholder="e.g. 100" min={1} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Max per User</label>
                <input type="number" name="ticket.maxPerUser" value={formData.ticket.maxPerUser} onChange={handleChange} className={inputClass} min={1} />
              </div>
            </div>
          )}

          {/* Step 5 — Publish */}
          {step === 5 && (
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Capacity (max attendees)</label>
                <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} className={inputClass} min={1} />
              </div>

              <div className="bg-background rounded-input p-4 text-sm space-y-1 border border-border">
                <p className="font-semibold text-ink mb-2">Review</p>
                <p className="text-mist">Title: <span className="text-ink">{formData.title || "—"}</span></p>
                <p className="text-mist">Category: <span className="text-ink">{formData.category}</span></p>
                <p className="text-mist">Mode: <span className="text-ink capitalize">{formData.mode}</span></p>
                <p className="text-mist">Ticket: <span className="text-ink">{formData.ticket.name} — {formData.ticket.price ? `₹${formData.ticket.price}` : "Free"}</span></p>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <button
                onClick={back}
                className="text-ink font-medium px-5 py-2.5 rounded-btn border border-border hover:bg-background transition"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            {step < STEPS.length ? (
              <button
                onClick={next}
                className="bg-primary text-white font-semibold px-6 py-2.5 rounded-btn hover:opacity-90 transition"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-accent text-ink font-semibold px-6 py-2.5 rounded-btn hover:opacity-90 transition disabled:opacity-50"
              >
                {loading ? "Publishing..." : "Publish Event"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateEventPage;