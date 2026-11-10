import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  TrendingUp,
  CurrencyIcon as Naira,
  Clock,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useSuperAdminAllWithdraw,
  useSuperAdminTransactionStats,
  useSuperAdminAllTransactions,
} from "@/queries";
import { format } from "date-fns";

export default function SuperAdminPayment() {
  const [activeTab, setActiveTab] = useState("Withdrawal");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: withdrawalData, isLoading: withdrawalLoading } =
    useSuperAdminAllWithdraw();
  const { data: stats } = useSuperAdminTransactionStats();
  const { data: transactionData, isLoading } =
    useSuperAdminAllTransactions(currentPage);

  const pagedData =
    activeTab === "Withdrawal" ? withdrawalData : transactionData?.data ?? [];
  const totalPages = transactionData?.lastPage || 1;
  const current = transactionData?.currentPage || 1;

  const filteredData = useMemo(() => {
    return pagedData?.filter((item: any) => {
      const created = new Date(item.createdAt);
      const matchesSearch = searchQuery
        ? activeTab === "Withdrawal"
          ? item?.userType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item?.userName?.toLowerCase().includes(searchQuery.toLowerCase())
          : `${item?.wallet?.owner?.firstName ?? ""} ${
              item?.wallet?.owner?.lastName ?? ""
            }`
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
        : true;
      const fromDate = dateFrom ? new Date(dateFrom) : null;
      const toDate = dateTo ? new Date(dateTo) : null;
      if (toDate) toDate.setDate(toDate.getDate() + 1);
      const matchesFrom = fromDate ? created >= fromDate : true;
      const matchesTo = toDate ? created < toDate : true;
      return matchesSearch && matchesFrom && matchesTo;
    });
  }, [pagedData, searchQuery, dateFrom, dateTo, activeTab]);

  const formatAmount = (amount: number) => {
    return `₦${amount?.toLocaleString()}`;
  };

  const renderPageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (current <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (current >= totalPages - 3) {
        pages.push(
          1,
          "...",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          current - 1,
          current,
          current + 1,
          "...",
          totalPages
        );
      }
    }
    return pages;
  }, [current, totalPages]);

  if (isLoading || withdrawalLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Monitor and manage Transactions and withdrawal transactions
          </h1>
        </div>
        {/* Tabs */}
        <div className="flex space-x-1 rounded-lg bg-gray-100 p-1 w-fit mx-auto sm:mx-0">
          <Button
            variant={activeTab === "Transactions" ? "default" : "ghost"}
            className={`rounded-md px-4 py-2 text-sm font-medium ${
              activeTab === "Transactions"
                ? "bg-green-700 text-white shadow-sm hover:bg-green-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => setActiveTab("Transactions")}
          >
            Transactions
          </Button>
          <Button
            variant={activeTab === "Withdrawal" ? "default" : "ghost"}
            className={`rounded-md px-4 py-2 text-sm font-medium ${
              activeTab === "Withdrawal"
                ? "bg-green-700 text-white shadow-sm hover:bg-green-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => setActiveTab("Withdrawal")}
          >
            Withdrawal
          </Button>
        </div>
        {/* Stats Cards */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {activeTab === "Withdrawal" ? (
            <>
              <Card className="bg-green-700 text-white py-4">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Withdrawals
                  </CardTitle>
                  <TrendingUp className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                </CardContent>
              </Card>
              <Card className="bg-green-700 text-white py-4">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Amount
                  </CardTitle>
                  <Naira className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₦120,050</div>
                </CardContent>
              </Card>
              <Card className="bg-green-700 text-white py-4">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  <Clock className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4</div>
                </CardContent>
              </Card>
              <Card className="bg-green-700 text-white py-4">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Completed
                  </CardTitle>
                  <CheckCircle className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">10</div>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card className="bg-green-700 text-white py-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Patient Transactions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Credit</span>
                    <span>₦ {stats?.User.credit}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Debit</span>
                    <span>₦ {stats?.User.debit}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold border-t border-green-500 pt-1">
                    <span>Net</span>
                    <span>₦ {stats?.User.net}</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-green-700 text-white py-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Doctor Transactions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Credit</span>
                    <span>₦ {stats?.Doctor.credit}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Debit</span>
                    <span className="text-white">₦ {stats?.Doctor.debit}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold border-t border-green-500 pt-1">
                    <span>Net</span>
                    <span className="text-white">₦ {stats?.Doctor.net}</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-green-700 text-white py-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pharmacist Transactions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Credit</span>
                    <span>₦ {stats?.Pharmacy.credit}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Debit</span>
                    <span className="text-white">
                      ₦ {stats?.Pharmacy.debit}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold border-t border-green-500 pt-1">
                    <span>Net</span>
                    <span className="text-white">₦ {stats?.Pharmacy.net}</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-green-700 text-white py-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Test Transactions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Credit</span>
                    <span>₦ {stats?.LabTechnician.credit}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Debit</span>
                    <span className="text-white">
                      ₦ {stats?.LabTechnician.debit}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold border-t border-green-500 pt-1">
                    <span>Net</span>
                    <span className="text-white">
                      ₦ {stats?.LabTechnician.net}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
        {/* Filters and Search */}
        <div className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center w-full md:w-auto">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder={
                    activeTab === "Withdrawal"
                      ? "Search by user type or name"
                      : "Search by patient name"
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full sm:w-fit bg-transparent"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
          {/* Enhanced Filters for Transactions Tab */}
          {activeTab === "Transactions" && (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
              <div className="space-y-2">
                <label
                  htmlFor="dateFrom"
                  className="text-sm font-medium text-gray-600"
                >
                  Date From
                </label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="dateTo"
                  className="text-sm font-medium text-gray-600"
                >
                  Date To
                </label>
                <Input
                  id="dateTo"
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>
        {/* Transaction/Withdrawal History Table */}
        <Card className="py-4">
          <CardHeader>
            <CardTitle>
              {activeTab === "Withdrawal"
                ? "Withdrawal History"
                : "Transaction History"}
            </CardTitle>
            <CardDescription>
              {activeTab === "Withdrawal"
                ? "View and monitor all Withdrawal transactions"
                : "View and monitor all financial transactions"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    {activeTab === "Withdrawal" ? (
                      <>
                        <TableHead>Care-Giver</TableHead>
                        <TableHead className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            Amount
                          </div>
                        </TableHead>
                        {/* <TableHead>Status</TableHead> */}
                      </>
                    ) : (
                      <>
                        <TableHead>Patient</TableHead>
                        <TableHead className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            Amount
                          </div>
                        </TableHead>
                        {/* <TableHead>Status</TableHead> */}
                      </>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData?.map((item: any) => (
                    <TableRow key={item.recipientcode || item.id}>
                      {" "}
                      {/* Added item.id as fallback key */}
                      <TableCell className="font-medium">
                        {item?.createdAt &&
                        !isNaN(new Date(item.createdAt).getTime())
                          ? format(new Date(item.createdAt), "dd/MM/yyyy")
                          : "Invalid date"}
                      </TableCell>
                      {activeTab === "Withdrawal" ? (
                        <>
                          <TableCell>{item.userName}</TableCell>
                          <TableCell className="text-right font-medium">
                            {formatAmount(item.amount)}
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell>{`${item?.wallet.owner?.firstName} ${item?.wallet.owner?.lastName}`}</TableCell>
                          <TableCell className="text-right font-medium">
                            {formatAmount(item.amount)}
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {/* Pagination */}
            <div className="flex justify-center gap-2 pt-6 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                disabled={current === 1}
                onClick={() => setCurrentPage(current - 1)}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              {renderPageNumbers.map((p, idx) =>
                p === "..." ? (
                  <span key={idx} className="px-2 text-gray-500 text-sm">
                    ...
                  </span>
                ) : (
                  <Button
                    key={idx}
                    size="sm"
                    variant={p === current ? "default" : "outline"}
                    className={p === current ? "bg-green-700 text-white" : ""}
                    onClick={() => setCurrentPage(Number(p))}
                  >
                    {p}
                  </Button>
                )
              )}
              <Button
                variant="outline"
                size="sm"
                disabled={current === totalPages}
                onClick={() => setCurrentPage(current + 1)}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
