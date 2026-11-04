import { BrowserRouter, Route, Routes } from "react-router";

import PublicLayout from "../layouts/PublicLayout";
import AdminLayout from "../layouts/AdminLayout";

import HomePage from "../pages/public/HomePage";
import ServicesPage from "../pages/public/ServicesPage.tsx";
import ServiceDetailsPage from "../pages/public/ServiceDetailsPage.tsx";
import ContactPage from "../pages/public/ContactPage.tsx";

import LoginPage from "../pages/admin/LoginPage.tsx";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:id" element={<ServiceDetailsPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="login" element={<LoginPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
