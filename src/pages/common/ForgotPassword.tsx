import type React from "react";

import { useState } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

type ResetTab = "email" | "phone";

export default function ForgotPassword() {
  const [activeTab, setActiveTab] = useState<ResetTab>("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+222 999078 88");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleBackToLogin = () => {
    navigate("/");
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg p-6 relative">
      <button
        onClick={() => navigate("/")}
        className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        aria-label="Close"
      >
        <X className="h-6 w-6 text-gray-400" />
      </button>

      <h2 className="text-3xl font-medium text-center text-emerald-600 mb-6">
        Forgot your password?
      </h2>

      {/* Tabs */}
      <div className="bg-gray-200 rounded-full flex mb-6">
        <button
          className={`flex-1 py-3 px-4 rounded-full ${
            activeTab === "email"
              ? "bg-emerald-600 text-white"
              : "text-emerald-600"
          }`}
          onClick={() => setActiveTab("email")}
        >
          Email
        </button>
      </div>

      <p className="text-emerald-600 mb-4">
        {activeTab === "email"
          ? "Enter your Email to reset it"
          : "Enter your Phone Number to reset it"}
      </p>

      <form onSubmit={handleSubmit}>
        {activeTab === "email" ? (
          <div className="mb-6">
            <input
              type="email"
              placeholder="Email address"
              className="w-full p-4 border border-gray-300 rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        ) : (
          <div className="mb-6">
            <div className="flex items-center w-full p-4 border border-gray-300 rounded-lg">
              <div className="flex items-center mr-2">
                <span className="inline-block w-6 h-6 rounded-full overflow-hidden mr-1">
                  <img
                    src="/placeholder.svg?height=24&width=24"
                    alt="US flag"
                    className="w-full h-full object-cover"
                  />
                </span>
                <span>▼</span>
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1 outline-none"
                required
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-4 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition mb-6"
        >
          Login
        </button>
      </form>

      <button
        onClick={handleBackToLogin}
        className="flex items-center text-gray-500 hover:text-gray-700"
      >
        <span className="mr-2">←</span>
        Back to Login screen
      </button>
    </div>
  );
}
