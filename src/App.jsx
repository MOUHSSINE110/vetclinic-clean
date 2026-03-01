import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AnimalsPage from './pages/Animals/AnimalsPage';
import OwnersPage from './pages/Owners/OwnersPage';
import ConsultationsPage from './pages/Consultations/ConsultationsPage';
import DocumentsPage from './pages/Documents/DocumentsPage';
import Sidebar from "./components/Sidebar"; 

// --- ÉTAPE 1 : Vérifiez bien cette ligne ---
import VetsPage from './pages/VetsPage'; 
// ---------------------------------------

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

function LayoutWithSidebar({ children }) {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar /> 
      <div style={{ 
        marginLeft: "260px", 
        flex: 1, 
        padding: "20px",
        backgroundColor: "#f3f4f6", 
        minHeight: "100vh"
      }}>
        {children}
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        {/* Routes protégées */}
        <Route path="/" element={<ProtectedRoute><LayoutWithSidebar><Dashboard /></LayoutWithSidebar></ProtectedRoute>} />
        <Route path="/owners" element={<ProtectedRoute><LayoutWithSidebar><OwnersPage /></LayoutWithSidebar></ProtectedRoute>} />
        <Route path="/animals" element={<ProtectedRoute><LayoutWithSidebar><AnimalsPage /></LayoutWithSidebar></ProtectedRoute>} />
        <Route path="/consultations" element={<ProtectedRoute><LayoutWithSidebar><ConsultationsPage /></LayoutWithSidebar></ProtectedRoute>} />
        <Route path="/documents" element={<ProtectedRoute><LayoutWithSidebar><DocumentsPage /></LayoutWithSidebar></ProtectedRoute>} />
        
        {/* --- ÉTAPE 2 : Ajoutez la route ICI, AVANT la route étoile (*) --- */}
        <Route path="/vets" element={<ProtectedRoute><LayoutWithSidebar><VetsPage /></LayoutWithSidebar></ProtectedRoute>} />
        {/* --------------------------------------------------------------- */}

        {/* --- IMPORTANT : La route avec l'étoile (*) DOIT ÊTRE LA DERNIÈRE --- */}
        <Route path="*" element={<Navigate to="/" replace />} />
        {/* ----------------------------------------------------------------- */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;