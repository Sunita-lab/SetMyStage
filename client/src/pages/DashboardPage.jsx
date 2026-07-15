import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getOrganizerStats, getAttendeeStats } from "../services/dashboardService";

function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isOrganizer = user?.role === "organizer" || user?.role === "admin";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = isOrganizer ? await getOrganizerStats() : await getAttendeeStats();
        setStats(data);
      } catch (err) {
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isOrganizer]);

  if (loading) return <p className="text-center mt-10 text-mist">Loading dashboard...</p>;
  if (error) return <p className="text-center mt-10 text-danger">{error}</p>;

  const cards = isOrganizer
    ? [
        { label: "Total Events", value: stats.totalEvents },
        { label: "Total Registrations", value: stats.totalRegistrations },
        { label: "Total Revenue", value: `₹${stats.totalRevenue}` },
        { label: "Checked In", value: stats.totalCheckedIn },
      ]
    : [
        { label: "Events Registered", value: stats.totalRegistrations },
        { label: "Events Attended", value: stats.totalAttended },
      ];

  const upcomingList = isOrganizer ? stats.upcomingEvents : stats.upcoming;

  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <h1 className="font-heading font-bold text-3xl text-ink mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-surface rounded-card shadow-md p-5 border border-border"
          >
            <p className="text-mist text-sm">{card.label}</p>
            <p className="font-heading font-bold text-2xl text-primary mt-1">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <h2 className="font-heading font-semibold text-xl text-ink mb-4">
        Upcoming Events
      </h2>

      {upcomingList.length === 0 ? (
        <p className="text-mist">No upcoming events.</p>
      ) : (
        <div className="space-y-3">
          {upcomingList.map((item) => {
            const event = isOrganizer ? item : item.event;
            return (
              <Link
                key={event._id}
                to={`/events/${event.slug}`}
                className="block bg-surface rounded-card shadow-md p-4 border border-border hover:shadow-lg transition"
              >
                <p className="font-semibold text-ink">{event.title}</p>
                <p className="text-mist text-sm">
                  {new Date(event.startDate).toLocaleString()}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default DashboardPage;