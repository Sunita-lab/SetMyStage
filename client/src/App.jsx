function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="font-heading font-bold text-4xl text-primary">
          Set<span className="text-accent">My</span>Stage
        </h1>
        <p className="font-body text-mist">Plan. Manage. Celebrate.</p>
        <button className="bg-secondary text-white font-body font-semibold px-6 py-3 rounded-btn shadow-lg hover:opacity-90 transition">
          Create Event
        </button>
      </div>
    </div>
  );
}

export default App;