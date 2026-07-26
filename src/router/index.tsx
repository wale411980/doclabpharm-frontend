import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/routes/ProtectedRoute";
import Index from "@/pages/common/Index";

import { Login } from "@/components/authAdmin/Login";
import { SuperAdminLogin } from "@/components/authSuperAdmin/Login";

import { ResetPassword } from "@/components/authUser/ResetPassword";
import DoctorLayout from "@/components/layout/DoctorLayout";
import UserLayout from "@/components/layout/UserLayout";
import PharmacyLayout from "@/components/layout/PharmacyLayout";
import LabTechnicianLayout from "@/components/layout/LabTechnicianLayout";
import AdminLayout from "@/components/layout/AdminLayout";
import SuperAdminLayout from "@/components/layout/SuperAdminLayout";
import VerifyEmailNoticePatient from "@/pages/VerifyEmailNoticePatient";
import VerifyEmailNotice from "@/pages/VerifyEmailNotice";
import EnterOTPPatient from "@/pages/EnterOTPPatient";
import { EnterOTP } from "@/pages/EnterOTP";
import Unauthorized from "@/pages/Unauthorized";
import NotFoundPage from "@/pages/PageNotFound";

// COMING SOON PAGE
// import IndexPage from "@/components/newLandingPage/ComingSoonPage";
// MAIN LANDING PAGE
import IndexPage from "@/components/newLandingPage/IndexPage";

import AvailableDoctorsLandingPage from "@/components/newLandingPage/AvailableDoctorsLandingPage";
import DoctorProfileLandingPage from "@/components/newLandingPage/DoctorProfileLandingPage";
import PatientDetailsLandingPage from "@/components/newLandingPage/PatientDetailsLandingPage";
import ConfirmLandingPage from "@/components/newLandingPage/ConfirmLandingPage";
import SelectDateTimeLandingPage from "@/components/newLandingPage/SelectDateTimeLandingPage";
import ConfirmTestLandingPage from "@/components/newLandingPage/ConfirmTestLandingPage";
import CartLandingPage from "@/components/newLandingPage/CartLandingPage";
import CartLoginPage from "@/components/newLandingPage/CartLoginPage";
import PrivacyPolicy from "@/components/newLandingPage/PrivacyPolicy";

import TermsAndConditions from "@/components/newLandingPage/TermsAndConditions";

//Patient imports

import UserDashboard from "@/pages/user/Dashboard";
import DoctorProfile from "@/pages/user/DoctorBooking/DoctorProfile";
import PatientProfile from "@/pages/user/PatientProfile";
import PatientAppointment from "@/pages/user/PatientAppointment";
import PatientOrder from "@/pages/user/PatientOrder";
import PatientPharmacy from "@/pages/user/Pharmacy/PatientPharmacy";
import PatientDetails from "@/pages/user/DoctorBooking/PatientDetails";
import Consultation from "@/pages/user/DoctorBooking/Consultation";
import TestBooking from "@/pages/user/TestBooking";
import TestResults from "@/pages/user/TestResults";
import FirstMessagePage from "@/pages/user/PatientMessages";
import Cart from "@/pages/user/DoctorBooking/Cart";
import Wallet from "@/pages/user/Wallet";
import CheckoutSuccess from "@/pages/user/DoctorBooking/CheckoutSuccess";
import Confirm from "@/pages/user/DoctorBooking/Confirm";
import ConfirmAfterFundingWallet from "@/pages/user/DoctorBooking/ConfirmAfterFundingWallet";
import AvailableDoctors from "@/pages/user/DoctorBooking/AvailableDoctors";
import SelectLab from "@/pages/user/LabBooking/SelectLab";
import ConfirmTest from "@/pages/user/LabBooking/ConfirmTest";
import SelectDateTime from "@/pages/user/LabBooking/SelectDateTime";
import SelectTest from "@/pages/user/LabBooking/SelectTest";
import Notification from "@/pages/user/Notification";

// Doctor imports
import DoctorDashboard from "@/pages/doctor/Dashboard";
import DoctorSettings from "@/pages/doctor/DoctorSettings";
import DoctorAvailability from "@/pages/doctor/DoctorAvailability";
import PatientList from "@/pages/doctor/PatientList";
import PatientDetail from "@/pages/doctor/PatientDetail";
import DoctorAppointment from "@/pages/doctor/DoctorAppointment";
import DoctorPrescriptions from "@/pages/doctor/DoctorPrescriptions";
import MedicalDashboard from "@/pages/doctor/Analytics";
import DoctorWallet from "@/pages/doctor/DoctorWallet";
import DoctorMessages from "@/pages/doctor/DoctorMessages";
import DoctorCallRecordings from "@/pages/doctor/DoctorCallRecordings";

// Pharmacist imports
import PharmacistDashboard from "@/pages/pharmacist/Dashboard";
import PharmacySettings from "@/pages/pharmacist/PharmacySettings";
import OrderManagement from "@/pages/pharmacist/OrderManagement";
import PaymentDashboard from "@/pages/pharmacist/Payment";
import ProductList from "@/pages/pharmacist/ProductList";
import ProductCategory from "@/pages/pharmacist/ProductCategory";
import PharmacyWallet from "@/pages/pharmacist/PharmacyWallet";

