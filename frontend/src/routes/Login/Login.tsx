import { useEffect } from 'react';
import {
  ActionFunction, Form, Link, Navigate, useActionData, useNavigate,
} from 'react-router-dom';
import { Icon } from '@iconify/react';
import { AuthContext, useAuth } from '../../contexts/AuthContext';
import TextInput from '../../components/forms/TextInput';
import Button from '../../components/Button';
import { ActionData } from '../../types';
import './Login.css';

export default function Login() {
  const auth = useAuth();
  const navigate = useNavigate();
  const actionData = useActionData() as ActionData<typeof action>;

  useEffect(() => {
    // TODO: go to prev URL if appropriate
    if (actionData?.success) navigate('/');
  }, [actionData?.success, navigate]);

  if (auth.isAuthenticated) return <Navigate to="/" replace />;

  return (
    <div id="login-page">
      <div id="login-title">
        <Icon id="login-title-icon" icon="fa:address-book-o" />
        <h1>Log in</h1>
      </div>

      <Form id="login-form" method="post" action="/login">
        <TextInput
          type="text"
          name="emailAddress"
          placeholder="Email"
          width="50vw"
          margin="0 0 50px 0"
        />
        <TextInput
          type="password"
          name="password"
          placeholder="Password"
          width="50vw"
          margin="0 0 50px 0"
        />
        <label htmlFor="remember-me-checkbox">
          <input id="remember-me-checkbox" type="checkbox" name="rememberMe" />
          Remember me
        </label>
        <div id="login-button-container">
          <div />
          <Button type="submit" width={180} margin="0 24px">Log in</Button>
          <Link to="/TODO">Forgot your password?</Link>
        </div>
      </Form>

      <p id="sign-up-cta">
        Not a
        {' '}
        <strong>Member</strong>
        {' '}
        yet?
        {' '}
        <Link to="/sign-up">Sign up</Link>
      </p>
    </div>
  );
}

export const action = (
  auth: AuthContext,
) => async ({ request }: Parameters<ActionFunction>[0]) => {
  const formData = await request.formData();
  const emailAddress = formData.get('emailAddress')?.toString();
  const password = formData.get('password')?.toString();
  if (!emailAddress || !password) {
    // TODO
    throw new Error('missing param(s)');
  }
  await auth.login({ emailAddress, password });

  const rememberMe = formData.get('rememberMe')?.toString();
  if (rememberMe) {
    // TODO
  }

  return { success: true };
};
