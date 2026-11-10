import { useAuth } from '@/providers/AuthProvider';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

type ProtectedRouteProps = {
  allowedRoles: Array<'user' | 'admin' | 'doctor' | 'pharmacy' | 'lab_technician' | 'ambulance_operator' | 'super_admin'>;
};

/** The sign-in page for the kind of account a dashboard area belongs to. */
function loginPathFor(roles: ProtectedRouteProps['allowedRoles']): string {
  if (roles.includes('user')) return '/login';
  if (roles.includes('super_admin')) return '/super-admin/login';
  if (roles.includes('admin')) return '/admin/login';
  return '/partners/login';
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Remember where a visitor was heading (for example checkout, after
    // booking a test on the public site) so sign-in brings them back.
    if (allowedRoles.includes('user')) {
      try {
        sessionStorage.setItem('returnTo', location.pathname + location.search);
      } catch {
        // Private browsing: they land on the dashboard instead.
      }
    }
    return <Navigate to={loginPathFor(allowedRoles)} replace />;
  }

  if (user.status === "unverified") {
    return <Navigate to="/user/verify-email" replace />;
  }

if (
  user &&
  !user.emailVerifiedAt &&
  ['user', 'doctor', 'pharmacy', 'lab_technician', 'ambulance_operator'].includes(user.userType)
) {
  const redirectPath = user.userType === 'user' ? '/user/verify-email' : '/verify-email';
  return <Navigate to={redirectPath} />;
}


  if (!allowedRoles.includes(user.userType)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (user === null) {
  return <div className="flex items-center justify-center min-h-screen">Loading...</div>; // or a spinner
}


  return <Outlet />;
};

export default ProtectedRoute;
