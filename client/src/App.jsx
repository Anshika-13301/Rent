import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Calculator from "./components/Calculator";
import PropertyList from "./components/PropertyList";
import ListProperty from "./components/ListProperty";
import AdminDashboard from "./components/AdminDashboard";
import AdminLogin from "./components/AdminLogin"; 
import ProtectedRoute from "./components/ProtectedRoute"; 

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-950">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Calculator />} />
          <Route path="/properties" element={<PropertyList />} />
          <Route path="/list-property" element={<ListProperty />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          
          {/* 🔒 Unprotected /admin route ko Redirect kar diya Admin Login par */}
          <Route path="/admin" element={<Navigate to="/dashboard" replace />} />

          {/* 🔒 PROTECTED ADMIN DASHBOARD */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />  
        </Routes>
      </main>
      <Footer />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: { background: "#1f2937", color: "#f3f4f6", border: "1px solid #374151" },
        }}
      />
    </div>
  );
}