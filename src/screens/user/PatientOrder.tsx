import { useState } from "react";
import { Search, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { useGetUserOrderHistory } from "@/queries";
import type { OrderHistory } from "@/types";

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<OrderHistory | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  const { data: orders, isLoading } = useGetUserOrderHistory();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  const filteredOrders = (orders ?? [])
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .filter((order: OrderHistory) => {
      const search = searchTerm.toLowerCase();
      return (
        order.orderTrx?.toLowerCase().includes(search) ||
        order.status?.toLowerCase().includes(search) ||
        order.totalAmount?.toString().includes(search)
      );
    });

  const totalPages = Math.ceil(filteredOrders.length / pageSize);

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleViewOrder = (order: OrderHistory) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "Pending":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100";
      case "Failed":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const formatCurrency = (amount: string | number | undefined | null) => {
    const num = typeof amount === "number" ? amount : Number(amount);
    if (isNaN(num) || num === null) {
      return "₦0.00";
    }
    return `₦${num.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className="min-h-screen md:p-6">
      <div className="">
        <Card className="bg-green-50/80 border-green-200 shadow-lg py-4">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="text-2xl font-bold text-green-900">
                My Orders
              </CardTitle>
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  placeholder="Search Orders"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10 bg-white border-green-200 focus:border-green-400 focus:ring-green-400"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-green-200 bg-white overflow-hidden">
              {/* Desktop Table View */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-green-50">
                      <TableHead className="font-semibold text-green-900">
                        Order ID
                      </TableHead>
                      <TableHead className="font-semibold text-green-900">
                        Date & Time
                      </TableHead>
                      <TableHead className="font-semibold text-green-900">
                        Price
                      </TableHead>
                      <TableHead className="font-semibold text-green-900">
                        Status
                      </TableHead>
                      <TableHead className="font-semibold text-green-900">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedOrders.map((order) => (
                      <TableRow key={order.id} className="hover:bg-green-50/50">
                        <TableCell className="font-medium text-green-800">
                          {order.orderTrx}
                        </TableCell>
                        <TableCell className="text-gray-700">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="font-semibold text-gray-900">
                          {formatCurrency(order.totalAmount)}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewOrder(order)}
                            className="bg-white border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4 p-4">
                {paginatedOrders.map((order) => (
                  <Card key={order.id} className="border-green-200">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-green-800">
                            {order.id}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {order.createdAt}
                          </p>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-lg">
                          {formatCurrency(order.totalAmount)}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewOrder(order)}
                          className="bg-white border-green-300 text-green-700 hover:bg-green-50"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {paginatedOrders.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No orders found matching your search.
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                >
                  Previous
                </Button>
                <div className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader className="relative">
            <div className="flex justify-between items-start pt-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  Order ID:{" "}
                  <span className="font-medium text-green-700">
                    {selectedOrder?.orderTrx}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  {new Date(
                    selectedOrder?.createdAt ?? ""
                  ).toLocaleDateString()}
                </p>
              </div>
              <Badge
                className={
                  selectedOrder ? getStatusColor(selectedOrder.status) : ""
                }
              >
                {selectedOrder?.status}
              </Badge>
            </div>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              <Separator />

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Items</h3>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-medium text-gray-700">
                    <span>Service Name:</span>
                    <span>Prices:</span>
                  </div>

                  {selectedOrder?.items?.map(
                    (drug: {
                      id: number;
                      orderId: number;
                      serviceType: string;
                      serviceId: number;
                      giverId: number;
                      quantity: number;
                      price: string;
                      status: string;
                      createdAt: string;
                      updatedAt: string;
                      serviceName: string;
                    }) => (
                      <div
                        key={drug.id}
                        className="flex justify-between items-center text-sm"
                      >
                        <div className="flex-1">
                          <span className="text-gray-900">
                            {drug.serviceName}
                          </span>
                          <span className="text-gray-600 ml-2">
                            x {drug.quantity}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">
                          = {formatCurrency(drug.price)}
                        </span>
                      </div>
                    )
                  )}

                  <Separator />

                  <div className="flex justify-between items-center font-semibold">
                    <span>Total:</span>
                    <span className="text-lg">
                      = {formatCurrency(selectedOrder.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
