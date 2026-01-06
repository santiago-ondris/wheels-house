import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import NotFoundPage from "../pages/NotFoundPage";
import ProfilePage from "../pages/ProfilePage";
import AddCarPage from "../pages/AddCarPage";
import RegisterPage from "../pages/RegisterPage";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import AuthRequiredPage from "../pages/AuthRequiredPage";
import CarDetailPage from "../pages/CarDetailPage";
import EditCarPage from "../pages/EditCarPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/auth-required" element={<AuthRequiredPage />} />
        <Route path="/car/:carId" element={<CarDetailPage />} />
        <Route path="/collection/:username" element={<ProfilePage />} />
        <Route path="/collection/add" element={
          <ProtectedRoute>
            <AddCarPage />
          </ProtectedRoute>
        } />
        <Route path="/collection/edit/:carId" element={
          <ProtectedRoute>
            <EditCarPage />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
