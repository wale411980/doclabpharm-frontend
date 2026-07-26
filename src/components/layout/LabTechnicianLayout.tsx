import { useState } from "react";
import { Outlet } from "react-router-dom";
import { LabTechnicianSidebar } from "./LabTechnicianSidebar";
import LabTechnicianHeader from "./LabTechnicianHeader";

const LabTechnicianLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:block md:w-64">
        <LabTechnicianSidebar onClose={closeSidebar} />
      </div>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <LabTechnicianSidebar onClose={closeSidebar} />
      </div>

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <LabTechnicianHeader onMenuClick={toggleSidebar} />

        {/* Main content area */}
        <main className="flex-1 p-4 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default LabTechnicianLayout;
