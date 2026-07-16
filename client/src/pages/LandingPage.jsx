import { Link } from "react-router-dom";
import { useEffect, useState , useRef} from "react";

function StatCounter({ target, suffix, label, decimal = false }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 900;
          const startTime = Date.now();

          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const value = progress * target;
            setCount(decimal? value.toFixed(1): Math.floor(value));

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, decimal]);

  return (
    <div ref={ref} className="text-center">
      <p className="font-heading font-bold text-4xl md:text-5xl text-accent">
        {count}
        {suffix}
      </p>
      <p className="text-white/60 mt-2">{label}</p>
    </div>
  );
}

function LandingPage() {
  const heroWords = ["From", "Idea", "to", "Applause."];

  return (
    <>
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
    className="absolute top-28 right-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-card p-4 text-white animate-floatSlow"
    style={{ animationDelay: "0s" }}
  >
    <p className="text-xs text-accent font-semibold mb-1">🎤 LIVE</p>
    <p className="font-semibold">Tech Summit 2026</p>
    <p className="text-sm text-white/70">1,245 Registered</p>
  </div>

  <div
    className="absolute top-60 right-36 bg-white/10 backdrop-blur-md border border-white/20 rounded-card p-4 text-white animate-floatSlow"
    style={{ animationDelay: "1.3s" }}
  >
    <p className="font-semibold text-sm mb-1">🎫 StagePass</p>
    <div className="w-14 h-14 bg-white rounded mt-1" />
  </div>

  <div
    className="absolute top-96 right-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-card p-4 text-white animate-floatSlow"
    style={{ animationDelay: "2.6s" }}
  >
    <p className="font-semibold">₹2.4L+</p>
    <p className="text-sm text-white/70">Revenue Generated</p>
  </div>
</div>
</div>

{/* Trusted By marquee */}
<div className="bg-[#131126] py-8 overflow-hidden">
  <p className="text-center text-white/40 text-sm font-medium mb-6">
    TRUSTED BY COMMUNITIES ACROSS INDIA
  </p>
  <div className="flex animate-marquee">
    {[...Array(2)].map((_, dup) => (
      <div key={dup} className="flex items-center gap-16 px-8 shrink-0">
        {["OUTR", "IEEE", "Google DSC", "TEDx", "Mozilla"].map((name) => (
          <span
            key={name}
            className="text-white/40 hover:text-white transition font-heading font-semibold text-xl whitespace-nowrap"
          >
            {name}
          </span>
        ))}
      </div>
    ))}
  </div>
</div>

{/* Everything You Need */}
<div className="bg-navy py-20 px-6 md:px-12">
  <h2 className="font-heading font-bold text-3xl md:text-4xl text-white text-center mb-12">
    Everything You Need
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
    {[
      {
        icon: "🎭",
        title: "Create",
        description: "Create beautiful events with rich details, banners, and custom categories.",
      },
      {
        icon: "📈",
        title: "Manage",
        description: "Registrations, payments, and tickets — all handled seamlessly in one place.",
      },
      {
        icon: "✨",
        title: "Celebrate",
        description: "Create memorable experiences with QR check-ins and real-time insights.",
      },
    ].map((card) => (
      <div
        key={card.title}
        className="bg-[#1A1733] rounded-[20px] p-8 border border-transparent hover:border-secondary hover:-translate-y-1 transition-all duration-200 shadow-md"
      >
        <p className="text-4xl mb-4">{card.icon}</p>
        <h3 className="font-heading font-semibold text-xl text-white mb-2">
          {card.title}
        </h3>
        <p className="text-white/60 text-sm leading-relaxed">{card.description}</p>
      </div>
    ))}
  </div>
</div>

{/* Event Categories */}
<div className="bg-[#0D0B1A] py-20 px-6 md:px-12">
  <h2 className="font-heading font-bold text-3xl md:text-4xl text-white text-center mb-12">
    Explore by Category
  </h2>

  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
    {[
      { icon: "🎤", label: "Conference" },
      { icon: "🛠️", label: "Workshop" },
      { icon: "💍", label: "Wedding" },
      { icon: "⚽", label: "Sports" },
      { icon: "💻", label: "Hackathon" },
      { icon: "🎪", label: "Festival" },
      { icon: "🤝", label: "Meetup" },
      { icon: "🎸", label: "Concert" },
    ].map((cat) => (
      <Link
        key={cat.label}
        to="/events"
        className="flex flex-col items-center gap-2 bg-[#1A1733] rounded-[20px] p-6 hover:shadow-[0_0_20px_rgba(109,40,217,0.4)] transition-all duration-200"
      >
        <span className="text-3xl">{cat.icon}</span>
        <span className="text-white/80 text-sm font-medium">{cat.label}</span>
      </Link>
    ))}
  </div>
</div>

{/* Stats */}
<div className="bg-navy py-20 px-6 md:px-12">
  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
    <StatCounter target={250} suffix="+" label="Events" />
    <StatCounter target={15} suffix="K+" label="Attendees" />
    <StatCounter target={800} suffix="+" label="Organizers" />
    <StatCounter target={4.9} suffix="★" label="Rating" decimal />
  </div>
</div>
</>

    
  );
}

export default LandingPage;