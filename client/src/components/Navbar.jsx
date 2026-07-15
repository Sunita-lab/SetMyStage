import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const isOrganizer = user?.role === "organizer" || user?.role === "admin";

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/login");
  };

  const closeMenu = () => setIsOpen(false);

  const navLinks = (
    <>
      <Link to="/" onClick={closeMenu} className="text-ink font-medium hover:text-secondary transition">
        Events
      </Link>
      {user && (
        <Link to="/dashboard" onClick={closeMenu} className="text-ink font-medium hover:text-secondary transition">
          Dashboard
        </Link>
      )}
      {user && (
        <Link to="/my-registrations" onClick={closeMenu} className="text-ink font-medium hover:text-secondary transition">
          My Registrations
        </Link>
      )}
      {isOrganizer && (
        <Link to="/create-event" onClick={closeMenu} className="text-ink font-medium hover:text-secondary transition">
          Create Event
        </Link>
      )}
      {isOrganizer && (
        <Link to="/check-in" onClick={closeMenu} className="text-ink font-medium hover:text-secondary transition">
          Check-in
        </Link>
      )}
    </>
  );

  return (
    <nav className="bg-surface border-b border-border px-6 py-4 relative">
      <div className="flex justify-between items-center">
        <Link to="/" className="font-heading font-bold text-xl text-primary" onClick={closeMenu}>
          Set<span className="text-accent">My</span>Stage
        </Link>

        {/* Desktop links — hidden on mobile, visible on md and up */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks}
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

        {/* Hamburger — visible on mobile, hidden on md and up */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-ink p-2 hover:bg-background rounded-btn transition"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile dropdown — only shows when isOpen, and only relevant on mobile anyway */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-surface border-b border-border shadow-lg flex flex-col py-2 z-50">
          <div className="flex flex-col">
            {navLinks}
          </div>
          <div className="border-t border-border mt-2 pt-2 px-6">
            {user ? (
              <div className="flex items-center justify-between py-2">
                <span className="text-mist text-sm">Hi, {user.name?.split(" ")[0]}</span>
                <button
                  onClick={handleLogout}
                  className="bg-secondary text-white text-sm font-semibold px-4 py-2 rounded-btn hover:opacity-90 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 py-2">
                <Link to="/login" onClick={closeMenu} className="text-ink font-medium hover:text-secondary transition">
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="bg-secondary text-white text-sm font-semibold px-4 py-2 rounded-btn hover:opacity-90 transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;