import { Link, Navigate, useLocation } from 'react-router-dom';

export default function LogoutSuccess() {
  const location = useLocation();

  if (!location.state?.logout) return <Navigate to="/" replace />;

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>You&apos;ve been successfully logged out!</h1>
      <Link to="/" replace>Back to home page</Link>
    </div>
  );
}
