import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import OwnersList from "./pages/Owners/OwnersList";
import AnimalsPage from "./pages/Animals/AnimalsPage";
import ConsultationsPage from "./pages/Consultations/ConsultationsPage";
import DocumentsPage from "./pages/Documents/DocumentsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedLayout from "./layouts/ProtectedLayout";
import AnimalDetails from "./pages/Animals/AnimalDetails";

<Route path="/animals/:id" element={<AnimalDetails />} />


export default function App() {
  console.log("CONSULTATIONS PAGE ACTIVE");

  return (
    
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<Login />} />

      {/* Protected routes with layout */}
      <Route element={<ProtectedRoute><ProtectedLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/owners" element={<OwnersList />} />
        <Route path="/animals" element={<AnimalsPage />} />
        <Route path="/consultations" element={<ConsultationsPage />} />
        <Route path="/documents" element={<DocumentsPage />} />
        <Route  path="/animals/:animalId/consultations" element={<ConsultationsPage />} />

      </Route>

      {/* Fallback */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
