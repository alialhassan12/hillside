import { Outlet } from "react-router";
import Navbar from "../components/layout/Navbar";

export default function PublicLayout() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Outlet />
    </div>
  );
}
