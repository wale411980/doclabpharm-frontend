type AvailabilityHistory = {
  date: string;
  status: "Available" | "Unavailable";
  startTime: string;
  endTime: string;
  patientsSeen: number;
};

export type Availability = {
  availabilities: [
    {
      dayOfWeek: string;
      startTime: string;
      endTime: string;
      isAvailable: boolean;
    }
  ];
};

export type UpdateDoctor = {
  // doctorId: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  specializationId: number;
  certifications: string;
  experience: string;
  profile_image: string;
  about: string;
  address: string;
  city: string;
};

export type Doctor = {
  id: number;
  uuid: string;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  phoneNumber: string;
  about: string;
  speciality: string;
  status: "active" | "inactive";
  emailVerifiedAt: string;
  certifications: string;
  experience: string;
  profileImage: string | null;
  city: string;
  state: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
  userType: string;
  qualifications: string;
  bio: string;
  profileImage: string;
  availabilities: availabilities[];
  rate: string;
  distance: string;
  fullBio: string;
  shortBio: string;
  availableSlots: AvailableSlot[];
};

export type DoctorPublic = {
  id: number;
  uuid: string;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  phoneNumber: string;
  about: string;
  speciality: string;
  status: "active" | "inactive";
  emailVerifiedAt: string;
  certifications: string;
  experience: string;
  profileImage: string | null;
  city: string;
  state: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
  userType: string;
  qualifications: string;
  specialization: {
    id: number;
    name: string;
  };
  bio: string;
  profileImage: string;
  availabilities: availabilities[];
  rate: string;
  distance: string;
  fullBio: string;
  shortBio: string;
  availableSlots: AvailableSlot[];
};

export type PatientType = {
  id: string;
  name: string;
  age: number;
  gender: string;
  avatar: string;
  lastVisit: string;
  condition: string;
  status: "Active" | "Pending";
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  insurance: {
    provider: string;
    policyNumber: string;
  };
  appointments: {
    lastVisit: string;
    nextAppointment: string;
  };
  medicalInfo: {
    lastUpdated: string;
    vitals: {
      bloodPressure: string;
      respiratoryRate: number;
      heartRate: number;
      temperature: number;
      weight: number;
      height: string;
    };
    conditions: string[];
    allergies: string[];
    medications: {
      name: string;
      dosage: string;
      frequency: string;
    }[];
    notes: string;
  };
  records: {
    name: string;
    date: string;
    type: string;
  }[];
};

export enum AppointmentStatus {
  SCHEDULED = "Scheduled",
  CANCELLED = "Cancelled",
  COMPLETED = "Completed",
  IN_PROGRESS = "In Progress",
}

export enum AppointmentType {
  FOLLOW_UP = "Follow-up",
  CONSULTATION = "Consultation",
  CHECK_UP = "Check-up",
  NEW_PATIENT = "New Patient",
}

export type Appointment = {
  id: string;
  patientName: string;
  patientId: string;
  date: string; // ISO string
  time: string;
  duration: string;
  type: AppointmentType;
  status: AppointmentStatus;
  notes?: string;
  complaint?: string;
  urgency?: "Normal" | "Urgent";
  avatar?: string;
  profileImage?: string;
};

export type Patient = {
  id: string;
  name: string;
  avatar?: string;
  complaint?: string;
  urgency?: "Normal" | "Urgent";
};

export type ViewMode = "day" | "week" | "month";

export type DurationOption = {
  label: string;
  value: string;
};

export type AppointmentTypeOption = {
  label: string;
  value: AppointmentType;
};

export type GetAllMessages = {
  conversationId: number;
  contactName: string;
  contactType: string;
  contactId: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  contactProfile: string;
  status: string;
  isOnline: boolean;
  isBlocked: number;
};

// get all conversations messages
export type GetMessagesConversation = {
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

export type DoctorSendMessage = {
  conversationId: number;
  receiverId: number;
  receiverType: string;
  message: string;
};

export type DoctorWallet = {
  id: number;
  balance: number;
  ownerId: number;
  histories: [
    {
      id: number;
      walletId: number;
      amount: string;
      type: string;
      status: "successful" | "pending";
      reference: string;
      trxNo: null;
      description: string;
      createdAt: string;
      updatedAt: string;
    }
  ];
};

export type DoctorAppointment = {
  id: number;
  userId: number;
  doctorId: number;
  serviceType: string;
  message: string;
  slotId: number;
  orderId: number;
  status: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  deletedAt: string | null;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    profileImage: string;
    classtype: string;
    age: number | null;
  };

  slot: {
    id: number;
    availableDate: string; // ISO date string
    availableTime: string; // e.g., "1:30 PM"
  };

  consultation: {
    id: number;
    name: string;
  };
};

export type DoctorStats = {
  totalPatients: number;
  balance: number;
  appointmentToday: number;
  unread: number;
};

export type DoctorRecentAppointments = {
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
    profileImage: string;
    classtype: string;
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

export type DoctorRecentMessages = {
  conversationId: number;
  contactName: string;
  contactProfile: string;
  contact_type: string;
  contactId: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
};

export type DoctorRecentUser = {
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
    profileImage: string;
    classtype: string;
    age: null;
  };
  consultation: {
    id: number;
    name: string;
  };
};

export type DoctorAvailabilityHistory = {
  id: number;
  doctorId: number;
  dayOfWeek: string;
  date: null;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
  status: "Current" | "Available";
  hours: string;
};

