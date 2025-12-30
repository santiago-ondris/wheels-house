import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import CollectionPage from "./pages/CollectionPage";
import { DetailMuseum } from "./pages/DetailMuseum";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AuthRequiredPage from "./pages/AuthRequiredPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/collection" element={<CollectionPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/auth-required" element={<AuthRequiredPage />} />
          <Route path="/concept/trading-card" element={
            <ProtectedRoute>
              <DetailMuseum />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}