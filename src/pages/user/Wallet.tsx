import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownLeft,
  Shield,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useGetUserWallet, useUserGeneratePayment } from "@/queries";
import type { UserWalletHistories } from "@/types";
// import type { UserWallet } from "@/types"

export default function Wallet() {
  const { data } = useGetUserWallet();
  const { mutate: generatePayment } = useUserGeneratePayment();

  const [showBalance, setShowBalance] = useState(true);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [loading, setLoading] = useState(false);
  const [amountRaw, setAmountRaw] = useState<number | string>(""); // e.g., "6000"
  const [amountFormatted, setAmountFormatted] = useState(""); // e.g., "6,000"

  const currentBalance = data?.balance ?? 0;
  const transactions = data?.histories || [];

  const filteredTransactions = transactions.filter(
    (transaction: UserWalletHistories) => {
      const matchesCategory =
        selectedCategory === "all" ||
        (transaction.type || "uncategorized") === selectedCategory;

      const matchesStatus =
        selectedStatus === "all" || transaction.status === selectedStatus;

      return matchesCategory && matchesStatus;
    }
  );

  const totalIn = filteredTransactions
    .filter(
      (t: UserWalletHistories) =>
        t.type === "credit" && t.status === "successful"
    )
    .reduce(
      (sum: number, t: UserWalletHistories) => sum + parseFloat(t.amount),
      0
    );

  const totalOut = filteredTransactions
    .filter(
      (t: UserWalletHistories) =>
        t.type === "debit" && t.status === "successful"
    )
    .reduce(
      (sum: number, t: UserWalletHistories) => sum + parseFloat(t.amount),
      0
    );

  const formatAmount = (value: string) => {
    // Remove non-numeric characters except for the decimal point
    const cleanedValue = value.replace(/[^\d.]/g, "");

    // If there's no input or it's just a decimal point, return empty
    if (!cleanedValue) return "";

    // Convert string to number and format it with commas
    const formattedValue = Number(cleanedValue).toLocaleString();

    // If the number has decimals, we want to handle them
    return formattedValue;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const raw = input.replace(/[^\d.]/g, ""); // keep only digits and decimals
    setAmountRaw(raw);
    setAmountFormatted(formatAmount(raw));
  };

  function formatCurrency(amountRaw: number): string {
    return `₦${amountRaw.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
    })}`;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "successful":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "failed":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const handleTopUp = () => {
    if (!amountRaw || Number(amountRaw) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    setLoading(true);

    generatePayment(
      {
        amount: amountRaw, // ✅ Send raw value without commas
      },
      {
        onSuccess: (response: any) => {
          const url =
            response.authorizationUrl || response?.data?.authorizationUrl;

          // ✅ Reset the amount fields before redirect
          setAmountRaw("");
          setAmountFormatted("");

          if (response.status === "success" && url) {
            window.location.href = url;
          } else {
            alert("Failed to initialize payment.");
          }

          setLoading(false);
        },
        onError: (error: any) => {
          const errMsg = error?.response?.data?.message;
          alert("Something went wrong while initializing payment. " + errMsg);

          // Optional reset on error
          setAmountRaw("");
          setAmountFormatted("");

          setLoading(false);
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Balance Card */}
        <Card className="py-4">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Available Balance
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBalance(!showBalance)}
                className="h-8 w-8 p-0"
              >
                {showBalance ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="text-2xl md:text-3xl font-bold">
                  {showBalance ? formatCurrency(currentBalance) : "₦••••••••"}
                </div>
              </div>
              <Button
                onClick={() => setShowTopUpModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
              >
                Top-Up
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Card */}
        <Card className="py-4">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-semibold">
                  Recent Transactions
                </CardTitle>
                <p className="text-sm text-gray-600">
                  view your transactions history
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="credit">Credit</SelectItem>
                    <SelectItem value="debit">Debit</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="w-full sm:w-[120px]">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="successful">Successful</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Summary */}
            <div className="flex justify-between items-center mb-6 text-sm gap-4">
              <span>
                In:{" "}
                <span className="font-medium">{formatCurrency(totalIn)}</span>
              </span>
              <span>
                Out:{" "}
                <span className="font-medium">{formatCurrency(totalOut)}</span>
              </span>
            </div>

            {/* Transactions List */}
            <div className="space-y-3">
              {filteredTransactions.map((transaction: UserWalletHistories) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        transaction.type === "credit"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {transaction.type === "credit" ? (
                        <ArrowDownLeft className="h-4 w-4" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-sm">
                        {transaction.type}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(transaction.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`font-medium ${
                        transaction.type === "credit"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "credit" ? "+" : "-"}
                      {formatCurrency(Number(transaction.amount))}
                    </div>
                    <Badge
                      variant="secondary"
                      className={`text-xs capitalize ${getStatusColor(
                        transaction.status
                      )}`}
                    >
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top-Up Modal */}
        <Dialog open={showTopUpModal} onOpenChange={setShowTopUpModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">
                Top Up
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amountRaw" className="text-sm font-medium">
                  Amount to Top Up
                </Label>
                <Input
                  id="amount"
                  placeholder="Enter amount"
                  value={amountFormatted}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <Shield className="h-3 w-3" />
                <span>Secured by paystack</span>
                <div className="flex gap-1">
                  <CreditCard className="h-3 w-3" />
                  <CreditCard className="h-3 w-3" />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowTopUpModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  disabled={loading}
                  onClick={handleTopUp}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {/* Next */}
                  {loading ? "Redirecting..." : "Fund Wallet"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
