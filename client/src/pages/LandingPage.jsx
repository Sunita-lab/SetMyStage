import { Link } from "react-router-dom";

function LandingPage() {
  const heroWords = ["From", "Idea", "to", "Applause."];

  return (
    <div
      className="min-h-screen flex items-center relative overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url(/hero-bg.png)" }}
    >
      {/* Dark overlay for text readability */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(10,10,25,0.88), rgba(10,10,25,0.62), rgba(10,10,25,0.30))",
        }}
      />

      <div className="relative z-10 px-6 md:px-16 max-w-2xl">
        <h1 className="font-heading font-bold text-5xl md:text-6xl text-white leading-tight">
          {heroWords.map((word, i) => (
            <span
              key={word}
              className="inline-block mr-4 animate-fadeInUp"
              style={{
                animationDelay: `${i * 150}ms`,
                color: word === "Applause." ? "#FBBF24" : undefined,
                textShadow: word === "Applause." ? "0 0 20px rgba(251,191,36,0.5)" : undefined,
              }}
            >
              {word}
            </span>
          ))}
        </h1>

        <p
          className="text-white/80 text-lg mt-4 animate-fadeInUp"
          style={{ animationDelay: "600ms" }}
        >
          One platform for every event.
        </p>

        <div
          className="flex items-center gap-4 mt-8 animate-scaleIn"
          style={{ animationDelay: "750ms" }}
        >
          <Link
            to="/create-event"
            className="relative overflow-hidden bg-accent text-ink font-semibold px-6 py-3 rounded-btn hover:opacity-90 hover:-translate-y-0.5 transition group"
          >
            <span className="relative z-10">Create Event</span>
          </Link>
          <Link
            to="/events"
            className="border-2 border-white text-white font-semibold px-6 py-3 rounded-btn hover:bg-white/10 hover:-translate-y-0.5 transition"
          >
            Explore Events
          </Link>
        </div>
      </div>

      {/* Floating glass cards — right side, desktop only */}
      <div className="hidden lg:block absolute right-16 top-0 h-full w-96">
        <div
          className="absolute top-32 right-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-card p-4 text-white animate-floatSlow"
          style={{ animationDelay: "0s" }}
        >
          <p className="font-semibold">AI Summit 2026</p>
          <p className="text-sm text-white/70">1,245 Registered</p>
        </div>

        <div
          className="absolute top-64 right-32 bg-white/10 backdrop-blur-md border border-white/20 rounded-card p-4 text-white animate-floatSlow"
          style={{ animationDelay: "1.5s" }}
        >
          <p className="font-semibold text-sm">QR StagePass</p>
        </div>

        <div
          className="absolute top-96 right-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-card p-4 text-white animate-floatSlow"
          style={{ animationDelay: "3s" }}
        >
          <p className="font-semibold">₹2.4L Revenue</p>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;