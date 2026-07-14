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
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="bg-surface rounded-card shadow-md p-8 w-full max-w-md border border-border">
        <h1 className="font-heading font-bold text-2xl text-primary mb-6 text-center">
          Create Account
        </h1>

        {error && (
          <p className="text-danger text-sm mb-4 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-border rounded-input px-4 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-secondary"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border border-border rounded-input px-4 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-secondary"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full border border-border rounded-input px-4 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-secondary"
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border border-border rounded-input px-4 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-secondary"
          >
            <option value="attendee">Attendee</option>
            <option value="organizer">Organizer</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-secondary text-white font-semibold py-2 rounded-btn hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="text-mist text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;