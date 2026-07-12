import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import NewComplaint from "./pages/NewComplaint.jsx";
import ComplaintDetail from "./pages/ComplaintDetail.jsx";
import ComplaintsList from "./pages/ComplaintsList.jsx";
import AdminUsers from "./pages/AdminUsers.jsx";
import Profile from "./pages/Profile.jsx";
import AppLayout from "./components/AppLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import Loader from "./components/Loader.jsx";

export default function App() {
  const { loading } = useAuth();
  if (loading) return <Loader fullscreen />;

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected app */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/app" element={<Dashboard />} />
        <Route path="/app/complaints" element={<ComplaintsList />} />
        <Route path="/app/complaints/new" element={<NewComplaint />} />
        <Route path="/app/complaints/:id" element={<ComplaintDetail />} />
        <Route path="/app/profile" element={<Profile />} />
        <Route
          path="/app/admin/users"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
