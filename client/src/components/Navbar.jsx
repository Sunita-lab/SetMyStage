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
      <Link to="/events" onClick={closeMenu} className="font-medium text-white/90 hover:text-accent transition">
        Events
      </Link>
      {user && (
        <Link to="/dashboard" onClick={closeMenu} className="font-medium text-white/90 hover:text-accent transition">
          Dashboard
        </Link>
      )}
      {user && (
        <Link to="/my-registrations" onClick={closeMenu} className="font-medium text-white/90 hover:text-accent transition">
          My Registrations
        </Link>
      )}
      {isOrganizer && (
        <Link to="/create-event" onClick={closeMenu} className="font-medium text-white/90 hover:text-accent transition">
          Create Event
        </Link>
      )}
      {isOrganizer && (
        <Link to="/check-in" onClick={closeMenu} className="font-medium text-white/90 hover:text-accent transition">
          Check-in
        </Link>
      )}
    </>
  );

  return (
    <nav className="sticky top-0 z-50 bg-navy px-6 md:px-10 h-[72px] flex items-center shadow-md">
      <div className="flex justify-between items-center w-full">
        <Link to="/" className="flex items-center" onClick={closeMenu}>
          <img src="/logo.png" alt="SetMyStage" className="h-14 w-auto" />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-white/70 text-sm">Hi, {user.name?.split(" ")[0]}</span>
              <button
                onClick={handleLogout}
                className="bg-accent text-ink text-sm font-semibold px-4 py-2 rounded-btn hover:opacity-90 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="font-medium text-white/90 hover:text-accent transition">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-accent text-ink text-sm font-semibold px-4 py-2 rounded-btn hover:opacity-90 transition"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white p-2 rounded-btn hover:bg-white/10 transition"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-navy border-t border-white/10 shadow-lg flex flex-col py-2">
          <div className="flex flex-col">
            <Link to="/events" onClick={closeMenu} className="px-6 py-3 text-white/90 font-medium hover:bg-white/10 transition">
              Events
            </Link>
            {user && (
              <Link to="/dashboard" onClick={closeMenu} className="px-6 py-3 text-white/90 font-medium hover:bg-white/10 transition">
                Dashboard
              </Link>
            )}
            {user && (
              <Link to="/my-registrations" onClick={closeMenu} className="px-6 py-3 text-white/90 font-medium hover:bg-white/10 transition">
                My Registrations
              </Link>
            )}
            {isOrganizer && (
              <Link to="/create-event" onClick={closeMenu} className="px-6 py-3 text-white/90 font-medium hover:bg-white/10 transition">
                Create Event
              </Link>
            )}
            {isOrganizer && (
              <Link to="/check-in" onClick={closeMenu} className="px-6 py-3 text-white/90 font-medium hover:bg-white/10 transition">
                Check-in
              </Link>
            )}
          </div>
          <div className="border-t border-white/10 mt-2 pt-2 px-6">
            {user ? (
              <div className="flex items-center justify-between py-2">
                <span className="text-white/70 text-sm">Hi, {user.name?.split(" ")[0]}</span>
                <button
                  onClick={handleLogout}
                  className="bg-accent text-ink text-sm font-semibold px-4 py-2 rounded-btn hover:opacity-90 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 py-2">
                <Link to="/login" onClick={closeMenu} className="text-white/90 font-medium hover:text-accent transition">
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="bg-accent text-ink text-sm font-semibold px-4 py-2 rounded-btn hover:opacity-90 transition"
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