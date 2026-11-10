import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/routes/ProtectedRoute";
import Index from "@/screens/common/Index";

import { Login } from "@/components/authAdmin/Login";
import { SuperAdminLogin } from "@/components/authSuperAdmin/Login";

import { ResetPassword } from "@/components/authUser/ResetPassword";
import DoctorLayout from "@/components/layout/DoctorLayout";
import UserLayout from "@/components/layout/UserLayout";
import PharmacyLayout from "@/components/layout/PharmacyLayout";
import LabTechnicianLayout from "@/components/layout/LabTechnicianLayout";
import AdminLayout from "@/components/layout/AdminLayout";
import SuperAdminLayout from "@/components/layout/SuperAdminLayout";
import AmbulanceOperatorLayout from "@/components/layout/AmbulanceOperatorLayout";
import VerifyEmailNoticePatient from "@/screens/VerifyEmailNoticePatient";
import VerifyEmailNotice from "@/screens/VerifyEmailNotice";
import EnterOTPPatient from "@/screens/EnterOTPPatient";
import { EnterOTP } from "@/screens/EnterOTP";
import Unauthorized from "@/screens/Unauthorized";
import NotFoundPage from "@/screens/PageNotFound";
import {
  PatientLoginPage,
  PatientRegisterPage,
  ProviderLoginPage,
  ProviderRegisterPage,
  SiteRedirect,
} from "@/screens/auth/AuthPages";

// COMING SOON PAGE
// import IndexPage from "@/components/newLandingPage/ComingSoonPage";
// MAIN LANDING PAGE

import AvailableDoctorsLandingPage from "@/components/newLandingPage/AvailableDoctorsLandingPage";
import DoctorProfileLandingPage from "@/components/newLandingPage/DoctorProfileLandingPage";
import PatientDetailsLandingPage from "@/components/newLandingPage/PatientDetailsLandingPage";
import ConfirmLandingPage from "@/components/newLandingPage/ConfirmLandingPage";
import SelectDateTimeLandingPage from "@/components/newLandingPage/SelectDateTimeLandingPage";
import ConfirmTestLandingPage from "@/components/newLandingPage/ConfirmTestLandingPage";
import CartLandingPage from "@/components/newLandingPage/CartLandingPage";
import CartLoginPage from "@/components/newLandingPage/CartLoginPage";


//Patient imports

import UserDashboard from "@/screens/user/Dashboard";
import DoctorProfile from "@/screens/user/DoctorBooking/DoctorProfile";
import PatientProfile from "@/screens/user/PatientProfile";
import PatientAppointment from "@/screens/user/PatientAppointment";
import PatientOrder from "@/screens/user/PatientOrder";
import PatientPharmacy from "@/screens/user/Pharmacy/PatientPharmacy";
import PatientDetails from "@/screens/user/DoctorBooking/PatientDetails";
import Consultation from "@/screens/user/DoctorBooking/Consultation";
import TestBooking from "@/screens/user/TestBooking";
import TestResults from "@/screens/user/TestResults";
import FirstMessagePage from "@/screens/user/PatientMessages";
import Cart from "@/screens/user/DoctorBooking/Cart";
import Wallet from "@/screens/user/Wallet";
import CheckoutSuccess from "@/screens/user/DoctorBooking/CheckoutSuccess";
import Confirm from "@/screens/user/DoctorBooking/Confirm";
import ConfirmAfterFundingWallet from "@/screens/user/DoctorBooking/ConfirmAfterFundingWallet";
import AvailableDoctors from "@/screens/user/DoctorBooking/AvailableDoctors";
import SelectLab from "@/screens/user/LabBooking/SelectLab";
import ConfirmTest from "@/screens/user/LabBooking/ConfirmTest";
import SelectDateTime from "@/screens/user/LabBooking/SelectDateTime";
import SelectTest from "@/screens/user/LabBooking/SelectTest";
import Notification from "@/screens/user/Notification";
// USER_PRESCRIPTIONS_ROUTE_V1 — component existed but was never imported or routed
import UserPrescriptions from "@/screens/user/UserPrescriptions";
// MEDICINES_ROUTE_V1: add medicines browser to user routes
import MedicationBrowser from "@/screens/user/Medicines";

