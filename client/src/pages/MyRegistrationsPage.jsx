import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyRegistrations } from "../services/registrationService";

const STATUS_STYLES = {
  confirmed: "bg-primary/10 text-primary",
  waitlisted: "bg-warning/10 text-warning",
  cancelled: "bg-danger/10 text-danger",
};

const STATUS_LABELS = {
  confirmed: "Upcoming",
  waitlisted: "Waitlisted",
  cancelled: "Cancelled",
};

function MyRegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const data = await getMyRegistrations();
        setRegistrations(data);
      } catch (err) {
        setError("Failed to load registrations");
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  if (loading) return <p className="text-center mt-10 text-mist">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-danger">{error}</p>;

  return (
    <div className="min-h-screen bg-background px-6 md:px-12 py-10">
      <h1 className="font-heading font-bold text-3xl text-ink mb-8">My Registrations</h1>

      {registrations.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-2">🎟️</p>
          <p className="text-mist mb-1">Your StagePass collection is empty.</p>
          <Link to="/events" className="text-primary font-semibold text-sm">
            Browse events →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {registrations.map((reg) => (
            <Link
              key={reg._id}
              to={`/my-registrations/${reg._id}`}
              className="bg-surface rounded-card overflow-hidden border border-border hover:border-secondary hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
            >
              <div
                className="h-24 flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #312E81 0%, #6D28D9 100%)" }}
              >
                {reg.qrCodeImage && (
                  <img src={reg.qrCodeImage} alt="QR" className="w-14 h-14 rounded bg-white p-1" />
                )}
              </div>

              <div className="p-5">
                <h2 className="font-heading font-semibold text-lg text-ink mb-1">
                  {reg.event?.title}
                </h2>
                <p className="text-mist text-sm mb-3">
                  {reg.event?.startDate &&
                    new Date(reg.event.startDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  {" · "}
                  {reg.ticket?.name}
                </p>

                <span
                  className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
                    STATUS_STYLES[reg.status] || "bg-mist/10 text-mist"
                  }`}
                >
                  {STATUS_LABELS[reg.status] || reg.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyRegistrationsPage;