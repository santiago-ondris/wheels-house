import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./RootLayout";

// Pages
import HomePage from "../pages/HomePage";
import NotFoundPage from "../pages/errors/NotFoundPage";
import ProfilePage from "../pages/user/ProfilePage";
import StatsPage from "../pages/user/StatsPage";
import SettingsPage from "../pages/user/SettingsPage";
import AddCarPage from "../pages/car/AddCarPage";
import EditCarPage from "../pages/car/EditCarPage";
import QuickAddPage from "../pages/car/QuickAddPage";
import CarDetailPage from "../pages/car/CarDetailPage";
import SearchResultsPage from "../pages/search/SearchResultsPage";
import RegisterPage from "../pages/login/RegisterPage";
import AuthRequiredPage from "../pages/login/AuthRequiredPage";
import ResetPasswordPage from "../pages/login/ResetPasswordPage";
import CreateGroupPage from "../pages/groups/CreateGroupPage";
import EditGroupPage from "../pages/groups/EditGroupPage";
import GroupManageCarsPage from "../pages/groups/GroupManageCarsPage";
import GroupDetailPage from "../pages/groups/GroupDetailPage";
import GroupsListPage from "../pages/groups/GroupsListPage";
import HallOfFamePage from "../pages/hall-of-fame/HallOfFamePage";
import FoundersPage from "../pages/hall-of-fame/FoundersPage";
import ContributorsPage from "../pages/hall-of-fame/ContributorsPage";
import AmbassadorsPage from "../pages/hall-of-fame/AmbassadorsPage";
import LegendsPage from "../pages/hall-of-fame/LegendsPage";
import ContactPage from "../pages/ContactPage";
import RoadmapPage from "../pages/RoadmapPage";
import WishlistPage from "../pages/wishlist/WishlistPage";
import AddToWishlistPage from "../pages/wishlist/AddToWishlistPage";
import MoveToCollectionPage from "../pages/wishlist/MoveToCollectionPage";
import EditWishlistPage from "../pages/wishlist/EditWishlistPage";
import OnboardingPage from "../pages/onboarding/OnboardingPage";
import ImportCarsPage from "../pages/import/ImportCarsPage";
import AboutUsPage from "../pages/AboutUsPage";
import WheelWordPage from "../pages/wheelword/WheelWordPage";
import CommunityPage from "../pages/social/CommunityPage";
import PeoplePage from "../pages/social/PeoplePage";
import NotificationsPage from "../pages/NotificationsPage";
import AdminContactPage from "../pages/admin/AdminContactPage";
import AdminFeaturedCarPage from "../pages/admin/AdminFeaturedCarPage";
import EarlyAccessPage from "../pages/EarlyAccessPage";
import PrivacyPolicyPage from "../pages/PrivacyPolicyPage";
import TermsOfServicePage from "../pages/TermsOfServicePage";

// Components
import ProtectedRoute from "../components/auth/ProtectedRoute";
import AdminRoute from "../components/auth/AdminRoute";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            // Public
            { index: true, element: <HomePage /> },
            { path: "register", element: <RegisterPage /> },
            { path: "reset-password", element: <ResetPasswordPage /> },
            { path: "auth-required", element: <AuthRequiredPage /> },
            { path: "car/:carId", element: <CarDetailPage /> },
            { path: "search", element: <SearchResultsPage /> },
            { path: "community", element: <CommunityPage /> },

            // Protected
            {
                path: "onboarding",
                element: <ProtectedRoute><OnboardingPage /></ProtectedRoute>
            },
            {
                path: "settings",
                element: <ProtectedRoute><SettingsPage /></ProtectedRoute>
            },
            {
                path: "collection/add",
                element: <ProtectedRoute><AddCarPage /></ProtectedRoute>
            },
            {
                path: "collection/quick-add",
                element: <ProtectedRoute><QuickAddPage /></ProtectedRoute>
            },
            {
                path: "collection/edit/:carId",
                element: <ProtectedRoute><EditCarPage /></ProtectedRoute>
            },
            {
                path: "collection/group/new",
                element: <ProtectedRoute><CreateGroupPage /></ProtectedRoute>
            },
            {
                path: "collection/group/edit/:groupId",
                element: <ProtectedRoute><EditGroupPage /></ProtectedRoute>
            },
            {
                path: "collection/group/manage/:groupId",
                element: <ProtectedRoute><GroupManageCarsPage /></ProtectedRoute>
            },
            {
                path: "import",
                element: <ProtectedRoute><ImportCarsPage /></ProtectedRoute>
            },
            {
                path: "people",
                element: <ProtectedRoute><PeoplePage /></ProtectedRoute>
            },
            {
                path: "notifications",
                element: <ProtectedRoute><NotificationsPage /></ProtectedRoute>
            },

            // Admin
            {
                path: "admin/contact",
                element: <AdminRoute><AdminContactPage /></AdminRoute>
            },
            {
                path: "admin/featured-car",
                element: <AdminRoute><AdminFeaturedCarPage /></AdminRoute>
            },

            // User collection routes (public)
            { path: "collection/:username", element: <ProfilePage /> },
            { path: "collection/:username/stats", element: <StatsPage /> },
            { path: "collection/:username/groups", element: <GroupsListPage /> },
            { path: "collection/:username/group/:groupName", element: <GroupDetailPage /> },

            // Wishlist
            {
                path: "wishlist/add",
                element: <ProtectedRoute><AddToWishlistPage /></ProtectedRoute>
            },
            {
                path: "wishlist/edit/:carId",
                element: <ProtectedRoute><EditWishlistPage /></ProtectedRoute>
            },
            {
                path: "wishlist/got-it/:carId",
                element: <ProtectedRoute><MoveToCollectionPage /></ProtectedRoute>
            },
            { path: "wishlist/:username", element: <WishlistPage /> },

            // Hall of Fame
            { path: "hall-of-fame", element: <HallOfFamePage /> },
            { path: "hall-of-fame/founders", element: <FoundersPage /> },
            { path: "hall-of-fame/contributors", element: <ContributorsPage /> },
            { path: "hall-of-fame/ambassadors", element: <AmbassadorsPage /> },
            { path: "hall-of-fame/legends", element: <LegendsPage /> },

            // Other
            { path: "about", element: <AboutUsPage /> },
            { path: "contact", element: <ContactPage /> },
            { path: "roadmap", element: <RoadmapPage /> },
            { path: "early-access", element: <EarlyAccessPage /> },
            { path: "privacy-policy", element: <PrivacyPolicyPage /> },
            { path: "terms-of-service", element: <TermsOfServicePage /> },
            { path: "wheelword", element: <WheelWordPage /> },

            // Catch-all
            { path: "*", element: <NotFoundPage /> },
        ],
    },
]);
