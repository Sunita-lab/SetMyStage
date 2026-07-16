import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getMyRegistrations } from "../services/registrationService";

function TicketPage() {
  const { registrationId } = useParams();
  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      const all = await getMyRegistrations();
      console.log("URL ID:", registrationId);
      console.log("All Registrations:", all.map((r) => r._id));
      const found = all.find((r) => r._id === registrationId);
      setRegistration(found);
      setLoading(false);
    };
    fetchTicket();
  }, [registrationId]);

  if (loading) return <p className="text-center mt-10 text-mist">Loading...</p>;
  if (!registration) return <p className="text-center mt-10 text-danger">Ticket not found</p>;

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-12"
      style={{ background: "linear-gradient(160deg, #18122B 0%, #312E81 100%)" }}
    >
      <div className="bg-[#211A36] rounded-card p-8 max-w-sm w-full text-center border border-white/10 shadow-lg">
        <p className="text-accent font-heading font-bold text-lg mb-1">StagePass</p>
        <h1 className="font-heading font-bold text-2xl text-white mb-6">
          {registration.event?.title}
        </h1>

        <div className="bg-white rounded-card p-4 inline-block mb-6">
          <img src={registration.qrCodeImage} alt="QR Code" className="w-48 h-48" />
        </div>

        <div className="space-y-2 text-sm text-left bg-[#2A2343] rounded-input p-4">
          <div className="flex justify-between">
            <span className="text-white/50">Ticket</span>
            <span className="text-white font-medium">{registration.ticket?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/50">Date</span>
            <span className="text-white font-medium">
              {registration.event?.startDate &&
                new Date(registration.event.startDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/50">Status</span>
            <span className="text-accent font-medium capitalize">{registration.status}</span>
          </div>
        </div>

        <Link to="/my-registrations" className="inline-block mt-6 text-white/60 text-sm hover:text-white transition">
          ← Back to My Registrations
        </Link>
      </div>
    </div>
  );
}

export default TicketPage;