// Lab Technician imports
import Dashboard from "@/pages/labTechnician/Dashboard";
import Diagnosis from "@/pages/labTechnician/Diagnosis";
import AppointmentsDashboard from "@/pages/labTechnician/Appointments";
import LabTechnicianWallet from "@/pages/labTechnician/LabTechnicianWallet";
import LabTechnicianSettings from "@/pages/labTechnician/LabTechnicianSettings";
import PatientListLab from "@/pages/labTechnician/PatientListLab";
import PatientDetailLab from "@/pages/labTechnician/PatientDetailLab";

// Admin imports
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminTransactions from "@/pages/admin/AdminTransactions";
import AdminPayment from "@/pages/admin/AdminPayment";

import AdminDoctorList from "@/pages/admin/AdminDoctorList";
import AdminLabList from "@/pages/admin/AdminLabList";
import AdminPharmacyList from "@/pages/admin/AdminPharmacyList";
import AdminPatientList from "@/pages/admin/AdminPatientList";
import AdminDoctorAppointments from "@/pages/admin/AdminDoctorAppointments";
import AdminLabAppointments from "@/pages/admin/AdminLabAppointments";

import AdminDiagnosis from "@/pages/admin/AdminDiagnosis";
import AdminOrderHistories from "@/pages/admin/AdminOrderHistories";
import AdminPharmacyCategory from "@/pages/admin/AdminPharmacyCategory";

// Supeer Admin imports
import SuperAdminDashboard from "@/pages/superAdmin/SuperAdminDashboard";
import SuperAdminTransactions from "@/pages/superAdmin/SuperAdminTransactions";
import SuperAdminPayment from "@/pages/superAdmin/SuperAdminPayment";
import SuperAdminMessages from "@/pages/superAdmin/SuperAdminMessages";
import SuperAdminDoctorList from "@/pages/superAdmin/SuperAdminDoctorList";
import SuperAdminLabList from "@/pages/superAdmin/SuperAdminLabList";
import SuperAdminAdminList from "@/pages/superAdmin/SuperAdminAdminList";
import SuperAdminPharmacyList from "@/pages/superAdmin/SuperAdminPharmacyList";
import SuperAdminPatientList from "@/pages/superAdmin/SuperAdminPatientList";
import SuperAdminDoctorAppointments from "@/pages/superAdmin/SuperAdminDoctorAppointments";
import SuperAdminLabAppointments from "@/pages/superAdmin/SuperAdminLabAppointments";
import SuperAdminConsultation from "@/pages/superAdmin/SuperAdminConsultation";
import SuperAdminDiagnosis from "@/pages/superAdmin/SuperAdminDiagnosis";
import SuperAdminOrderHistories from "@/pages/superAdmin/SuperAdminOrderHistories";
import SuperAdminPharmacyCategory from "@/pages/superAdmin/SuperAdminPharmacyCategory";
import SuperAdminCallRecordings from "@/pages/superAdmin/SuperAdminCallRecordings";
import SuperAdminSettings from "@/pages/superAdmin/SuperAdminSettings";

function router() {
  return (
    <Router>
      <Routes>
        {/* Public pages */}

        <Route path="/admin/login" element={<Login />} />
        <Route path="/super-admin/login" element={<SuperAdminLogin />} />

        <Route path="/password-reset" element={<ResetPassword />} />
        <Route
          path="/user/verify-email"
          element={<VerifyEmailNoticePatient />}
        />
        <Route path="/verify-email" element={<VerifyEmailNotice />} />
        <Route path="/user/enter-otp" element={<EnterOTPPatient />} />
        <Route path="/enter-otp" element={<EnterOTP />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/" element={<IndexPage />} />
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
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />

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
          </Route>
        </Route>

        {/* DOCTOR ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={["doctor"]} />}>
          <Route element={<DoctorLayout />}>
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
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
            <Route path="/doctor/analytics" element={<MedicalDashboard />} />
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
            <Route path="/pharmacy/orders" element={<OrderManagement />} />
            <Route path="/pharmacy/payments" element={<PaymentDashboard />} />
            <Route path="/pharmacy/products-list" element={<ProductList />} />
            <Route
              path="/pharmacy/products-category"
              element={<ProductCategory />}
            />
            <Route path="/pharmacy/wallet" element={<PharmacyWallet />} />
          </Route>
        </Route>

        {/* LABTECHNICIAN ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={["lab_technician"]} />}>
          <Route element={<LabTechnicianLayout />}>
            <Route path="/lab_technician/dashboard" element={<Dashboard />} />
            <Route path="/lab_technician/diagnosis" element={<Diagnosis />} />
            <Route
              path="/lab_technician/appointments"
              element={<AppointmentsDashboard />}
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
              element={<SuperAdminSettings />}
            />
          </Route>
        </Route>

        {/* Catch-all route for 404 Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default router;