// Doctor imports
import DoctorDashboard from "@/screens/doctor/Dashboard";
import DoctorSettings from "@/screens/doctor/DoctorSettings";
import DoctorAvailability from "@/screens/doctor/DoctorAvailability";
import PatientList from "@/screens/doctor/PatientList";
import PatientDetail from "@/screens/doctor/PatientDetail";
import DoctorAppointment from "@/screens/doctor/DoctorAppointment";
import DoctorPrescriptions from "@/screens/doctor/DoctorPrescriptions";
// Lazy-loaded: pulls in recharts (~478KB) only when the analytics page is visited.
const MedicalDashboard = lazy(() => import("@/screens/doctor/Analytics"));
import DoctorWallet from "@/screens/doctor/DoctorWallet";
import DoctorMessages from "@/screens/doctor/DoctorMessages";
import DoctorCallRecordings from "@/screens/doctor/DoctorCallRecordings";

// Pharmacist imports
import PharmacistDashboard from "@/screens/pharmacist/Dashboard";
import PharmacySettings from "@/screens/pharmacist/PharmacySettings";
import OrderManagement from "@/screens/pharmacist/OrderManagement";
import PaymentDashboard from "@/screens/pharmacist/Payment";
import ProductList from "@/screens/pharmacist/ProductList";
import ProductCategory from "@/screens/pharmacist/ProductCategory";
import PharmacyWallet from "@/screens/pharmacist/PharmacyWallet";
import PharmacyAvailability from "@/screens/pharmacist/PharmacyAvailability";

// Lab Technician imports
import Dashboard from "@/screens/labTechnician/Dashboard";
import Diagnosis from "@/screens/labTechnician/Diagnosis";
import AppointmentsDashboard from "@/screens/labTechnician/Appointments";
import LabTechnicianWallet from "@/screens/labTechnician/LabTechnicianWallet";
import LabTechnicianSettings from "@/screens/labTechnician/LabTechnicianSettings";
import PatientListLab from "@/screens/labTechnician/PatientListLab";
import PatientDetailLab from "@/screens/labTechnician/PatientDetailLab";
import LabAvailability from "@/screens/labTechnician/LabAvailability";

// Ambulance operator imports
import AmbulanceOperatorDashboard from "@/screens/ambulanceOperator/Dashboard";
import AmbulanceOperatorProfile from "@/screens/ambulanceOperator/Profile";

// Provider verification (shared by every provider type) and its admin review
import VerificationPage from "@/screens/verification/VerificationPage";
import VerificationQueue from "@/screens/admin/verification/VerificationQueue";
import VerificationDetail from "@/screens/admin/verification/VerificationDetail";
import ProviderReports from "@/screens/admin/verification/ProviderReports";

// Admin imports
import AdminDashboard from "@/screens/admin/AdminDashboard";
import AdminTransactions from "@/screens/admin/AdminTransactions";
import AdminPayment from "@/screens/admin/AdminPayment";

import AdminDoctorList from "@/screens/admin/AdminDoctorList";
import AdminLabList from "@/screens/admin/AdminLabList";
import AdminPharmacyList from "@/screens/admin/AdminPharmacyList";
import AdminPatientList from "@/screens/admin/AdminPatientList";
import AdminDoctorAppointments from "@/screens/admin/AdminDoctorAppointments";
import AdminLabAppointments from "@/screens/admin/AdminLabAppointments";

import AdminDiagnosis from "@/screens/admin/AdminDiagnosis";
import AdminOrderHistories from "@/screens/admin/AdminOrderHistories";
import AdminPharmacyCategory from "@/screens/admin/AdminPharmacyCategory";

// Supeer Admin imports
import SuperAdminDashboard from "@/screens/superAdmin/SuperAdminDashboard";
import SuperAdminTransactions from "@/screens/superAdmin/SuperAdminTransactions";
import SuperAdminPayment from "@/screens/superAdmin/SuperAdminPayment";
import SuperAdminMessages from "@/screens/superAdmin/SuperAdminMessages";
import SuperAdminDoctorList from "@/screens/superAdmin/SuperAdminDoctorList";
import SuperAdminLabList from "@/screens/superAdmin/SuperAdminLabList";
import SuperAdminAdminList from "@/screens/superAdmin/SuperAdminAdminList";
import SuperAdminPharmacyList from "@/screens/superAdmin/SuperAdminPharmacyList";
import SuperAdminPatientList from "@/screens/superAdmin/SuperAdminPatientList";
import SuperAdminDoctorAppointments from "@/screens/superAdmin/SuperAdminDoctorAppointments";
import SuperAdminLabAppointments from "@/screens/superAdmin/SuperAdminLabAppointments";
import SuperAdminConsultation from "@/screens/superAdmin/SuperAdminConsultation";
import SuperAdminDiagnosis from "@/screens/superAdmin/SuperAdminDiagnosis";
import SuperAdminOrderHistories from "@/screens/superAdmin/SuperAdminOrderHistories";
import SuperAdminPharmacyCategory from "@/screens/superAdmin/SuperAdminPharmacyCategory";
import SuperAdminCallRecordings from "@/screens/superAdmin/SuperAdminCallRecordings";

