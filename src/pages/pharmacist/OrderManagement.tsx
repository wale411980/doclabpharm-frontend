import { useState, useEffect } from "react";
import {
  Search,
  User,
  Calendar,
  Clock,
  Package,
  MapPin,
  Copy,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "react-toastify";

import {
  useGetPharmacyOrders,
  useApprovePharmacyOrder,
  useApprovePharmacyOrderIndividually,
  useGetPharmacyOrderById,
} from "@/queries/use-pharmacy";

import type { PharmacyOrderItem } from "@/types";

export default function OrderManagement() {
  const {
    data: orders,
    isLoading: loadingOrders,
    error,
    refetch,
  } = useGetPharmacyOrders();
  const [activeTab, setActiveTab] = useState<string>("processed");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelTarget, setCancelTarget] = useState<{
    type: "order" | "item";
    id: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const ORDERS_PER_PAGE = 15;

  const {
    data: orderDetails,
    refetch: refetchOrderDetails,
    isLoading: loadingDetails,
  } = useGetPharmacyOrderById(selectedOrderId!, {
    enabled: !!selectedOrderId,
  });

  const { mutate: approveOrder } = useApprovePharmacyOrder();
  const { mutate: approveOrderIndividually } =
    useApprovePharmacyOrderIndividually();

  useEffect(() => {
    if (dialogOpen && selectedOrderId) {
      refetchOrderDetails();
    }
  }, [dialogOpen, selectedOrderId, refetchOrderDetails]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  if (loadingOrders)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Error loading orders
      </div>
    );

  const filteredOrders = Array.isArray(orders)
    ? orders.filter((order) => {
        const matchesStatus = order.items.some(
          (item: PharmacyOrderItem) => item.status === activeTab
        );
        const matchesSearch =
          order.user.firstName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          order.orderTrx.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && (searchQuery === "" || matchesSearch);
      })
    : [];

  const sortedFilteredOrders = filteredOrders.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const totalPages = Math.ceil(sortedFilteredOrders.length / ORDERS_PER_PAGE);

  const paginatedOrders = sortedFilteredOrders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE
  );

  const handleViewDetails = (orderId: number) => {
    setSelectedOrderId(orderId);
    setDialogOpen(true);
  };

  const handleStatusChange = (orderId: number) => {
    setIsLoading(true); // Start loading
    approveOrder(
      {
        orderId,
        payload: { reason: "no reason", status: "completed" },
      },
      {
        onSuccess: () => {
          refetch();
          setDialogOpen(false);
          setActiveTab("completed");
          toast.success("Order approved successfully");
          setIsLoading(false); // Stop loading
        },
        onError: (error: any) => {
          const errMsg = error?.response?.data?.message;
          toast.error("Failed to approve order. " + errMsg);
          setIsLoading(false); // Stop loading on error
        },
      }
    );
  };

  const handleStatusChangeIndividually = (itemId: number) => {
    setIsLoading(true); // Start loading
    approveOrderIndividually(
      {
        itemId,
        payload: { reason: "no reason", status: "completed" },
      },
      {
        onSuccess: () => {
          refetch();
          setDialogOpen(false);
          setActiveTab("completed");
          toast.success("Order approved successfully");
          setIsLoading(false); // Stop loading
        },
        onError: (error: any) => {
          const errMsg = error?.response?.data?.message;
          toast.error("Failed to approve order. " + errMsg);
          setIsLoading(false); // Stop loading on error
        },
      }
    );
  };

  const onCancelClick = (type: "order" | "item", id: number) => {
    setCancelTarget({ type, id });
    setCancelDialogOpen(true);
    setCancelReason(""); // reset reason field
  };

  const confirmCancellation = () => {
    if (!cancelTarget) return;

    const payload = {
      reason: cancelReason,
      status: "cancelled",
    };

    if (cancelTarget.type === "order") {
      setIsLoading(true); // Start loading
      approveOrder(
        {
          orderId: cancelTarget.id,
          payload,
        },
        {
          onSuccess: () => {
            refetch();
            setCancelDialogOpen(false);
            setActiveTab("cancelled");
            toast.success("Order cancelled successfully");
            setIsLoading(false); // Stop loading
          },
          onError: (error: any) => {
            const errMsg = error?.response?.data?.message;
            toast.error("Failed to approve order. " + errMsg);
            setIsLoading(false); // Stop loading on error
          },
        }
      );
    } else {
      setIsLoading(true); // Start loading
      approveOrderIndividually(
        {
          itemId: cancelTarget.id,
          payload,
        },
        {
          onSuccess: () => {
            refetch();
            setCancelDialogOpen(false);
            setActiveTab("cancelled");
            toast.success("Order cancelled successfully");
            setIsLoading(false); // Stop loading
          },
          onError: (error: any) => {
            const errMsg = error?.response?.data?.message;
            toast.error("Failed to approve order. " + errMsg);
            setIsLoading(false); // Stop loading on error
          },
        }
      );
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success("Copied"))
      .catch(() => toast.error("Failed to copy"));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "processed":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold text-[#005e41] mb-4">Manage Orders</h1>

      {/* Tabs + Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
            {["processed", "completed", "cancelled"].map((status) => (
              <TabsTrigger
                key={status}
                value={status}
                className="data-[state=active]:bg-[#005e41] data-[state=active]:text-white capitalize"
              >
                {status}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="relative w-full md:w-[300px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name or order number"
            className="pl-10 border-gray-200 rounded-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedOrders.map((order) => (
          <Card
            key={order.id}
            className="hover:shadow-lg transition-shadow duration-200 border-0 shadow-md py-4"
          >
            {/* Header with User Info */}
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 ring-2 ring-[#005e41]/10">
                    <AvatarImage
                      src="/placeholder.svg"
                      alt={order.user.firstName}
                    />
                    <AvatarFallback className="bg-[#005e41] text-white">
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-[#005e41] text-lg">
                      {order.user.firstName} {order.user.lastName}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-gray-500 font-mono">
                      <span>{order.user.phone}</span>
                      <button
                        onClick={() => handleCopy(order.user.phone)}
                        className="text-gray-400 hover:text-[#005e41]"
                        aria-label="Copy phone"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-sm text-gray-500 font-mono">
                      #{order.orderTrx}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {order.items.length} items
                </Badge>
              </div>

              {/* Address and Date Info */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="truncate">{order.user.address}</span>
                  <button
                    onClick={() => handleCopy(order.user.address)}
                    className="ml-1 text-gray-500 hover:text-[#005e41]"
                    aria-label="Copy address"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZone: "UTC",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              {/* Items Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <Package className="h-4 w-4 text-[#005e41]" />
                  <span className="font-medium text-[#005e41]">Drugs</span>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 space-y-3 max-h-48 overflow-y-auto">
                  {order.items.map((item: PharmacyOrderItem, index: number) => (
                    <div key={item.id}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {item.medicine.name}
                          </p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-xs text-gray-500">
                              Qty: {item.quantity}
                            </span>
                            <span className="text-xs font-medium text-[#005e41]">
                              ₦{Number.parseFloat(item.price).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 ml-3">
                          <Badge
                            variant="outline"
                            className={`text-xs ${getStatusColor(item.status)}`}
                          >
                            {item.status}
                          </Badge>

                          {item.status === "processed" && (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                className="h-6 px-2 text-xs bg-[#005e41] hover:bg-[#004d35]"
                                onClick={() =>
                                  handleStatusChangeIndividually(
                                    Number(item.id)
                                  )
                                }
                                disabled={isLoading}
                              >
                                {isLoading ? "..." : "✓"}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 px-2 text-xs border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                                onClick={() =>
                                  onCancelClick("item", Number(item.id))
                                }
                              >
                                ✕
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                      {index < order.items.length - 1 && (
                        <Separator className="mt-3" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Total Amount */}
                <div className="flex justify-between items-center pt-3 border-t">
                  <span className="font-semibold text-gray-700">
                    Total Amount
                  </span>
                  <span className="text-xl font-bold text-[#005e41]">
                    ₦{Number.parseFloat(order.totalAmount).toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>

            {/* Footer with Action Buttons */}
            <CardFooter className="pt-4 border-t bg-gray-50/50">
              <div className="flex gap-2 w-full">
                <Button
                  variant="outline"
                  onClick={() => handleViewDetails(order.id)}
                  className="flex-1 text-[#005e41] border-[#005e41] hover:bg-[#005e41] hover:text-white transition-colors"
                >
                  View Details
                </Button>

                {activeTab === "processed" && (
                  <>
                    <Button
                      className="flex-1 bg-[#005e41] hover:bg-[#004d35]"
                      onClick={() => handleStatusChange(order.id)}
                      disabled={isLoading}
                    >
                      {isLoading ? "Processing..." : "Approve All"}
                    </Button>
                    <Button
                      variant="outline"
                      className="px-3 border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                      onClick={() => onCancelClick("order", order.id)}
                    >
                      Cancel
                    </Button>
                  </>
                )}

                {activeTab === "completed" && (
                  <Button disabled className="flex-1 bg-green-500 text-white">
                    ✓ Completed
                  </Button>
                )}

                {activeTab === "cancelled" && (
                  <Button disabled className="flex-1 bg-red-500 text-white">
                    ✕ Cancelled
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </Button>

          {[...Array(totalPages)].map((_, i) => (
            <Button
              key={i}
              variant={i + 1 === currentPage ? "default" : "outline"}
              onClick={() => setCurrentPage(i + 1)}
              className="px-3"
            >
              {i + 1}
            </Button>
          ))}

          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Order Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Details</DialogTitle>
          </DialogHeader>

          {loadingDetails ? (
            <div>Loading details...</div>
          ) : orderDetails ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src="/placeholder.svg"
                    alt={orderDetails.user.firstName}
                  />
                  <AvatarFallback>
                    <User className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-lg">
                    {orderDetails.user.firstName} {orderDetails.user.lastName}
                  </h3>

                  <p className="text-sm text-gray-500">
                    Order no: {orderDetails.orderTrx}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Delivery Info</h4>
                <p className="text-sm">{orderDetails.user.address}</p>
                <p className="text-sm mt-2">
                  {new Date(orderDetails.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Items</h4>
                <div className="grid grid-cols-3 text-sm font-medium border-b pb-2 mb-2">
                  <span>Name</span>
                  <span className="text-center">Qty</span>
                  <span className="text-right">Price</span>
                </div>
                {orderDetails.items.map((item: PharmacyOrderItem) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-3 text-sm py-2 border-b"
                  >
                    <span>{item.medicine.name}</span>
                    <span className="text-center">{item.quantity}</span>
                    <span className="text-right">
                      ₦{parseFloat(item.price).toLocaleString()}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between font-medium mt-4">
                  <span>Total</span>
                  <span className="text-[#005e41] font-bold">
                    ₦{parseFloat(orderDetails.totalAmount).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div>No details found.</div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reason for Cancellation</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Enter cancellation reason"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setCancelDialogOpen(false)}
              >
                Close
              </Button>
              <Button
                onClick={confirmCancellation}
                className="bg-red-500 text-white hover:bg-red-600"
                disabled={!cancelReason.trim() || isLoading}
              >
                {isLoading ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
