import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function ProtectedRoute({ auth }: { auth: AuthContext }) {
  return auth.isAuthenticated
    ? <Outlet />
    : <Navigate to="/login" replace state={{ logout: true }} />;
}
