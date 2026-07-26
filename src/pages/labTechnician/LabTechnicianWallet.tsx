import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Wallet, Check, AlertTriangle, ChevronDown } from "lucide-react";
import {
  useLabTechnicianWallet,
  useSaveBankAccount,
  useWithdrawMoney,
} from "@/queries";
import type {
  LabTechnicianWalletHistories,
  BankAccount,
  Withdraw,
} from "@/types";
import { toast } from "react-toastify";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandGroup,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import nigerianBanksAndCodes from "../../../public/data/nigerianBanksAndCodes.json";

export default function LabTechnicianWallet() {
  // Dialog states
  const [showAddAccountDialog, setShowAddAccountDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [, setShowSelectAccountDialog] = useState(false);
  const [showWithdrawAmountDialog, setShowWithdrawAmountDialog] =
    useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const [bankAccount, setBankAccount] = useState<BankAccount>({
    bankName: "",
    accountName: "",
    accountNumber: 0,
    bankCode: "",
  });

  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [remarks, setRemarks] = useState("");
  const [openBankSelect, setOpenBankSelect] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [currentPage, setCurrentPage] = useState(1);

  const transactionsPerPage = 15;

  const { data: labTechnicianWallet, isLoading } = useLabTechnicianWallet();
  const { mutate: saveBankAccount, isPending: isPendingBank } =
    useSaveBankAccount();
  const { mutate: withdrawMoney, isPending: isPendingWithdraw } =
    useWithdrawMoney();

  const sortedHistories = labTechnicianWallet?.histories?.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const totalPages = Math.ceil(
    (sortedHistories?.length ?? 0) / transactionsPerPage
  );
  const paginatedHistories = sortedHistories?.slice(
    (currentPage - 1) * transactionsPerPage,
    currentPage * transactionsPerPage
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }
  if (!labTechnicianWallet) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        No wallet data available
      </div>
    );
  }

  const handleBankSelection = (selectedBank: string) => {
    const selected = nigerianBanksAndCodes.data.find(
      (bank) => bank.name === selectedBank
    );
    setBankAccount({
      ...bankAccount,
      bankName: selectedBank,
      bankCode: selected?.code ?? "",
    });
    setOpenBankSelect(false); // 👈 Close dropdown after selecting
  };

  const handleAddAccount = () => {
    setShowAddAccountDialog(true);
  };

  const handleSaveAccount = () => {
    const newErrors: Record<string, string> = {};

    if (!bankAccount.accountNumber) {
      newErrors.accountNumber = "Account number is required";
    } else if (bankAccount.accountNumber.toString().length !== 10) {
      newErrors.accountNumber = "Account number must be 10 digits";
    }

    if (!bankAccount.bankName.trim()) {
      newErrors.bankName = "Bank name is required";
    }

    if (!bankAccount.bankCode) {
      newErrors.bankName = "Bank code is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // No errors – proceed to save
    saveBankAccount(bankAccount, {
      onSuccess: () => {
        toast.success("Bank account added successfully!");
        setShowAddAccountDialog(false);
        setShowSuccessDialog(true);
      },
      onError: (error: any) => {
        const errMsg = error?.response?.data?.message;
        toast.error("Error adding bank account " + errMsg);
      },
    });
  };

  const handleSelectAccount = () => {
    setShowSelectAccountDialog(false);
    setShowWithdrawAmountDialog(true);
  };

  const handleConfirmWithdraw = () => {
    const newErrors: Record<string, string> = {};

    const amount = Number(withdrawAmount);

    if (!withdrawAmount.trim()) {
      newErrors.withdrawAmount = "Amount is required";
    } else if (isNaN(amount) || amount < 1000) {
      newErrors.withdrawAmount = "Minimum amount allowed is ₦1,000";
    }

    // If there are errors, show them and stop submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setShowWithdrawAmountDialog(false);
    setShowConfirmDialog(true);
  };

  const handleFinalConfirm = () => {
    // withdraw using mutation and show toast notification
    withdrawMoney(
      {
        amount: Number(withdrawAmount),
        remarks: remarks,
        bankAccount: bankAccount,
      } as Withdraw,
      {
        onSuccess: () => {
          toast.success("Withdrawal request submitted successfully!");
          setShowWithdrawAmountDialog(false);
          setShowSuccessDialog(true);
        },
        onError: (error: any) => {
          const errMsg = error?.response?.data?.message;
          toast.error(`Error submitting withdrawal request. ${errMsg}`);
        },
      }
    );

    // Reset form data
    setWithdrawAmount("");
    setRemarks("");
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    })
      .format(amount)
      .replace("NGN", "₦");
  };

  return (
    <>
      {/* Main Wallet Screen */}
      <div className="min-h-screen">
        <div className="space-y-6">
          {/* Header Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Available Balance Card */}
            <Card className="bg-green-700 text-white py-4">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  <CardDescription className="text-green-100">
                    Available Balance
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold mb-2">
                  ₦ {labTechnicianWallet.balance?.toLocaleString()}
                </div>
                <p className="text-green-100 text-sm">
                  Your earnings from consultations
                </p>
              </CardContent>
            </Card>

            {/* Withdraw Balance Card */}
            <Card className="bg-gray-100 py-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-gray-700">
                  Withdraw Balance
                </CardTitle>
                <CardDescription className="text-sm">
                  You can withdraw your balance to your Bank Account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  You have bound your account and can withdraw if you want
                  change your account, please go to account
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={handleSelectAccount}
                    className="bg-green-700 hover:bg-green-700"
                  >
                    Withdraw
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleAddAccount}
                    className="bg-white text-gray-700 border-gray-300"
                  >
                    Go to Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <Card className="py-4">
            <CardHeader>
              <CardTitle className="text-gray-800">
                Recent Transactions
              </CardTitle>
              <CardDescription>
                Your recent consultation payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 font-medium text-gray-600">
                        Date
                      </th>
                      <th className="text-left py-3 px-2 font-medium text-gray-600">
                        Type
                      </th>
                      <th className="text-left py-3 px-2 font-medium text-gray-600">
                        Amount
                      </th>
                      <th className="text-left py-3 px-2 font-medium text-gray-600">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedHistories?.map(
                      (transaction: LabTechnicianWalletHistories) => (
                        <tr key={transaction.id} className="border-b">
                          <td className="py-4 px-2 text-gray-700">
                            {new Date(
                              transaction.createdAt
                            ).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-2 text-gray-700">
                            {transaction.type}
                          </td>
                          <td className="py-4 px-2 text-gray-700">
                            {formatAmount(transaction.amount)}
                          </td>
                          <td className="py-4 px-2">
                            <Badge
                              variant={
                                transaction.status === "successful"
                                  ? "default"
                                  : "secondary"
                              }
                              className={
                                transaction.status === "successful"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }
                            >
                              {transaction.status}
                            </Badge>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end items-center mt-4 mb-16 space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Account Dialog */}
      <Dialog
        open={showAddAccountDialog}
        onOpenChange={(open) => {
          if (!isPendingBank) setShowAddAccountDialog(open);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="relative">
            <DialogTitle>Bank Account Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Bank Name
            </Label>
            <Popover open={openBankSelect} onOpenChange={setOpenBankSelect}>
              <PopoverTrigger asChild>
                <button
                  className="w-full border rounded-md flex items-center justify-between px-3 py-2 text-sm"
                  type="button"
                >
                  {bankAccount.bankName || "Select bank..."}
                  <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]">
                <Command>
                  <CommandInput placeholder="Search bank..." />
                  <CommandList>
                    <CommandGroup>
                      {nigerianBanksAndCodes.data.map((bank) => (
                        <CommandItem
                          key={bank.name}
                          value={bank.name}
                          onSelect={() => handleBankSelection(bank.name)}
                        >
                          {bank.name}
                          {bankAccount.bankName === bank.name && (
                            <Check className="ml-auto h-4 w-4 text-green-600" />
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {errors.bankName && (
              <p className="text-sm text-red-500">{errors.bankName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="account-number"
              className="text-sm font-medium text-gray-700"
            >
              Bank Account Number
            </Label>
            <Input
              id="account-number"
              placeholder="0000000000"
              value={bankAccount.accountNumber}
              onChange={(e) =>
                setBankAccount({
                  ...bankAccount,
                  accountNumber: Number(e.target.value),
                })
              }
            />
            {errors.accountNumber && (
              <p className="text-sm text-red-500">{errors.accountNumber}</p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowAddAccountDialog(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-green-700 hover:bg-green-700"
              onClick={handleSaveAccount}
              disabled={isPendingBank}
            >
              {isPendingBank ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  Saving...
                </>
              ) : (
                "Next"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-sm text-center">
          <div className="pt-6 pb-2">
            <div className="mx-auto w-16 h-16 bg-green-700 rounded-full flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Successful
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              Your Bank Account have been successfully added to your payment
              Methods
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowSuccessDialog(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Withdraw Amount Dialog */}
      <Dialog
        open={showWithdrawAmountDialog}
        onOpenChange={setShowWithdrawAmountDialog}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Withdraw Balance</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="withdraw-amount"
                className="text-sm font-medium text-gray-700"
              >
                Withdraw amount
              </Label>
              <Input
                id="withdraw-amount"
                placeholder="Enter amount (5,000,000 per day)"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                type="number"
              />
              {errors.withdrawAmount && (
                <p className="text-sm text-red-500">{errors.withdrawAmount}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="remarks"
                className="text-sm font-medium text-gray-700"
              >
                Remarks
              </Label>
              <Textarea
                id="remarks"
                placeholder="No more than 100 character"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                maxLength={100}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowWithdrawAmountDialog(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-green-700 hover:bg-green-700"
              onClick={handleConfirmWithdraw}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Final Confirmation Dialog */}
      <Dialog
        open={showConfirmDialog}
        onOpenChange={(open) => {
          if (!isPendingBank) setShowConfirmDialog(open);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <DialogTitle className="text-base">
                Are you sure to withdraw{" "}
                {formatAmount(Number(withdrawAmount) || 10000)}?
              </DialogTitle>
            </div>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-green-700 hover:bg-green-700"
              onClick={handleFinalConfirm}
              disabled={isPendingWithdraw}
            >
              {isPendingWithdraw ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  Processing...
                </>
              ) : (
                "Ok"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
