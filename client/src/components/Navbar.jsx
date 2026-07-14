import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-surface border-b border-border px-6 py-4 flex justify-between items-center">
      <Link to="/" className="font-heading font-bold text-xl text-primary">
        Set<span className="text-accent">My</span>Stage
      </Link>

      <div className="flex items-center gap-4">
        <Link to="/" className="text-ink font-medium hover:text-secondary transition">
          Events
        </Link>

        {user && (user.role === "organizer" || user.role === "admin") && (
          <Link
            to="/create-event"
            className="text-ink font-medium hover:text-secondary transition"
          >
            Create Event
          </Link>
        )}

        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-mist text-sm">Hi, {user.name?.split(" ")[0]}</span>
            <button
              onClick={handleLogout}
              className="bg-secondary text-white text-sm font-semibold px-4 py-2 rounded-btn hover:opacity-90 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-ink font-medium hover:text-secondary transition">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-secondary text-white text-sm font-semibold px-4 py-2 rounded-btn hover:opacity-90 transition"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;