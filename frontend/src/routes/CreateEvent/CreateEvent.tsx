import { AuthContext } from '../../contexts/AuthContext';

export default function CreateEvent() {
  return (
    <h1>Create Event Page</h1>
  );
}

export const loader = (
  auth: AuthContext,
) => async () => {
  const res = await fetch('/api/auth/test', {
    headers: { Authorization: `Bearer ${auth.accessToken}` },
  });
  const data = await res.json();
  console.log(data);

  return null;
};
