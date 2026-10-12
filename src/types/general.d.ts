export type BankAccount = {
  // digits only, kept as a string so a leading 0 is not lost
  accountNumber: string;
  bankCode: string;
  accountName: string;
  bankName: string;
};

export type Withdraw = {
  amount: number;
};

export type ReadMessage = {
  conversationId: number;
};

export type DeviceTokenType = {
  deviceToken: string;
  deviceType: "web";
};

export type SpecializationList = {
  id: number;
  name: string;
  description: string;
  createdAt: string;
};
