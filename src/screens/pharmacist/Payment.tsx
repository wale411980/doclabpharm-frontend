"use client";

import { useState } from "react";
import { Search, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// Define types
type PaymentStatus = "Paid" | "Pending" | "Failed" | "All";
type PaymentMethod = "Card" | "Bank Transfer";
type ServiceType = "Home Consultation" | "Virtual Consultation";

interface Payment {
  id: string;
  patientName: string;
  paymentMethod: PaymentMethod;
  status: Exclude<PaymentStatus, "All">;
  time: string;
  date: string;
  serviceType: ServiceType;
}

interface ReceiptItem {
  name: string;
  price: number;
}

interface ReceiptDetails {
  orderId: string;
  date: string;
  items: ReceiptItem[];
  total: number;
}

// Sample data
const paymentData: Payment[] = [
  {
    id: "#AQ123D5",
    patientName: "Sarah Johnson",
    paymentMethod: "Card",
    status: "Paid",
    time: "9:00am",
    date: "10/2/2024",
    serviceType: "Home Consultation",
  },
  {
    id: "#AQ123D5",
    patientName: "Mary Udu",
    paymentMethod: "Bank Transfer",
    status: "Pending",
    time: "9:00am",
    date: "24/7/2025",
    serviceType: "Virtual Consultation",
  },
  {
    id: "#AQ123D5",
    patientName: "Michael Brown",
    paymentMethod: "Card",
    status: "Failed",
    time: "9:00am",
    date: "10/2/2024",
    serviceType: "Virtual Consultation",
  },
];

// Sample receipt data
const receiptData: ReceiptDetails = {
  orderId: "#213",
  date: "December 9, 2024",
  items: [
    { name: "Amoxicillin 500mg", price: 1000 },
    { name: "Cocodamol 500mg", price: 1000 },
  ],
  total: 2000,
};

export default function PaymentDashboard() {
  const [activeTab, setActiveTab] = useState<PaymentStatus>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [, setSelectedPayment] = useState<Payment | null>(null);

  // Filter payments based on active tab and search query
  const filteredPayments = paymentData.filter((payment) => {
    const matchesTab = activeTab === "All" || payment.status === activeTab;
    const matchesSearch =
      payment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Handle receipt view
  const handleViewReceipt = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsReceiptOpen(true);
  };

  return (
    <div className="container mx-auto p-4">
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {["All", "Paid", "Pending", "Failed"].map((status) => (
          <Button
            key={status}
            variant="outline"
            className={cn(
              "rounded-full px-8 py-2 border-2",
              activeTab === status
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-white text-emerald-800 border-gray-200"
            )}
            onClick={() => setActiveTab(status as PaymentStatus)}
          >
            {status}
          </Button>
        ))}

        {/* Search input */}
        <div className="ml-auto w-full md:w-auto mt-2 md:mt-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search"
              className="pl-10 pr-4 py-2 rounded-full w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Payments table for larger screens */}
      <div className="border rounded-lg overflow-hidden hidden md:block">
        {/* Table header */}
        <div className="grid grid-cols-7 gap-4 p-4 border-b bg-white text-emerald-800 font-medium">
          <div>Payment ID</div>
          <div>Patient's name</div>
          <div>Payment Method</div>
          <div>Status</div>
          <div>Time</div>
          <div>Date</div>
          <div>Service type</div>
        </div>

        {/* Table body */}
        {filteredPayments.length > 0 ? (
          filteredPayments.map((payment, index) => (
            <div
              key={index}
              className="grid grid-cols-7 gap-4 p-4 border-b items-center"
            >
              <div className="text-emerald-800 font-medium">{payment.id}</div>
              <div>{payment.patientName}</div>
              <div>{payment.paymentMethod}</div>
              <div>
                <span
                  className={cn(
                    "px-2 py-1 rounded-full text-sm",
                    payment.status === "Paid"
                      ? "text-emerald-600"
                      : payment.status === "Pending"
                      ? "text-amber-500"
                      : "text-red-500"
                  )}
                >
                  {payment.status}
                </span>
              </div>
              <div>{payment.time}</div>
              <div>{payment.date}</div>
              <div className="flex justify-between items-center">
                <span>{payment.serviceType}</span>
                <Button
                  variant="link"
                  className="text-emerald-600 font-medium"
                  onClick={() => handleViewReceipt(payment)}
                >
                  Receipt
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            No payments found matching your criteria.
          </div>
        )}
      </div>

      {/* Card view for mobile screens */}
      <div className="md:hidden space-y-4">
        {filteredPayments.length > 0 ? (
          filteredPayments.map((payment, index) => (
            <div key={index} className="border rounded-lg p-4 bg-white">
              <div className="flex justify-between items-center mb-2">
                <span className="text-emerald-800 font-medium">
                  {payment.id}
                </span>
                <span
                  className={cn(
                    "px-2 py-1 rounded-full text-sm",
                    payment.status === "Paid"
                      ? "text-emerald-600"
                      : payment.status === "Pending"
                      ? "text-amber-500"
                      : "text-red-500"
                  )}
                >
                  {payment.status}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Patient:</span>
                  <span>{payment.patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Method:</span>
                  <span>{payment.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Time:</span>
                  <span>{payment.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date:</span>
                  <span>{payment.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Service:</span>
                  <span>{payment.serviceType}</span>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  variant="link"
                  className="text-emerald-600 font-medium"
                  onClick={() => handleViewReceipt(payment)}
                >
                  View Receipt
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500 border rounded-lg">
            No payments found matching your criteria.
          </div>
        )}
      </div>

      {/* Receipt Dialog */}
      <Dialog open={isReceiptOpen} onOpenChange={setIsReceiptOpen}>
        <DialogContent className="max-w-md rounded-lg p-0 overflow-hidden">
          <div className="bg-gray-800 text-white p-6 rounded-t-lg">
            <div className="font-medium">Order ID {receiptData.orderId}</div>
            <div className="text-sm text-gray-300">{receiptData.date}</div>
          </div>

          <div className="p-6 flex flex-col items-center">
            <h2 className="text-emerald-600 text-xl font-medium mb-4">
              Payment Received
            </h2>
            <div className="bg-emerald-600 text-white p-4 rounded-full mb-6">
              <CheckCircle size={32} />
            </div>

            <div className="w-full">
              <h3 className="font-medium text-gray-700 mb-4">
                Receipt Details:
              </h3>

              {receiptData.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between mb-4 pb-2 border-b border-dotted border-gray-200"
                >
                  <span>{item.name}</span>
                  <span>₦ {item.price}</span>
                </div>
              ))}

              <div className="flex justify-between font-medium text-lg mt-4">
                <span>Total:</span>
                <span>₦ {receiptData.total}</span>
              </div>
            </div>

            <Button
              className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => setIsReceiptOpen(false)}
            >
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
