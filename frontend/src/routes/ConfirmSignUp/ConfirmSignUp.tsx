import { LoaderFunction, redirect } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

export default function ConfirmSignUp() {
  return (
    <h1>Registration confirmed</h1>
  );
}

export const loader = (
  auth: AuthContext,
) => (async ({ request }) => {
  if (auth.isAuthenticated) return redirect('/');

  const url = new URL(request.url);
  const token = url.searchParams.get('token');
  // TODO
  if (!token) throw new Error('Invalid token');
  await auth.confirmSignUp(token);

  return null;
}) satisfies LoaderFunction;
