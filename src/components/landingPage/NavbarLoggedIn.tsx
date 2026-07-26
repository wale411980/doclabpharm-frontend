"use client";

import { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  ShoppingCart,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { LabTestsDropDown } from "./LabTestsDropDown";
import { useAuth } from "@/hooks/useAuth";
import { getDashboardPath } from "@/hooks/getDashboardPath";
import logo from "@/assets/logo.png";

export function NavbarLoggedIn() {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header
      className="w-full py-3"
      style={{
        background:
          "linear-gradient(259.87deg, rgba(12, 70, 84, 0.6) 14.19%, rgba(58, 150, 108, 0.99) 84.69%)",
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center">
          <a href="/dashboard" className="flex items-center">
            <img src={logo} alt="" />
            <span className="ml-2 text-lg font-bold text-white sm:text-xl">
              DocLabPharm
            </span>
          </a>
        </div>

        {/* Navigation */}
        <div className="hidden md:flex mx-4 flex-1 max-w-3xl">
          <div className="flex w-full items-center justify-center rounded-full bg-white px-6 py-2">
            <nav className="flex items-center space-x-4 lg:space-x-6">
              <LabTestsDropDown />
              <a
                href="#"
                className="text-[15px] font-medium text-[#2E9063] whitespace-nowrap"
              >
                All Tests
              </a>
              <a
                href="#"
                className="text-[15px] font-medium text-[#2E9063] whitespace-nowrap"
              >
                Speak to a Doctor
              </a>
              <a
                href="#"
                className="text-[15px] font-medium text-[#2E9063] whitespace-nowrap"
              >
                Kits
              </a>
              <a
                href="#"
                className="text-[15px] font-medium text-[#2E9063] whitespace-nowrap"
              >
                Vaccines
              </a>
            </nav>
          </div>
        </div>

        {/* User Profile and Cart */}
        <div className="flex items-center space-x-4">
          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center rounded-full bg-white px-4 py-2 text-[#2E9063] hover:bg-gray-100 transition-colors"
            >
              {`${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
                "John Doe"}{" "}
              <ChevronDown className="ml-2 h-4 w-4" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                <a
                  href={getDashboardPath(user?.userType)}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </a>
                <button
                  onClick={logout}
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Shopping Cart */}
          <div className="relative">
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#2E9063]">
              <ShoppingCart className="h-5 w-5" />
            </button>
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#2196F3] text-[10px] font-medium text-white">
              0
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
