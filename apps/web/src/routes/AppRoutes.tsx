import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import NotFoundPage from "../pages/NotFoundPage";
import ProfilePage from "../pages/user/ProfilePage";
import AddCarPage from "../pages/car/AddCarPage";
import RegisterPage from "../pages/login/RegisterPage";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import AuthRequiredPage from "../pages/login/AuthRequiredPage";
import CarDetailPage from "../pages/car/CarDetailPage";
import EditCarPage from "../pages/car/EditCarPage";
import CreateGroupPage from "../pages/groups/CreateGroupPage";
import EditGroupPage from "../pages/groups/EditGroupPage";
import GroupDetailPage from "../pages/groups/GroupDetailPage";
import GroupsListPage from "../pages/groups/GroupsListPage";
import HallOfFamePage from "../pages/hall-of-fame/HallOfFamePage";
import FoundersPage from "../pages/hall-of-fame/FoundersPage";
import ContributorsPage from "../pages/hall-of-fame/ContributorsPage";
import AmbassadorsPage from "../pages/hall-of-fame/AmbassadorsPage";
import LegendsPage from "../pages/hall-of-fame/LegendsPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/auth-required" element={<AuthRequiredPage />} />
        <Route path="/car/:carId" element={<CarDetailPage />} />

        {/* Collection routes - more specific first */}
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
        <Route path="/collection/group/new" element={
          <ProtectedRoute>
            <CreateGroupPage />
          </ProtectedRoute>
        } />
        <Route path="/collection/group/edit/:groupId" element={
          <ProtectedRoute>
            <EditGroupPage />
          </ProtectedRoute>
        } />

        {/* Public collection routes */}
        <Route path="/collection/:username" element={<ProfilePage />} />
        <Route path="/collection/:username/groups" element={<GroupsListPage />} />
        <Route path="/collection/:username/group/:groupName" element={<GroupDetailPage />} />
        +
        +        {/* Hall of Fame routes */}
        +        <Route path="/hall-of-fame" element={<HallOfFamePage />} />
        +        <Route path="/hall-of-fame/founders" element={<FoundersPage />} />
        +        <Route path="/hall-of-fame/contributors" element={<ContributorsPage />} />
        +        <Route path="/hall-of-fame/ambassadors" element={<AmbassadorsPage />} />
        +        <Route path="/hall-of-fame/legends" element={<LegendsPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
