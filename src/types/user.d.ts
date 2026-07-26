export type User = {
  data: {
    id: string;
    uuid: string;
    firstName: string;
    lastName: string;
    gender: string;
    age: number;
    email: string;
    phone: string;
    status: "active" | "inactive";
    emailVerifiedAt: string;
    accountId: string;
    city: string;
    state: string;
    address: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: null;
    userType: string;
    dateOfBirth: string;
    profileImage: string;
    wallets: {
      id: string;
      uuid: string;
      ownerId: string;
      ownerType: "MydocLab\\Models\\User";
      currencyId: string;
      balance: number;
      deletedAt: null;
      createdAt: string;
      updatedAt: string;
    };
    transactions: [];
    classtype: string;
    profileImage: string;
    accountEmail: string;
    dataaccountId: string;
  };
};

export type UpdateUser = {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  dob: string;
  address: string;
  profile_image: string | null;
  phone: string;
};

export type Vitals = {
  bloodPressure: string;
  heightCm: string;
  weightKg: string;
};

export type UpdatePassword = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type UserDetails = {
  fullName: string;
  age: string;
  gender: string;
  complaint: string;
  urgentNotUrgent: string;
  complaintImage: string;
  doctorId: string;
  serviceType: string;
  slotId: string;
  dateOfBirth: string;
};

export type Consultations = {
  id: string;
  name: string;
  details: string;
  price: string;
  includeDetails: string;
};

export type Medicines = {
  id: number;
  name: string;
  volume: string;
  details: string;
  userId: string;
  medicineCategoryId: string;
  type: string;
  quantity: string;
  price: number;
  status: string;
  expirationDate: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
  dosage: string;
  description: string;
};

export interface Hospital {
  id: string;
  name: string;
  address: string;
  hours: string;
  rating: number;
  reviewCount: number;
  distance: number;
  services: string[];
  waitTime?: string;
  latitude: number;
  longitude: number;
}

export type Message = {
  conversationId: number;
  contactName: string;
  contactType: string;
  contactId: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: string;
  contactProfile: string;
};

export type GetMessagesConversationUser = {
  id: number;
  conversationId: number;
  senderId: number;
  senderType: string;
  message: string;
  readAt: null;
  createdAt: string;
  updatedAt: string;
  sender: {
    id: number;
    uuid: string;
    firstName: string;
    lastName: string;
    gender: string;
    email: string;
    phone: string;
    about: null;
    speciality: string;
    status: string;
    emailVerified_at: string;
    certifications: null;
    experience: null;
    profileImage: string;
    city: string;
    state: string;
    address: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: null;
  };
};

export type UserSendMessage = {
  conversationId: number;
  receiverId: number;
  receiverType: string;
  message: string;
};

export type UserWallet = {
  id: number;
  balance: number;
  ownerId: number;
  histories: [
    {
      id: number;
      walletId: number;
      amount: string;
      type: string;
      status: string;
      reference: string;
      trxNo: null;
      description: string;
      createdAt: string;
      updatedAt: string;
    }
  ];
};

export type UserWalletHistories = {
  id: number;
  walletId: number;
  amount: string;
  type: string;
  status: string;
  reference: string;
  trxNo: null;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type Amount = {
  amount: number | string;
};

export type AcceptCall = {
  call_id: number;
};

export type DeclineCall = {
  call_id: number;
  conversation_id: number;
  receiver_id: number;
  receiver_type: "Doctor";
};

export type EndCall = {
  call_id: number;
  conversation_id: number;
  receiver_id: number;
  receiver_type: "Doctor";
};

export type OrderHistory = {
  id: number;
  userId: number;
  orderTrx: string;
  status: string;
  totalAmount: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  items: [
    {
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
    }
  ];
};

export type UserLabTechnician = {
  id: number;
  uuid: string;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  phone: string;
  businessName: string;
  about: string;
  status: "active";
  emailVerifiedAt: string;
  certifications: string;
  experience: string;
  profileImage: string;
  city: string;
  state: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
};

export type UserAppointments = {
  id: number;
  userId: number;
  doctorId: number;
  serviceType: string;
  message: string;
  slotId: number;
  orderId: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
  doctor: {
    id: number;
    firstName: string;
    lastName: string;
    profileImage: string;
  };
  slot: {
    id: number;
    availableDate: string;
    availableTime: string;
  };
  consultation: {
    id: number;
    name: string;
  };
};

export type GetUserDetails = {
  id: string;
  uuid: string;
  firstName: string;
  lastName: string;
  gender: null;
  dob: string;
  email: string;
  phone: string;
  profileImage: null;
  status: "active";
  emailVerifiedAt: string;
  accountId: string;
  city: string;
  state: string;
  bloodPressure: string;
  heightCm: string;
  weightKg: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
  classtype: "MydocLab\\Models\\User";
  age: number;
  report: [];
  prescription: [
    {
      id: number;
      userId: number;
      doctorId: number;
      notes: string;
      drugs: [];
    }
  ];
};

export type LabCheckout = {
  serviceType: string;
  serviceId: number;
  labTechnicianId: number;
  date: string;
  time: string;
};

export type PharmacyCheckout = {
  serviceType: string;
  productId: number;
  qty: number;
};

export type DoctorCheckout = {
  serviceType: string;
  serviceId: number;
  doctorId: number;
  slotId: number;
  complaint: number;
};

export type SelectTest = {
  id: number;
  name: string;
  details: string;
  userId: number;
  diagnosisCategoryId: number;
  turnaround: string;
  price: number;
  groupType: string;
  status: "active";
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
  categoryName: string;
  category: {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
};

export type UserReport = {
  doctor: string;
  diagnosis: string;
  summary: string;
  status: "normal" | "abnormal" | "critical";
  imageUrl: string;
  date: string;
};

export type UserNotification = {
  id: string;
  type: "MydocLab\\Notifications\\OrderItemStatus";
  notifiableType: "MydocLab\\Models\\User";
  notifiableId: number;
  data: {
    orderItemIds: number;
    status: string;
    message: string;
  };
  readAt: null;
  createdAt: string;
  updatedAt: string;
};

export type UserVitalsDetails = {
  id: string;
  uuid: string;
  firstName: string;
  lastName: string;
  gender: string;
  dob: string;
  email: string;
  phone: string;
  profileImage: string;
  status: string;
  emailVerifiedAt: string;
  accountId: string;
  city: string;
  state: string;
  address: string;
  bloodPressure: string;
  heightCm: string;
  weightKg: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
  classtype: "MydocLab\\Models\\User";
  age: number;
  wallets: {
    id: number;
    uuid: string;
    ownerId: number;
    ownerType: "MydocLab\\Models\\User";
    currencyId: number;
    balance: number;
    deletedAt: null;
    createdAt: string;
    updatedAt: string;
  };
};

export type UserNotes = {
  id: number;
  callId: number;
  authorId: number;
  authorType: "MydocLab\\Models\\Doctor";
  userId: number;
  note: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: number;
    firstName: string;
    lastName: string;
  };
};