export type DoctorNewAvailability = {
  date: null;
  status: "Current" | "Available";
  hours: string;
};

export type DoctorUpdatePassword = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type GetDoctorPrescriptions = {
  id: number;
  userId: number;
  doctorId: number;
  notes: string;
  file: null;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
  drugs: [
    {
      id: number;
      prescriptionId: number;
      medicineId: string;
      other: null;
      dosage: string;
      instructions: string;
      createdAt: string;
      updatedAt: string;
      medicine: {
        id: number;
        name: string;
        volume: string;
        details: string;
        userId: 1;
        medicineCategoryId: number;
        type: string;
        quantity: number;
        price: number;
        status: string;
        expirationDate: string;
        createdAt: string;
        updatedAt: string;
        deletedAt: null;
      };
    }
  ];
  user: {
    id: string;
    firstName: string;
    lastName: string;
    profileImage: string;
    classtype: string;
    age: null;
  };
  doctor: {
    id: number;
    firstName: string;
    lastName: string;
    profileImage: string;
  };
};

export type ViewDoctorPrescriptions = {
  id: number;
  userId: number;
  doctorId: number;
  notes: string;
  file: null;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
  drugs: [
    {
      id: number;
      prescriptionId: number;
      medicineId: string;
      other: null;
      dosage: string;
      frequency: string;
      instructions: string;
      createdAt: string;
      updatedAt: string;
      medicine: {
        id: number;
        name: string;
        volume: string;
        details: string;
        userId: number;
        medicineCategoryId: number;
        type: string;
        quantity: number;
        price: number;
        status: string;
        expirationDate: string;
        createdAt: string;
        updatedAt: string;
        deletedAt: null;
      };
    }
  ];
  user: {
    id: string;
    firstName: string;
    lastName: string;
    profileImage: string;
    classtype: string;
    age: null;
  };
  doctor: {
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
    emailVerifiedAt: string;
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

export type CreateDoctorPrescriptions = {
  id: number;
  patientName: string;
  accountId: string;
  notes: string;
};

export type AddDoctorPrescription = {
  medicineName: string;
  medicineId: number;
  dosage: string;
  frequency: string;
  other: string;
  instructions: string;
};

export type GetAllPatients = {
  id: number;
  userId: number;
  doctorId: number;
  serviceType: string;
  message: string;
  slotId: number;
  orderId: number;
  status: "active" | "completed";
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    profileImage: string;
    classtype: string;
    gender: string;
    age: null;
  };
  consultation: {
    id: number;
    name: string;
  };
};

export type DoctorVideoCall = {
  conversationId: number;
  receiverId: number;
  receiverType: "User";
};

export type DoctorAcceptCall = {
  call_id: number;
};

export type DoctorDeclineCall = {
  call_id: number;
  conversation_id: number;
  receiver_id: number;
  receiver_type: "User";
};

export type DoctorEndCall = {
  call_id: number;
  conversation_id: number;
  receiver_id: number;
  receiver_type: "User";
};

export type DoctorAnalytics = {
  totalPatients: number;
  patientsMonth: number;
  appointment: number;
  duration: number;
  appointmentStatus: {
    Rescheduled: number;
    Scheduled: number;
    Cancelled: number;
    Completed: number;
  };
  patientsVist: [
    {
      month: string;
      total: number;
    }
  ];
  ageDistribution: {
    "9-35": number;
  };
};
export type DoctorWalletHistories = {
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

export type UpdateDoctorAppointment = {
  status: string;
  reason?: string;
};

export type RescheduleDoctorAppointment = {
  reason: string;
  slotId: number;
};

export type Medicine = {
  id: number;
  name: string;
  volume: string;
  details: string;
  userId: number;
  medicineCategoryId: number;
  type: string;
  quantity: number;
  price: number;
  status: string;
  expirationDate: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type Drug = {
  id: number;
  prescriptionId: number;
  medicineId: string;
  other: string | null;
  dosage: string;
  frequency: string | null;
  instructions: string | null;
  createdAt: string;
  updatedAt: string;
  medicine: Medicine | null;
};

export type DoctorUser = {
  id: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  accountId: string;
  classtype: string;
  age: number | null;
};

export type Doctor = {
  id: number;
  firstName: string;
  lastName: string;
  profileImage: string;
};

export type BackendPrescription = {
  id: number;
  userId: number;
  doctorId: number;
  notes: string;
  file: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  drugs: Drug[];
  user: DoctorUser;
  doctor: Doctor;
};

export type DoctorGetUserDetails = {
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
  report: [
    {
      id: number;
      userId: number;
      doctorId: number;
      diagnosisId: number;
      imageUrl: string;
      summary: string;
      status: string;
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
    }
  ];
  prescription: [
    {
      id: number;
      userId: number;
      doctorId: number;
      notes: string;
      drugs: [
        {
          id: number;
          prescriptionId: number;
          medicineId: string;
          other: null;
          dosage: string;
          frequency: null;
          instructions: string;
          medicine: {
            id: number;
            name: string;
          };
        }
      ];
    }
  ];
};

export type UploadDoctorVideoPayload = {
  video: File;
  callId: number;
};

export type DoctorCallNote = {
  call_id: number;
  user_id: number;
  note: string;
};

export type DoctorCallRecordings = {
  id: number;
  fileName: string;
  downloadUrl: string;
  createdAt: string;
};