// Phase 4–10 marketplace screens
import Checkout from "@/screens/patient/Checkout";
import CheckoutComplete from "@/screens/patient/CheckoutComplete";
import NearbyMedicines from "@/screens/patient/NearbyMedicines";
import MyDeliveries from "@/screens/patient/MyDeliveries";
import SeeDoctorNow from "@/screens/patient/SeeDoctorNow";
import ConsultWaiting from "@/screens/patient/ConsultWaiting";
import LabResults from "@/screens/patient/LabResults";
import AmbulanceRequest from "@/screens/patient/AmbulanceRequest";
import AmbulanceTrip from "@/screens/patient/AmbulanceTrip";
import SupportList from "@/screens/support/SupportList";
import SupportThread from "@/screens/support/SupportThread";
import NewTicket from "@/screens/support/NewTicket";
import EarningsPage from "@/screens/shared/EarningsPage";
import PharmacyDeliveries from "@/screens/pharmacist/orders/PharmacyDeliveries";
import DeliverySettingsPage from "@/screens/pharmacist/orders/DeliverySettingsPage";
import DoctorOnDemand from "@/screens/doctor/onDemand/DoctorOnDemand";
import LabResultsManager from "@/screens/labTechnician/results/LabResultsManager";
import HomeCollectionPage from "@/screens/labTechnician/results/HomeCollectionPage";
import Fleet from "@/screens/ambulanceOperator/Fleet";
import Fares from "@/screens/ambulanceOperator/Fares";
import Dispatch from "@/screens/ambulanceOperator/Dispatch";
import Trips from "@/screens/ambulanceOperator/Trips";
import AdminOverview from "@/screens/admin/console/AdminOverview";
import LiveOperations from "@/screens/admin/console/LiveOperations";
import SupportScorecard from "@/screens/admin/console/SupportScorecard";
import ProviderAccount from "@/screens/admin/console/ProviderAccount";
import CommissionReport from "@/screens/superAdmin/console/CommissionReport";
import MarketplaceSettingsPage from "@/screens/superAdmin/console/MarketplaceSettingsPage";

