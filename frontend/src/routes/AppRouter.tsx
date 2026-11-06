import { BrowserRouter, Route, Routes } from "react-router";

import PublicLayout from "../layouts/PublicLayout";
import AdminLayout from "../layouts/AdminLayout";

import HomePage from "../pages/public/HomePage";
import ServicesPage from "../pages/public/ServicesPage.tsx";
import ServiceDetailsPage from "../pages/public/ServiceDetailsPage.tsx";
import ContactPage from "../pages/public/ContactPage.tsx";

import LoginPage from "../pages/admin/LoginPage.tsx";
import DashboardPage from "../pages/admin/DashboardPage.tsx";
import HomepageManagementPage from "../pages/admin/HomepageManagementPage.tsx";
import ServicesManagementPage from "../pages/admin/ServicesManagementPage.tsx";
import ServiceDetailsManagementPage from "../pages/admin/ServiceDetailsManagementPage.tsx";
import MediaLibraryPage from "../pages/admin/MediaLibraryPage.tsx";
import ContactInfoPage from "../pages/admin/ContactInfoPage.tsx";
import MessagesPage from "../pages/admin/MessagesPage.tsx";
import TestimonialsPage from "../pages/admin/TestimonialsPage.tsx";
import AdminUsersPage from "../pages/admin/AdminUsersPage.tsx";

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

        <Route path="/admin/login" element={<LoginPage />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="homepage" element={<HomepageManagementPage />} />
          <Route path="services" element={<ServicesManagementPage />} />
          <Route
            path="service-details"
            element={<ServiceDetailsManagementPage />}
          />
          <Route path="media" element={<MediaLibraryPage />} />
          <Route path="contact" element={<ContactInfoPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="testimonials" element={<TestimonialsPage />} />
          <Route path="users" element={<AdminUsersPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
