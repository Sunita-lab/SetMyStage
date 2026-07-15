import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyRegistrations } from "../services/registrationService";

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
    <div className="min-h-screen bg-background px-6 py-10">
      <h1 className="font-heading font-bold text-3xl text-ink mb-8">
        My Registrations
      </h1>

      {registrations.length === 0 ? (
        <p className="text-mist">
          You haven't registered for any events yet.{" "}
          <Link to="/" className="text-primary font-semibold">
            Browse events
          </Link>
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {registrations.map((reg) => (
            <div
              key={reg._id}
              className="bg-surface rounded-card shadow-md p-5 border border-border"
            >
              <h2 className="font-heading font-semibold text-lg text-primary mb-1">
                {reg.event?.title}
              </h2>
              <p className="text-mist text-sm mb-1">
                {new Date(reg.event?.startDate).toLocaleString()}
              </p>
              <p className="text-ink text-sm mb-3">
                Ticket: <span className="font-medium">{reg.ticket?.name}</span>
              </p>

              <div className="flex justify-between items-center">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    reg.status === "confirmed"
                      ? "bg-success text-white"
                      : "bg-warning text-white"
                  }`}
                >
                  {reg.status}
                </span>

                {reg.qrCodeImage && (
                  <img
                    src={reg.qrCodeImage}
                    alt="QR Code"
                    className="w-16 h-16 border border-border rounded"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyRegistrationsPage;