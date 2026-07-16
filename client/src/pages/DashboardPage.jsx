import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import { getOrganizerStats, getAttendeeStats } from "../services/dashboardService";
import { downloadAttendanceReport } from "../services/registrationService";

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

  const cards = stats
    ? isOrganizer
      ? [
          { label: "Total Events", value: stats.totalEvents },
          { label: "Total Registrations", value: stats.totalRegistrations },
          { label: "Total Revenue", value: `₹${stats.totalRevenue}` },
          { label: "Checked In", value: stats.totalCheckedIn },
        ]
      : [
          { label: "Events Registered", value: stats.totalRegistrations },
          { label: "Events Attended", value: stats.totalAttended },
        ]
    : [];

  const upcomingList = stats ? (isOrganizer ? stats.upcomingEvents : stats.upcoming) : [];

  return (
    <div className="flex" style={{ background: "#1B182D" }}>
      <Sidebar />

      <div className="flex-1 px-6 md:px-10 py-10 min-h-[calc(100vh-72px)]">
        <h1 className="font-heading font-bold text-3xl text-white mb-8">
          {isOrganizer ? "Backstage Dashboard" : "My Dashboard"}
        </h1>

        {loading && <p className="text-white/50">Loading dashboard...</p>}
        {error && <p className="text-danger">{error}</p>}

        {stats && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {cards.map((card) => (
                <div
                  key={card.label}
                  className="bg-[#2A2343] rounded-[20px] p-5 border border-white/5"
                >
                  <p className="text-white/50 text-sm">{card.label}</p>
                  <p className="font-heading font-bold text-2xl text-accent mt-1">
                    {card.value}
                  </p>
                </div>
              ))}
            </div>

            <h2 className="font-heading font-semibold text-xl text-white mb-4">
              Upcoming Events
            </h2>

            {upcomingList.length === 0 ? (
              <p className="text-white/40 mb-10">No upcoming events.</p>
            ) : (
              <div className="space-y-3 mb-10">
                {upcomingList.map((item) => {
                  const event = isOrganizer ? item : item.event;
                  return (
                    <Link
                      key={event._id}
                      to={`/events/${event.slug}`}
                      className="block bg-[#2A2343] rounded-[20px] p-4 border border-white/5 hover:border-secondary transition"
                    >
                      <p className="font-semibold text-white">{event.title}</p>
                      <p className="text-white/50 text-sm">
                        {new Date(event.startDate).toLocaleString()}
                      </p>
                    </Link>
                  );
                })}
              </div>
            )}

            {isOrganizer && stats.eventWiseAttendance && (
              <>
                <h2 className="font-heading font-semibold text-xl text-white mb-4">
                  Attendance by Event
                </h2>
                <div className="space-y-3">
                  {stats.eventWiseAttendance.map((item) => (
                    <div
                      key={item.eventId}
                      className="bg-[#2A2343] rounded-[20px] p-4 border border-white/5"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-semibold text-white">{item.title}</p>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-white/50">
                            {item.checkedIn} / {item.totalRegistrations} ({item.percentage}%)
                          </span>
                          <button
                            onClick={() => downloadAttendanceReport(item.eventId)}
                            className="text-accent text-xs font-semibold underline"
                          >
                            Download CSV
                          </button>
                        </div>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div
                          className="bg-secondary h-2 rounded-full transition-all"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;