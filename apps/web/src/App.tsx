import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import CollectionPage from "./pages/CollectionPage";
import { DetailMuseum } from "./pages/DetailMuseum";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/collection" element={<CollectionPage />} />
          <Route path="/concept/trading-card" element={<DetailMuseum />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}