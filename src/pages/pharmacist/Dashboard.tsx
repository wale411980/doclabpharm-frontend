import { ArrowRight, Calendar } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import HealthIcons from "@/assets/healthicons_health.png";
import FluentMoney from "@/assets/fluent_money.png";
import IconPark from "@/assets/icon-park.png";
import BxsError from "@/assets/bxs_error.png";
import { usePharmacyStats, useGetPharmacyOrders } from "@/queries";
import { useAuth } from "@/hooks/useAuth";
import type { PharmacyOrders } from "@/types";
import { useNavigate } from "react-router-dom";

export default function PharmacistDashboard() {
  const navigate = useNavigate();
  const { data: stats, isLoading } = usePharmacyStats();
  const { data: orders } = useGetPharmacyOrders();
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }
  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        No stats available
      </div>
    );
  }
  return (
    <div>
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-medium text-green-700">
          Welcome 👋, Phm {`${user?.lastName} ${user?.firstName}`}.
        </h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* Inventory Status Card */}
        <Card className={`border-0 overflow-hidden bg-green-600`}>
          <div className={`flex text-white`}>
            <div className="flex-1 p-4">
              <h3 className="text-sm font-medium mb-1">Inventory Status</h3>
              <p className="text-3xl font-bold mb-6">Good</p>
              <div className="border-t border-white/20 pt-4">
                <Button
                  variant="link"
                  className="p-0 text-white flex items-center gap-2 text-sm hover:text-white/90"
                  onClick={() => navigate("/pharmacy/orders")}
                >
                  View Detailed Report
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center p-4">
              <img src={HealthIcons} alt="Health Icons" />
            </div>
          </div>
        </Card>

        {/* Revenue Card */}
        <Card className={`border-0 overflow-hidden bg-teal-800`}>
          <div className={`flex text-white`}>
            <div className="flex-1 p-4">
              <h3 className="text-sm font-medium mb-1">Revenue Today</h3>
              <p className="text-3xl font-bold mb-6">{stats.revenueToday}</p>
              <div className="border-t border-white/20 pt-4">
                <Button
                  variant="link"
                  className="p-0 text-white flex items-center gap-2 text-sm hover:text-white/90"
                  onClick={() => navigate("/pharmacy/wallet")}
                >
                  View Detailed Report
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center p-4">
              <img src={FluentMoney} alt="Health Icons" />
            </div>
          </div>
        </Card>

        {/* Medicines Available Card */}
        <Card className={`border-0 overflow-hidden bg-green-600`}>
          <div className={`flex text-white`}>
            <div className="flex-1 p-4">
              <h3 className="text-sm font-medium mb-1">Medicines Available</h3>
              <p className="text-3xl font-bold mb-6">
                {stats.availableMedicine}
              </p>
              <div className="border-t border-white/20 pt-4">
                <Button
                  variant="link"
                  className="p-0 text-white flex items-center gap-2 text-sm hover:text-white/90"
                  onClick={() => navigate("/pharmacy/products-list")}
                >
                  Visit Pro
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center p-4">
              <img src={IconPark} alt="Health Icons" />
            </div>
          </div>
        </Card>

        {/* Medicine Shortage Card */}
        <Card className={`border-0 overflow-hidden bg-teal-800`}>
          <div className={`flex text-white`}>
            <div className="flex-1 p-4">
              <h3 className="text-sm font-medium mb-1">Medicine Shortage</h3>
              <p className="text-3xl font-bold mb-6">{stats.medicineLow}</p>
              <div className="border-t border-white/20 pt-4">
                <Button
                  variant="link"
                  className="p-0 text-white flex items-center gap-2 text-sm hover:text-white/90"
                  onClick={() => navigate("/pharmacy/products-list")}
                >
                  Click here to Refill
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center p-4">
              <img src={BxsError} alt="Health Icons" />
            </div>
          </div>
        </Card>

        {/* Available Balance Card */}
        <Card className={`border-0 overflow-hidden bg-green-600`}>
          <div className={`flex text-white`}>
            <div className="flex-1 p-4">
              <h3 className="text-sm font-medium mb-1">Available Balance</h3>
              <p className="text-xs mb-1">Your earnings from consultations</p>
              <p className="text-3xl font-bold mb-6">{stats.balance}</p>
              <div className="border-t border-white/20 pt-4">
                <Button
                  variant="link"
                  className="p-0 text-white flex items-center gap-2 text-sm hover:text-white/90"
                  onClick={() => navigate("/pharmacy/wallet")}
                >
                  Click here to view all transactions
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center p-4"></div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-5 w-5 text-green-700" />
            <h2 className="text-lg font-medium text-green-700">Orders</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">Your orders</p>

          <div className="space-y-3">
            {orders?.slice(0, 5).map((item: PharmacyOrders) => (
              <div key={item.id} className="bg-white rounded-lg p-3 flex">
                <div className="bg-green-100 rounded p-2 text-center mr-4 w-16">
                  <div className="text-green-700 text-xs font-medium">
                    {new Date(item.createdAt).toLocaleString("default", {
                      month: "long",
                    })}
                  </div>
                  <div className="text-green-700 font-bold">
                    {new Date(item.createdAt).getDate()}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="font-medium">{item.totalSum}</div>
                  <div className="text-sm text-gray-600">{item.status}</div>
                </div>

                <div className="text-right">
                  <div className="font-medium text-teal-700">{`${item.user.firstName} ${item.user.lastName}`}</div>
                  <div className="text-sm text-gray-600">{item.orderTrx}</div>
                </div>
              </div>
            ))}
          </div>

          <Button
            variant="ghost"
            className="w-full mt-4 text-green-700 hover:text-green-800 hover:bg-green-50"
            onClick={() => navigate("/pharmacy/orders")}
            onClickCapture={() => navigate("/pharmacy/orders")}
          >
            View all Orders
          </Button>
        </div>
      </div>
    </div>
  );
}
