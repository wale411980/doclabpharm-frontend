import type { ProviderRole } from "@/lib/providerTypes";

/**
 * Shapes of the Phase 4–10 marketplace API (payments, deliveries, doctors on
 * demand, labs, ambulances, support and the admin console), after the API
 * client's camelCase conversion.
 *
 * Note: the client also camel-cases object *keys* that are data, such as the
 * status counts in the admin overview (`awaiting_pharmacy` → `awaitingPharmacy`).
 * Use `snakeKeys()` from `@/lib/marketplace` before looking those up.
 */

export type PaymentMethod = "wallet" | "card";

/* ---------- Addresses ---------- */

export type PatientAddress = {
  id: number;
  label: string;
  addressLine: string;
  landmark: string | null;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  isDefault: boolean;
};

/* ---------- Checkout ---------- */

export type CheckoutItem = Record<string, unknown> & { service_type: "med" | "lab" | "consult" };

export type DeliveryChoice = {
  method: "delivery" | "pickup";
  addressId?: number;
  phone?: string;
  note?: string;
  prescriptionId?: number;
};

export type CheckoutInput = {
  items: CheckoutItem[];
  paymentMethod: PaymentMethod;
  delivery?: DeliveryChoice;
  collectionAddressId?: number;
  callbackUrl?: string;
};

export type CheckoutQuote = {
  total: number;
  deliveries: { pharmacyId: number; pharmacy: string; method: "delivery" | "pickup"; distanceKm: number | null; fee: number }[];
  homeCollections: { labId: number; lab: string; distanceKm: number; fee: number }[];
};

export type PlacedOrder = { id: number; orderTrx: string; totalAmount: number; status: string; paymentMethod: PaymentMethod };

export type CheckoutResult =
  | { message: string; order: PlacedOrder; payment?: undefined }
  | { message: string; payment: { authorizationUrl: string; reference: string; amount?: number }; order?: undefined };

export type CardStatus = "paid" | "pending" | "failed" | "refunded" | "refund_failed";

export type CardStatusResult = { status: CardStatus; message: string; order: PlacedOrder | null };

/* ---------- Medicines near me ---------- */

export type NearbyMedicine = {
  id: number;
  name: string;
  volume: string | null;
  price: number;
  inStock: number;
  prescriptionOnly: boolean;
  pharmacy: {
    id: number;
    name: string;
    distanceKm: number;
    acceptingOrders: boolean;
    deliversHere: boolean;
    deliveryFee: number | null;
    minOrderAmount: number;
  };
};

/* ---------- Pharmacy deliveries ---------- */

export type DeliveryStatus =
  | "awaiting_pharmacy"
  | "accepted"
  | "out_for_delivery"
  | "ready_for_pickup"
  | "delivered"
  | "declined"
  | "expired"
  | "cancelled";

export type DeliveryItem = {
  id: number;
  type: "med" | "delivery";
  name: string;
  volume: string | null;
  quantity: number;
  price: number;
  status: string | null;
};

type DeliveryBase = {
  id: number;
  orderId: number;
  method: "delivery" | "pickup";
  status: DeliveryStatus;
  riderName: string | null;
  riderPhone: string | null;
  acceptBy: string | null;
  acceptedAt: string | null;
  dispatchedAt: string | null;
  completedAt: string | null;
  fee: number;
  distanceKm: number | null;
  requiresPrescription: boolean;
  items: DeliveryItem[];
};

export type PatientDelivery = DeliveryBase & {
  handoverCode: string | null;
  addressLine: string | null;
  pharmacy: { id: number; name: string; phone: string | null; address: string | null } | null;
};

export type PharmacyDelivery = DeliveryBase & {
  prescriptionId: number | null;
  note: string | null;
  area: string | null;
  patient: {
    name: string;
    phone: string | null;
    addressLine: string | null;
    landmark: string | null;
    latitude: number | null;
    longitude: number | null;
  } | null;
};

export type DeliverySettings = {
  acceptingOrders: boolean;
  offersDelivery: boolean;
  deliveryRadiusKm: number;
  deliveryBaseFee: number;
  deliveryFeePerKm: number;
  minOrderAmount: number;
};

/* ---------- Doctors on demand ---------- */

export type OnlineDoctor = {
  id: number;
  firstName: string;
  lastName: string;
  speciality: string | null;
  profileImage: string | null;
  about: string | null;
  specialization: { id: number; name: string } | null;
};

export type ConsultStatus = "waiting" | "in_progress" | "completed" | "declined" | "expired" | "cancelled";

export type InstantConsult = {
  id: number;
  orderId: number;
  status: ConsultStatus;
  acceptBy: string | null;
  acceptedAt: string | null;
  completedAt: string | null;
  conversationId: number | null;
  doctor?: { id: number; name: string; profileImage: string | null } | null;
};

export type ConsultRequest = {
  id: number;
  complaint: string | null;
  acceptBy: string | null;
  patient: { firstName: string; lastName: string; gender: string | null; dob: string | null; profileImage: string | null } | null;
};

