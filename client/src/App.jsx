import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import EventsPage from "./pages/EventsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CreateEventPage from "./pages/CreateEventPage";
import EventDetailPage from "./pages/EventDetailPage";
import MyRegistrationsPage from "./pages/MyRegistrationsPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Navbar/>
        <Routes>
          <Route path="/" element={<EventsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route 
             path="/create-event"
             element={
             <ProtectedRoute allowedRoles={["organizer", "admin"]}>
               <CreateEventPage />
             </ProtectedRoute>
           } />
           <Route path="/events/:slug" element={<EventDetailPage />} />
           <Route path="/my-registrations" element={<ProtectedRoute><MyRegistrationsPage /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;