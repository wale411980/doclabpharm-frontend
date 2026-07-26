import { useAuth } from '@/providers/AuthProvider';
import { Navigate, Outlet } from 'react-router-dom';

type ProtectedRouteProps = {
  allowedRoles: Array<'user' | 'admin' | 'doctor' | 'pharmacy' | 'lab_technician' | 'super_admin'>;
};

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.status === "unverified") {
    return <Navigate to="/user/verify-email" replace />;
  }

if (
  user &&
  !user.emailVerifiedAt &&
  ['user', 'doctor', 'pharmacy', 'lab_technician'].includes(user.userType)
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