/** A booking from GET /user/appointment or /doctor/appointments. */
export type BookingRow = {
  id: number;
  orderId: number | null;
  doctorId: number;
  userId: number;
  mode: "scheduled" | "instant" | null;
  status: string;
  message: string | null;
  acceptBy: string | null;
  conversationId: number | null;
  createdAt: string;
  user?: { id: number; firstName: string; lastName: string; profileImage: string | null } | null;
  doctor?: { id: number; firstName: string; lastName: string; profileImage: string | null } | null;
};

/* ---------- Labs ---------- */

export type PatientLabResult = {
  id: number;
  test: string | null;
  laboratory: string | null;
  status: "normal" | "abnormal" | "critical" | null;
  summary: string | null;
  hasFile: boolean;
  releasedAt: string | null;
};

export type LabReport = {
  id: number;
  userId: number;
  diagnosisId: number;
  bookingId: number | null;
  status: "normal" | "abnormal" | "critical" | null;
  summary: string | null;
  hasFile: boolean;
  fileName?: string | null;
  releasedAt: string | null;
  createdAt: string;
  user?: { firstName: string; lastName: string } | null;
  diagnosis?: { name: string } | null;
};

export type LabBooking = {
  id: number;
  userId: number;
  diagnosisId: number;
  status: string;
  progress: "sample_collected" | "processing" | "result_ready" | null;
  progressAt: string | null;
  date: string | null;
  time: string | null;
  collectionMethod: "home" | "at_lab" | null;
  addressLine: string | null;
  landmark: string | null;
  contactPhone: string | null;
  distanceKm: number | null;
  user?: { firstName: string; lastName: string } | null;
  diagnosis?: { name: string } | null;
};

export type HomeCollectionSettings = {
  offersHomeCollection: boolean;
  homeCollectionFee: number;
  homeCollectionRadiusKm: number;
};

/* ---------- Ambulances ---------- */

export type AmbulanceStatus = "searching" | "assigned" | "arrived" | "transporting" | "completed" | "no_vehicle" | "cancelled";
export type VehicleType = "basic" | "advanced" | "transport";

export type PatientAmbulanceRequest = {
  id: number;
  status: AmbulanceStatus;
  emergency: boolean;
  pickupAddress: string;
  destinationName: string | null;
  estimatedFare: number | null;
  finalFare: number | null;
  paymentStatus: "unpaid" | "paid" | "waived" | null;
  operator: { name: string; phone: string | null } | null;
  vehicle: {
    plateNumber: string;
    type: VehicleType;
    hasParamedic: boolean;
    driverName: string;
    driverPhone: string;
    latitude: number | null;
    longitude: number | null;
    etaMinutes: number | null;
  } | null;
  emergencyNumber: string;
  createdAt: string | null;
};

export type AmbulanceRequestInput = {
  pickupAddress: string;
  pickupLatitude: number;
  pickupLongitude: number;
  destinationName?: string;
  destinationLatitude?: number;
  destinationLongitude?: number;
  vehicleType: "any" | VehicleType;
  emergency: boolean;
  contactPhone?: string;
  notes?: string;
};

export type AmbulanceVehicle = {
  id: number;
  plateNumber: string;
  type: VehicleType;
  hasParamedic: boolean;
  equipment: string | null;
  driverName: string;
  driverPhone: string;
  status: "available" | "offline" | "busy";
  latitude: number | null;
  longitude: number | null;
  lastSeenAt: string | null;
};

export type VehicleInput = {
  plateNumber: string;
  type: VehicleType;
  hasParamedic: boolean;
  equipment?: string;
  driverName: string;
  driverPhone: string;
};

export type AmbulanceOffer = {
  id: number;
  emergency: boolean;
  vehicleType: string;
  pickupAddress: string;
  pickupLatitude: number;
  pickupLongitude: number;
  destinationName: string | null;
  tripKm: number | null;
  estimatedFare: number | null;
  notes: string | null;
  offeredVehicle: { id: number; plateNumber: string; type: VehicleType } | null;
  etaMinutes: number | null;
  offerExpiresAt: string | null;
};

export type AmbulanceTrip = {
  id: number;
  status: AmbulanceStatus;
  emergency: boolean;
  pickupAddress: string;
  pickupLatitude: number | null;
  pickupLongitude: number | null;
  destinationName: string | null;
  destinationLatitude: number | null;
  destinationLongitude: number | null;
  contactPhone: string | null;
  notes: string | null;
  patientName: string | null;
  vehicle: { id: number; plateNumber: string; type: VehicleType } | null;
  tripKm: number | null;
  estimatedFare: number | null;
  finalFare: number | null;
  paymentStatus: "unpaid" | "paid" | "waived" | null;
};

export type Fares = { baseFare: number; perKmFare: number };

/* ---------- Earnings and commission ---------- */

