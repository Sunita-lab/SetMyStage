import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "attendee",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await registerUser(formData);
      login(data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — Brand panel, hidden on mobile */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center text-center p-12 relative overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #312E81 0%, #6D28D9 60%, #9333EA 100%)",
        }}
      >
        <img src="/logo.png" alt="SetMyStage" className="h-16 w-auto mb-6" />
        <h2 className="font-heading font-bold text-3xl text-white mb-3">
          From idea to applause.
        </h2>
        <p className="text-white/70 max-w-sm">
          Join SetMyStage to create, manage, and experience unforgettable events.
        </p>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-sm">
          <h1 className="font-heading font-bold text-2xl text-ink mb-1">Create Account</h1>
          <p className="text-mist text-sm mb-8">Start your journey with SetMyStage</p>

          {error && (
            <div className="bg-danger/10 border border-danger text-danger text-sm rounded-input px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-ink font-medium block mb-1.5">Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-border rounded-input px-4 py-3 text-ink bg-surface focus:outline-none focus:ring-2 focus:ring-secondary transition"
              />
            </div>

            <div>
              <label className="text-sm text-ink font-medium block mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-border rounded-input px-4 py-3 text-ink bg-surface focus:outline-none focus:ring-2 focus:ring-secondary transition"
              />
            </div>

            <div>
              <label className="text-sm text-ink font-medium block mb-1.5">Password</label>
              <input
                type="password"
                name="password"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full border border-border rounded-input px-4 py-3 text-ink bg-surface focus:outline-none focus:ring-2 focus:ring-secondary transition"
              />
            </div>

            <div>
              <label className="text-sm text-ink font-medium block mb-1.5">I am a...</label>
              <div className="grid grid-cols-2 gap-3">
                {["attendee", "organizer"].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: r })}
                    className={`py-3 rounded-input border font-medium text-sm capitalize transition ${
                      formData.role === r
                        ? "bg-primary text-white border-primary"
                        : "bg-surface text-mist border-border hover:border-secondary"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white font-semibold py-3 rounded-btn hover:opacity-90 hover:-translate-y-0.5 transition disabled:opacity-50 disabled:translate-y-0"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-mist text-sm text-center mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-secondary font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;