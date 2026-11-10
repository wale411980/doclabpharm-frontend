import { useEffect, useState } from "react";
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
import { useAdminOrderHistories } from "@/queries";
import type { AdminOrderHistory } from "@/types";

export default function AdminOrderHistories() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrderHistory | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Destructuring `data` from the query result
  const { data, isLoading, isError } = useAdminOrderHistories(currentPage);

  // Use `data?.data` to access the orders (since `data` is now of type AdminOrderHistoryResponse)
  const orders = data?.data ?? [];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const filteredOrders = orders.filter(
    (order: AdminOrderHistory) =>
      order.orderTrx?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      order.status?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      order.items?.some((item) =>
        item.serviceName?.toLowerCase().includes(searchTerm?.toLowerCase())
      )
  );

  const handleViewOrder = (order: AdminOrderHistory) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "refunded":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount: string | number | undefined | null) => {
    const num = typeof amount === "number" ? amount : Number(amount);
    if (isNaN(num) || num === null) return "₦0.00";
    return `₦${num.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  if (isError)
    return <div className="p-4 text-red-500">Failed to load orders.</div>;

  return (
    <div className="min-h-screen md:p-6">
      <Card className="bg-green-50/80 border-green-200 shadow-lg py-4">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-2xl font-bold text-green-900">
              Orders
            </CardTitle>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search Orders"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-green-200"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-green-200 bg-white overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow className="bg-green-50">
                    <TableHead className="text-green-900">Order ID</TableHead>
                    <TableHead className="text-green-900">Date</TableHead>
                    <TableHead className="text-green-900">Price</TableHead>
                    <TableHead className="text-green-900">Status</TableHead>
                    <TableHead className="text-green-900">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order: AdminOrderHistory) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.orderTrx}</TableCell>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
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
              {filteredOrders.map((order: AdminOrderHistory) => (
                <Card key={order.id} className="border-green-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-green-800">
                          {order.orderTrx}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleString()}
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
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredOrders.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No orders found.
              </div>
            )}
          </div>
        </CardContent>

        {/* Pagination */}
        {data?.links && (
          <div className="flex justify-center flex-wrap gap-2 py-6">
            {data.links.map((link: any, index: any) => {
              let label = link.label;

              // Normalize "Previous" and "Next"
              if (label.includes("Previous")) label = "Previous";
              else if (label.includes("Next")) label = "Next";

              const isActive = link.active;
              const isDisabled = !link.url;

              return (
                <Button
                  key={index}
                  onClick={() => {
                    if (link.url) {
                      const pageParam = new URL(link.url).searchParams.get(
                        "page"
                      );
                      if (pageParam) setCurrentPage(Number(pageParam));
                    }
                  }}
                  disabled={isDisabled}
                  variant={isActive ? "default" : "outline"}
                  className={`text-sm ${
                    isActive
                      ? "bg-green-600 text-white"
                      : "bg-white text-green-800"
                  }`}
                >
                  {label}
                </Button>
              );
            })}
          </div>
        )}
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader className="relative pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  Order ID:{" "}
                  <span className="font-medium text-green-700">
                    {selectedOrder?.orderTrx}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  {new Date(selectedOrder?.createdAt ?? "").toLocaleString()}
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
                    <span>Service Name</span>
                    <span>Price</span>
                  </div>
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center text-sm"
                    >
                      <div>
                        <span className="text-gray-900">
                          {item.serviceName}
                        </span>
                        <span className="text-gray-600 ml-2">
                          x {item.quantity}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">
                        = {formatCurrency(item.price)}
                      </span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span>{formatCurrency(selectedOrder.totalAmount)}</span>
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
