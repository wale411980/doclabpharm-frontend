import { useState, useMemo } from "react";
import { Calendar, Clock, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdminAllTransactions } from "@/queries";
import { format } from "date-fns";

export default function AdminTransactions() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: recentTransactions, isLoading: isRecentTransactionsLoading } =
    useAdminAllTransactions(currentPage);

  const pagedData = recentTransactions?.data ?? [];
  const totalPages = recentTransactions?.lastPage || 1;
  const current = recentTransactions?.currentPage || 1;

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

  if (isRecentTransactionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  const transactionsArray = pagedData;

  const filteredTransactions = transactionsArray.filter((transaction: any) => {
    const transactionDate = new Date(transaction.createdAt);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate
      ? new Date(new Date(endDate).setHours(23, 59, 59, 999))
      : null;

    return (
      (!start || transactionDate >= start) && (!end || transactionDate <= end)
    );
  });

  return (
    <Card className="py-4">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-gray-600" />
          <CardTitle className="text-lg">All Transactions</CardTitle>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 items-center">
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <button
            onClick={() => {
              setStartDate("");
              setEndDate("");
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700"
          >
            Reset
          </button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {filteredTransactions?.map((transaction: any) => (
            <div
              key={transaction.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-4 last:border-b-0 gap-2"
            >
              {/* Left info block */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="rounded-full bg-green-100 p-2 shrink-0">
                  <Plus className="h-4 w-4 text-green-600" />
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {transaction.reference}
                  </div>
                  <div className="text-sm text-gray-600 truncate">
                    {transaction.trxNo}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="h-3 w-3" />
                    {format(new Date(transaction.createdAt), "dd/MM/yyyy")}
                  </div>
                </div>
              </div>

              {/* Transaction Type */}
              <div className="text-right sm:w-32">
                <span
                  className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                    transaction.type === "credit"
                      ? "bg-green-100 text-green-700"
                      : transaction.type === "debit"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {transaction.type}
                </span>
              </div>

              {/* Transaction Amount */}
              <div className="font-semibold text-gray-900 text-right sm:w-32">
                {transaction.amount}
              </div>
            </div>
          ))}
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
  );
}