function router() {
  return (
    <Router>
      <Routes>
        {/* Public pages */}

        <Route path="/admin/login" element={<Login />} />
        <Route path="/super-admin/login" element={<SuperAdminLogin />} />

        <Route path="/password-reset" element={<ResetPassword />} />
        <Route path="/caregiver/password-reset" element={<ResetPassword />} />
        <Route
          path="/user/verify-email"
          element={<VerifyEmailNoticePatient />}
        />
        <Route path="/verify-email" element={<VerifyEmailNotice />} />
        <Route path="/user/enter-otp" element={<EnterOTPPatient />} />
        <Route path="/enter-otp" element={<EnterOTP />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        {/* The public website (/, /privacy, /terms, ...) is served by Next.js. */}
        <Route path="/" element={<SiteRedirect to="/" />} />
        <Route path="/login" element={<PatientLoginPage />} />
        <Route path="/register" element={<PatientRegisterPage />} />
        <Route path="/partners/login" element={<ProviderLoginPage />} />
        <Route path="/partners/register" element={<ProviderRegisterPage />} />
        <Route
          path="/doctors/available"
          element={<AvailableDoctorsLandingPage />}
        />
        <Route
          path="/doctor/profile/:doctorId"
          element={<DoctorProfileLandingPage />}
        />
        <Route
          path="/patient/bookings/select-date-time"
          element={<SelectDateTimeLandingPage />}
        />
        <Route
          path="/patient/bookings/confirm"
          element={<ConfirmTestLandingPage />}
        />
        <Route path="/patient/cart" element={<CartLandingPage />} />
        <Route path="/privacy-policy" element={<SiteRedirect to="/privacy" />} />

        <Route path="/terms-and-conditions" element={<SiteRedirect to="/terms" />} />

        {/* Protected pages wrapped in Layout (with sidebar & header) */}

        {/* USER ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
          <Route path="/dashboard" element={<Index />} />
          <Route element={<UserLayout />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/doctors/:doctorId" element={<DoctorProfile />} />
            <Route path="/user/profile" element={<PatientProfile />} />
            <Route path="/user/appointments" element={<PatientAppointment />} />
            <Route path="/user/orders" element={<PatientOrder />} />
            <Route path="/user/pharmacy" element={<PatientPharmacy />} />
            <Route path="/doctor/select" element={<AvailableDoctors />} />
            <Route
              path="/doctor/:doctorId/patient-details"
              element={<PatientDetails />}
            />
            <Route
              path="/doctor/:doctorId/consultation-type"
              element={<Consultation />}
            />
            <Route path="/user/confirm" element={<Confirm />} />
            <Route path="/user/cart" element={<Cart />} />
            <Route path="/user/laboratories2" element={<TestBooking />} />
            <Route path="/user/results" element={<TestResults />} />
            <Route path="/user/messages" element={<FirstMessagePage />} />
            <Route path="/user/wallet" element={<Wallet />} />
            <Route
              path="/user/checkout-success"
              element={<CheckoutSuccess />}
            />
            <Route path="/lab/select" element={<SelectLab />} />
            <Route
              path="/patient/booking/select-test"
              element={<SelectTest />}
            />
            <Route
              path="/patient/booking/select-date-time"
              element={<SelectDateTime />}
            />
            <Route path="/patient/booking/confirm" element={<ConfirmTest />} />
            <Route path="/user/notifications" element={<Notification />} />
            {/* USER_PRESCRIPTIONS_ROUTE_V1 — add routes for patient prescriptions */}
            <Route path="/user/prescriptions" element={<UserPrescriptions />} />
            <Route path="/user/prescriptions/:id" element={<UserPrescriptions />} />
            {/* MEDICINES_ROUTE_V1: medicines browser was built but never routed */}
            <Route path="/user/medicines" element={<MedicationBrowser />} />
            <Route
              path="/user/profile-details"
              element={<PatientDetailsLandingPage />}
            />
            <Route path="/user/confirmation" element={<ConfirmLandingPage />} />
            <Route path="/user/carts" element={<CartLoginPage />} />
            <Route
              path="/user/confirm-consult"
              element={<ConfirmAfterFundingWallet />}
            />
            <Route path="/user/checkout" element={<Checkout />} />
            <Route path="/user/checkout/complete" element={<CheckoutComplete />} />
            <Route path="/user/medicines/near-me" element={<NearbyMedicines />} />
            <Route path="/user/deliveries" element={<MyDeliveries />} />
            <Route path="/user/see-doctor-now" element={<SeeDoctorNow />} />
            <Route path="/user/consults/:id" element={<ConsultWaiting />} />
            <Route path="/user/lab-results" element={<LabResults />} />
            <Route path="/user/ambulance" element={<AmbulanceRequest />} />
            <Route path="/user/ambulance/:id" element={<AmbulanceTrip />} />
            <Route path="/user/support" element={<SupportList audience="patient" basePath="/user/support" />} />
            <Route path="/user/support/new" element={<NewTicket basePath="/user/support" />} />
            <Route path="/user/support/:id" element={<SupportThread audience="patient" basePath="/user/support" />} />
          </Route>
        </Route>

        {/* DOCTOR ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={["doctor"]} />}>
          <Route element={<DoctorLayout />}>
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            <Route path="/doctor/verification" element={<VerificationPage role="doctor" />} />
            <Route path="/doctor/see-now" element={<DoctorOnDemand />} />
            <Route path="/doctor/earnings" element={<EarningsPage role="doctor" />} />
            <Route path="/doctor/support" element={<SupportList audience="doctor" basePath="/doctor/support" />} />
            <Route path="/doctor/support/:id" element={<SupportThread audience="doctor" basePath="/doctor/support" />} />
            <Route path="/doctor/settings" element={<DoctorSettings />} />
            <Route
              path="/doctor/availability"
              element={<DoctorAvailability />}
            />
            <Route path="/doctor/patients" element={<PatientList />} />
            <Route path="/doctor/patients/:id" element={<PatientDetail />} />
            <Route
              path="/doctor/appointments"
              element={<DoctorAppointment />}
            />
            <Route
              path="/doctor/prescriptions"
              element={<DoctorPrescriptions />}
            />
            <Route path="/doctor/analytics" element={<Suspense fallback={<div className="p-6">Loading analytics...</div>}><MedicalDashboard /></Suspense>} />
            <Route path="/doctor/wallet" element={<DoctorWallet />} />
            <Route path="/doctor/messages" element={<DoctorMessages />} />
            <Route
              path="/doctor/call-recordings"
              element={<DoctorCallRecordings />}
            />
          </Route>
        </Route>

        {/* PHARMACIST ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={["pharmacy"]} />}>
          <Route element={<PharmacyLayout />}>
            <Route
              path="/pharmacy/dashboard"
              element={<PharmacistDashboard />}
            />
            <Route path="/pharmacy/settings" element={<PharmacySettings />} />
            <Route path="/pharmacy/verification" element={<VerificationPage role="pharmacy" />} />
            <Route path="/pharmacy/deliveries" element={<PharmacyDeliveries />} />
            <Route path="/pharmacy/delivery-settings" element={<DeliverySettingsPage />} />
            <Route path="/pharmacy/earnings" element={<EarningsPage role="pharmacy" />} />
            <Route path="/pharmacy/support" element={<SupportList audience="pharmacy" basePath="/pharmacy/support" />} />
            <Route path="/pharmacy/support/:id" element={<SupportThread audience="pharmacy" basePath="/pharmacy/support" />} />
            <Route path="/pharmacy/orders" element={<OrderManagement />} />
            <Route path="/pharmacy/payments" element={<PaymentDashboard />} />
            <Route path="/pharmacy/products-list" element={<ProductList />} />
            <Route
              path="/pharmacy/products-category"
              element={<ProductCategory />}
            />
            <Route path="/pharmacy/wallet" element={<PharmacyWallet />} />
            <Route
              path="/pharmacy/availability"
              element={<PharmacyAvailability />}
            />
          </Route>
        </Route>

        {/* LABTECHNICIAN ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={["lab_technician"]} />}>
          <Route element={<LabTechnicianLayout />}>
            <Route path="/lab_technician/dashboard" element={<Dashboard />} />
            <Route path="/lab_technician/diagnosis" element={<Diagnosis />} />
            <Route
              path="/lab_technician/verification"
              element={<VerificationPage role="lab_technician" />}
            />
            <Route path="/lab_technician/results" element={<LabResultsManager />} />
            <Route path="/lab_technician/home-collection" element={<HomeCollectionPage />} />
            <Route path="/lab_technician/earnings" element={<EarningsPage role="lab_technician" />} />
            <Route path="/lab_technician/support" element={<SupportList audience="lab_technician" basePath="/lab_technician/support" />} />
            <Route path="/lab_technician/support/:id" element={<SupportThread audience="lab_technician" basePath="/lab_technician/support" />} />
            <Route
              path="/lab_technician/appointments"
              element={<AppointmentsDashboard />}
            />
            <Route
              path="/lab_technician/availability"
              element={<LabAvailability />}
            />
            <Route
              path="/lab_technician/wallet"
              element={<LabTechnicianWallet />}
            />
            <Route
              path="/lab_technician/settings"
              element={<LabTechnicianSettings />}
            />
            <Route
              path="/lab_technician/patients"
              element={<PatientListLab />}
            />
            <Route
              path="/lab_technician/patients/:id"
              element={<PatientDetailLab />}
            />
          </Route>
        </Route>

        {/* AMBULANCE OPERATOR ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={["ambulance_operator"]} />}>
          <Route element={<AmbulanceOperatorLayout />}>
            <Route
              path="/ambulance_operator/dashboard"
              element={<AmbulanceOperatorDashboard />}
            />
            <Route
              path="/ambulance_operator/verification"
              element={<VerificationPage role="ambulance_operator" />}
            />
            <Route
              path="/ambulance_operator/profile"
              element={<AmbulanceOperatorProfile />}
            />
            <Route path="/ambulance_operator/dispatch" element={<Dispatch />} />
            <Route path="/ambulance_operator/vehicles" element={<Fleet />} />
            <Route path="/ambulance_operator/fares" element={<Fares />} />
            <Route path="/ambulance_operator/trips" element={<Trips />} />
            <Route path="/ambulance_operator/earnings" element={<EarningsPage role="ambulance_operator" />} />
            <Route path="/ambulance_operator/support" element={<SupportList audience="ambulance_operator" basePath="/ambulance_operator/support" />} />
            <Route path="/ambulance_operator/support/:id" element={<SupportThread audience="ambulance_operator" basePath="/ambulance_operator/support" />} />
          </Route>
        </Route>

        {/* ADMIN ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/transactions" element={<AdminTransactions />} />
            <Route path="/admin/payments" element={<AdminPayment />} />

            <Route path="/admin/doctors" element={<AdminDoctorList />} />
            <Route path="/admin/labs" element={<AdminLabList />} />
            <Route path="/admin/pharmacists" element={<AdminPharmacyList />} />
            <Route path="/admin/patients" element={<AdminPatientList />} />
            <Route
              path="/admin/doctor-appointments"
              element={<AdminDoctorAppointments />}
            />
            <Route
              path="/admin/lab-appointments"
              element={<AdminLabAppointments />}
            />

            <Route path="/admin/lab-diagnosis" element={<AdminDiagnosis />} />
            <Route path="/admin/orders" element={<AdminOrderHistories />} />
            <Route path="/admin/category" element={<AdminPharmacyCategory />} />
            <Route
              path="/admin/verifications"
              element={<VerificationQueue basePath="/admin" />}
            />
            <Route
              path="/admin/verifications/:type/:id"
              element={<VerificationDetail basePath="/admin" />}
            />
            <Route
              path="/admin/provider-reports"
              element={<ProviderReports basePath="/admin" />}
            />
            <Route path="/admin/overview" element={<AdminOverview basePath="/admin" />} />
            <Route path="/admin/operations" element={<LiveOperations />} />
            <Route path="/admin/support" element={<SupportList audience="admin" basePath="/admin/support" />} />
            <Route path="/admin/support/scorecard" element={<SupportScorecard basePath="/admin" />} />
            <Route path="/admin/support/:id" element={<SupportThread audience="admin" basePath="/admin/support" />} />
            <Route path="/admin/providers/:type/:id" element={<ProviderAccount basePath="/admin" />} />
          </Route>
        </Route>

        {/* SUPER ADMIN ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={["super_admin"]} />}>
          <Route element={<SuperAdminLayout />}>
            <Route
              path="/super-admin/dashboard"
              element={<SuperAdminDashboard />}
            />
            <Route
              path="/super-admin/transactions"
              element={<SuperAdminTransactions />}
            />
            <Route
              path="/super-admin/payments"
              element={<SuperAdminPayment />}
            />
            <Route
              path="/super-admin/messages"
              element={<SuperAdminMessages />}
            />
            <Route
              path="/super-admin/doctors"
              element={<SuperAdminDoctorList />}
            />
            <Route
              path="/super-admin/admins"
              element={<SuperAdminAdminList />}
            />
            <Route path="/super-admin/labs" element={<SuperAdminLabList />} />
            <Route
              path="/super-admin/pharmacists"
              element={<SuperAdminPharmacyList />}
            />
            <Route
              path="/super-admin/patients"
              element={<SuperAdminPatientList />}
            />
            <Route
              path="/super-admin/doctor-appointments"
              element={<SuperAdminDoctorAppointments />}
            />
            <Route
              path="/super-admin/lab-appointments"
              element={<SuperAdminLabAppointments />}
            />
            <Route
              path="/super-admin/consultation"
              element={<SuperAdminConsultation />}
            />
            <Route
              path="/super-admin/lab-diagnosis"
              element={<SuperAdminDiagnosis />}
            />
            <Route
              path="/super-admin/orders"
              element={<SuperAdminOrderHistories />}
            />
            <Route
              path="/super-admin/category"
              element={<SuperAdminPharmacyCategory />}
            />
            <Route
              path="/super-admin/call-recordings"
              element={<SuperAdminCallRecordings />}
            />
            <Route
              path="/super-admin/settings"
              element={<MarketplaceSettingsPage />}
            />
            <Route
              path="/super-admin/verifications"
              element={<VerificationQueue basePath="/super-admin" />}
            />
            <Route
              path="/super-admin/verifications/:type/:id"
              element={<VerificationDetail basePath="/super-admin" />}
            />
            <Route
              path="/super-admin/provider-reports"
              element={<ProviderReports basePath="/super-admin" />}
            />
            <Route path="/super-admin/overview" element={<AdminOverview basePath="/super-admin" />} />
            <Route path="/super-admin/operations" element={<LiveOperations />} />
            <Route path="/super-admin/support" element={<SupportList audience="admin" basePath="/super-admin/support" />} />
            <Route path="/super-admin/support/scorecard" element={<SupportScorecard basePath="/super-admin" />} />
            <Route path="/super-admin/support/:id" element={<SupportThread audience="admin" basePath="/super-admin/support" />} />
            <Route path="/super-admin/providers/:type/:id" element={<ProviderAccount basePath="/super-admin" />} />
            <Route path="/super-admin/commission" element={<CommissionReport />} />
          </Route>
        </Route>

        {/* Catch-all route for 404 Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default router;
