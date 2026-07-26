export type adminLoginRequest = {
  email: string;
  password: string;
};

export type AdminStats = {
  totalPatients: number;
  totalCaregiver: number;
  totalAppointment: number;
  totalRevenue: string;
  totalExpenses: string;
  totalBalance: number;
  adminCommissionBalance: number;
  totalPatientsBalance: string;
  totalCaregiverBalance: number;
};

export type Transaction = {
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
  wallet: {
    id: number;
    uuid: string;
    ownerId: number;
    ownerType: "MydocLab\\Models\\User";
    currencyId: number;
    balance: number;
    deletedAt: null;
    createdAt: string;
    updatedAt: string;
    owner: {
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
    };
  };
};

export type AdminRecentTransactionsResponse = {
  currentPage: number;
  data: AdminOrderHistory[]; // Array of orders
  firstPageUrl: string;
  from: number;
  lastPage: string;
  lastPageUrl: string;
  links: any[]; // Pagination links
  nextPageUrl: string;
  path: string;
  perPage: number;
  prevPageUrl: null;
  to: number;
  total: number;
};

export type AdminRecentTransactions = {
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
  wallet: {
    id: number;
    uuid: string;
    ownerId: number;
    ownerType: "MydocLab\\Models\\User";
    currencyId: number;
    balance: number;
    deletedAt: null;
    createdAt: string;
    updatedAt: string;
    owner: {
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
    };
  };
};

export type AdminRecentAppointments = {
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
  user: {
    id: string;
    firstName: string;
    lastName: string;
    profileImage: null;
    classtype: "MydocLab\\Models\\User";
    age: null;
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

export type AdminLabAppointments = {
  id: number;
  userId: number;
  diagnosisId: number;
  orderId: number;
  labTechnicianId: number;
  status: string;
  date: string;
  time: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    profileImage: string;
    classtype: "MydocLab\\Models\\User";
    age: null;
  };
  diagnosis: {
    id: number;
    name: string;
    categoryName: null;
    category: null;
  };
};

export type AdminRecentUsers = {
  id: string;
  uuid: string;
  firstName: string;
  lastName: string;
  gender: null;
  dob: null;
  email: string;
  phone: string;
  profile_image: null;
  status: string;
  emailVerifiedAt: string;
  accountId: string;
  city: string;
  state: string;
  address: string;
  bloodPressure: null;
  heightCm: null;
  weightKg: null;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
  classtype: "MydocLab\\Models\\User";
  age: null;
};

export type AdminRecentWithdraw = {
  accountName: string;
  accountNumber: string;
  bankCode: string;
  recipientCode: string;
  amount: null;
  createdAt: string;
  userName: string;
  userType: string;
};

export type AdminAllWithdraw = {
  accountName: string;
  accountNumber: string;
  bankCode: string;
  recipientCode: string;
  amount: null;
  createdAt: string;
  userName: string;
  userType: string;
};

export type AdminTransactionStats = {
  Admin: {
    credit: number;
    debit: number;
    net: number;
  };
  Doctor: {
    credit: number;
    debit: number;
    net: number;
  };
  LabTechnician: {
    credit: number;
    debit: number;
    net: number;
  };
  Pharmacy: {
    credit: number;
    debit: number;
    net: number;
  };
  User: {
    credit: number;
    debit: number;
    net: number;
  };
};

export type AdminConversations = {
  id: number;
  senderId: number;
  senderType: string;
  receiverId: number;
  receiverType: string;
  lastMessageId: number;
  senderLastSeen: null;
  receiverLastSeen: null;
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
    about: string;
    speciality: string;
    status: string;
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
  receiver: {
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
    classtype: string;
    age: number;
  };
  messages: [
    {
      id: number;
      conversationId: number;
      senderId: number;
      senderType: string;
      message: string;
      readAt: null;
      createdAt: string;
      updatedAt: string;
    }
  ];
};

export type AdminConversationsMessages = {
  id: number;
  conversationId: number;
  senderId: number;
  senderType: string;
  message: string;
  readAt: null;
  createdAt: string;
  updatedAt: string;
};

export type AdminMessageSearch = {
  name: string;
};

export type AdminMessagesStats = {
  totalConversations: number;
  totalMessages: number;
  messagesToday: number;
  activeUsersLast24h: number;
  topUsers: [
    {
      senderId: number;
      messageCount: number;
    }
  ];
};

export type AdminDoctorList = {
  id: number;
  uuid: string;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  phone: string;
  about: string;
  speciality: string;
  status: string;
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

export type AdminDoctorUpdate = {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  speciality: string;
  certifications: string;
  experience: string;
  profileImage: string;
  about: string;
};

export type AdminLabList = {
  id: number;
  uuid: string;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  phone: string;
  businessName: string;
  about: string;
  status: string;
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

export type AdminLabUpdate = {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  certifications: string;
  experience: string;
  profileImage: string;
  about: string;
};

export type AdminPharmacyList = {
  id: number;
  uuid: string;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  phone: string;
  experience?: string;
  about: string;
  status: string;
  emailVerifiedAt: string;
  certifications: string;
  worktime: null;
  profileImage: string;
  city: string;
  state: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
  speciality: string;
};

export type AdminPharmacyUpdate = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  certifications: string;
  experience: string;
  profileImage: string;
  about: string;
  status: string;
  speciality: string;
};

export type EditableAdminPharmacy = AdminPharmacyUpdate & {
  id: number | string; // Add id here
};

export type AdminPatientList = {
  id: number;
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
};

export type AdminPatientUpdate = {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
};

export type AdminPatientStats = {
  totalPatients: number;
  recentVisit: number;
  appointment: number;
};

export type AdminConsultation = {
  id: number;
  name: string;
  details: string;
  price: number;
  includeDetails: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
};

export type AdminAddConsultation = {
  name: string;
  details: string;
  price: string;
  includeDetails: string;
};

export type AdminOrderHistoryResponse = {
  currentPage: number;
  data: AdminOrderHistory[]; // Array of orders
  firstPageUrl: string;
  from: number;
  lastPage: string;
  lastPageUrl: string;
  links: any[]; // Pagination links
  nextPageUrl: string;
  path: string;
  perPage: number;
  prevPageUrl: null;
  to: number;
  total: number;
};

export type AdminOrderHistory = {
  id: number;
  userId: number;
  orderTrx: string;
  status: string;
  totalAmount: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  fullName: string;
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
  user: {
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
  };
};

export type AdminAppointments = {
  id: number;
  userId: number;
  diagnosisId: number;
  doctorId: number;
  bookingId: number;
  labTechnicianId: number;
  status: string;
  imageUrl: string;
  summary: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    classtype: "MydocLab\\Models\\User";
    age: null;
  };
  doctor: {
    id: number;
    firstName: string;
    lastName: string;
  };
  diagnosis: {
    id: number;
    name: string;
    categoryName: null;
    category: null;
  };
};

export type AdminReportsAdd = {
  userId: number;
  diagnosisId: number;
  bookingId: number;
  status: string;
  imageUrl: string;
  summary: string;
};

export type AdminReportsUpdate = {
  userId: number;
  diagnosisId: number;
  status: string;
  imageUrl: string;
  summary: string;
};

export type AdminPharmacyMedicineCategory = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type AdminPharmacyMedicineCategory = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};
