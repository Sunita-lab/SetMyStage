import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Calendar, PlusCircle, ScanLine, Ticket } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();
  const isOrganizer = user?.role === "organizer" || user?.role === "admin";

  const links = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/events", label: "Events", icon: Calendar },
    ...(isOrganizer ? [{ to: "/create-event", label: "Create Event", icon: PlusCircle }] : []),
    ...(isOrganizer ? [{ to: "/check-in", label: "Check-in", icon: ScanLine }] : []),
    { to: "/my-registrations", label: "My Tickets", icon: Ticket },
  ];

  return (
    <aside className="hidden md:flex flex-col w-60 bg-[#211A36] min-h-[calc(100vh-72px)] px-4 py-6">
      <p className="text-white/40 text-xs font-semibold uppercase tracking-wide px-3 mb-4">
        🎭 Backstage
      </p>
      <nav className="flex flex-col gap-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-input text-sm font-medium transition ${
                isActive
                  ? "bg-primary text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;