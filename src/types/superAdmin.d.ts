export type SuperAdminStats = {
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

export type SuperAdminTransaction = {
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

export type SuperAdminRecentTransactionsResponse = {
  currentPage: number;
  data: SuperAdminOrderHistory[]; // Array of orders
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

export type SuperAdminRecentTransactions = {
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

export type SuperAdminRecentAppointments = {
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

export type SuperAdminLabAppointments = {
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

export type SuperAdminRecentUsers = {
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

export type SuperAdminRecentWithdraw = {
  accountName: string;
  accountNumber: string;
  bankCode: string;
  recipientCode: string;
  amount: null;
  createdAt: string;
  userName: string;
  userType: string;
};

export type SuperAdminAllWithdraw = {
  accountName: string;
  accountNumber: string;
  bankCode: string;
  recipientCode: string;
  amount: null;
  createdAt: string;
  userName: string;
  userType: string;
};

export type SuperAdminTransactionStats = {
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

export type SuperAdminConversations = {
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

export type SuperAdminConversationsMessages = {
  id: number;
  conversationId: number;
  senderId: number;
  senderType: string;
  message: string;
  readAt: null;
  createdAt: string;
  updatedAt: string;
};

export type SuperAdminMessageSearch = {
  name: string;
};

export type SuperAdminMessagesStats = {
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

export type SuperAdminDoctorList = {
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

export type SuperAdminDoctorUpdate = {
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
  status: string;
};

export type SuperAdminLabList = {
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

export type SuperAdminLabUpdate = {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  certifications: string;
  experience: string;
  profileImage: string;
  about: string;
  status: string;
};

export type SuperAdminPharmacyList = {
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

export type SuperAdminPharmacyUpdate = {
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
  status: string;
};

export type EditableSuperAdminPharmacy = SuperAdminPharmacyUpdate & {
  id: number | string; // Add id here
};

export type SuperAdminPatientList = {
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

export type SuperAdminPatientUpdate = {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
};

export type SuperAdminPatientStats = {
  totalPatients: number;
  recentVisit: number;
  appointment: number;
};

export type SuperAdminConsultation = {
  id: number;
  name: string;
  details: string;
  price: number;
  includeDetails: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
};

export type SuperAdminAddConsultation = {
  name: string;
  details: string;
  price: string;
  includeDetails: string;
};

export type SuperAdminOrderHistoryResponse = {
  currentPage: number;
  data: SuperAdminOrderHistory[]; // Array of orders
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

export type SuperAdminOrderHistory = {
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

export type SuperAdminAppointments = {
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

export type SuperAdminReportsAdd = {
  userId: number;
  diagnosisId: number;
  bookingId: number;
  status: string;
  imageUrl: string;
  summary: string;
};

export type SuperAdminReportsUpdate = {
  userId: number;
  diagnosisId: number;
  status: string;
  imageUrl: string;
  summary: string;
};

export type SuperAdminPharmacyMedicineCategory = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type SuperAdminPharmacyMedicineCategory = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type SuperAdminAdminList = {
  id: number;
  uuid: string;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  phone: string;
  about: string;
  password: string;
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

export type SuperAdminListResponse = {
  currentPage: number;
  data: SuperAdminAdminList[]; // the array of admins
  firstPageUrl: string;
  from: number;
  lastPage: number;
  lastPageUrl: string;
  links: any[]; // pagination links
  nextPageUrl: string;
  path: string;
  perPage: number;
  prevPageUrl: null;
  to: number;
  total: number;
};

export type SuperAdminListAPIResponse = {
  status: string;
  data: SuperAdminListResponse;
  message: string;
};

export type SuperAdminAdminUpdate = {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  profileImage: string;
};

export type SuperAdminAddAdmin = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type SuperAdminCallRecordings = {
  id: number;
  fileName: string;
  downloadUrl: string;
  createdAt: string;
};

export type SuperAdminSettingsList = {
  adminCommission: string;
  doctorCommission: string;
  pharmacyCommission: string;
  doctorAppointmentDuration: string;
  labTechnicianCommission: string;
  doctorRegistrationEnabled: string;
  pharmacyRegistrationEnabled: string;
  labTechnicianRegistrationEnabled: string;
};

export type SuperAdminSettingsUpdate = {
  adminCommission: number;
  doctorCommission: number;
  pharmacyCommission: number;
  doctorAppointmentDuration: number;
  labTechnicianCommission: number;
  doctorRegistrationEnabled: number;
  pharmacyRegistrationEnabled: number;
  labTechnicianRegistrationEnabled: number;
};
