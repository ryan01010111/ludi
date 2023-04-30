import {
  LoaderFunction, Navigate, redirect, useLoaderData,
} from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { LoaderData } from '../../types';

export default function Logout() {
  const loaderData = useLoaderData() as LoaderData<ReturnType<typeof loader>>;
  return loaderData.success
    ? <Navigate to="/logout-success" state={{ logout: true }} replace />
    : <Navigate to="/" replace />;
}

export const loader = (
  auth: AuthContext,
) => (async () => {
  if (!auth.isAuthenticated) return redirect('/');
  const success = await auth.logout();
  // TODO
  if (!success) throw new Error('Error while logging out');
  return { success };
}) satisfies LoaderFunction;