export type Earnings = {
  period: { from: string; to: string };
  items: number;
  gross: number;
  commission: number;
  earned: number;
  paidToBank: number;
  paidToWallet: number;
  owedBack: number;
  commissionPercent: number | null;
  recent: {
    id: number;
    orderTrx: string;
    serviceType: string;
    price: number;
    adminCommission: number;
    providerAmount: number;
    payoutMethod: "split" | "wallet" | null;
    createdAt: string;
  }[];
};

export type ServiceTotals = { items: number; gross: number; commission: number };

export type CommissionReport = {
  period: { from: string; to: string };
  gross: number;
  commission: number;
  byService: Record<string, ServiceTotals>;
  byPaymentMethod: Record<string, number>;
  owedByProviders: number;
};

/* ---------- Support ---------- */

export type SupportCategory = "order" | "refund" | "quality" | "conduct" | "safety" | "other";
export type TicketStatus = "awaiting_provider" | "awaiting_patient" | "resolved" | "closed";
export type SupportAudience = "patient" | ProviderRole | "admin";

export type SupportTicket = {
  id: number;
  reference: string;
  subject: string;
  category: SupportCategory;
  urgent: boolean;
  status: TicketStatus;
  orderId: number | null;
  provider: { type: ProviderRole; id: number; name: string } | null;
  patient: string | null;
  responseDueAt: string | null;
  firstRespondedAt: string | null;
  slaBreached: boolean;
  escalated: boolean;
  resolvedAt: string | null;
  createdAt: string;
};

export type SupportMessage = {
  id: number;
  from: "patient" | "provider" | "doclabpharm";
  body: string;
  internal: boolean;
  createdAt: string;
};

export type SupportThread = SupportTicket & { messages: SupportMessage[] };

export type NewTicketInput = {
  providerType: ProviderRole;
  providerId: number;
  category: SupportCategory;
  subject: string;
  message: string;
  orderId?: number;
  urgent?: boolean;
};

export type ScorecardRow = {
  providerType: ProviderRole;
  providerId: number;
  name: string | null;
  status: string | null;
  tickets: number;
  open: number;
  breached: number;
  avgFirstResponseMinutes: number | null;
};

export type EnforcementEvent = {
  id: number;
  action: string;
  reason: string | null;
  actorType: string | null;
  actorId: number | null;
  createdAt: string;
};

export type EnforcementHistory = {
  breachesLast30Days: number;
  status: string;
  verificationStatus: string;
  history: EnforcementEvent[];
};

/* ---------- Admin console ---------- */

export type AdminOverview = {
  period: { from: string; to: string };
  money: {
    gross: number;
    commission: number;
    byService: Record<string, ServiceTotals>;
    orders: number;
    owedByProviders: number;
    unpaidAmbulanceFares: number;
  };
  activity: {
    newPatients: number;
    deliveries: Record<string, number>;
    instantConsults: Record<string, number>;
    ambulanceRequests: Record<string, number>;
    ambulanceMedianAssignSeconds: number | null;
    supportTickets: number;
  };
  now: {
    doctorsOnline: number;
    pharmaciesTakingOrders: number;
    ambulancesAvailable: number;
    ambulanceRequestsSearching: number;
  };
  providers: Record<string, Record<string, number>>;
  queues: {
    verificationsWaiting: number;
    supportOpen: number;
    supportOverdue: number;
    providerReportsOpen: number;
    pharmacyOrdersWaiting: number;
    unpaidAmbulanceTrips: number;
  };
};

export type AdminDeliveryRow = {
  id: number;
  orderId: number;
  method: "delivery" | "pickup";
  status: DeliveryStatus;
  fee: number;
  distanceKm: number | null;
  city: string | null;
  acceptBy: string | null;
  acceptedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  pharmacy: string | null;
  patient: string | null;
};

export type AdminConsultRow = {
  id: number;
  orderId: number;
  status: ConsultStatus;
  acceptBy: string | null;
  acceptedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  doctor: string | null;
  patient: string | null;
};

export type AdminAmbulanceRow = {
  id: number;
  status: AmbulanceStatus;
  emergency: boolean;
  pickupAddress: string;
  destinationName: string | null;
  tripKm: number | null;
  estimatedFare: number | null;
  finalFare: number | null;
  paymentStatus: "unpaid" | "paid" | "waived" | null;
  createdAt: string;
  assignedAt: string | null;
  completedAt: string | null;
  operator: string | null;
  patient: string | null;
};

export type MarketplaceSettings = {
  doctorCommission: number;
  pharmacyCommission: number;
  labTechnicianCommission: number;
  ambulanceOperatorCommission: number;
  paystackFeeBearer: "account" | "subaccount" | "all-proportional" | "all";
  pharmacyAcceptMinutes: number;
  doctorAcceptMinutes: number;
  supportResponseHours: number;
  doctorAppointmentDuration: number;
  doctorRegistrationEnabled: boolean;
  pharmacyRegistrationEnabled: boolean;
  labTechnicianRegistrationEnabled: boolean;
  ambulanceOperatorRegistrationEnabled: boolean;
};
