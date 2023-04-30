import { useEffect } from 'react';
import {
  ActionFunction, Form, Link, useActionData, useNavigate,
} from 'react-router-dom';
import { Icon } from '@iconify/react';
import { AuthContext } from '../../contexts/AuthContext';
import TextInput from '../../components/forms/TextInput';
import Button from '../../components/Button';
import { ActionData } from '../../types';
import './SignUp.css';

const inputParamsArr = [
  { type: 'text', name: 'emailAddress', placeholder: 'Email' },
  { type: 'text', name: 'username', placeholder: 'Username' },
  { type: 'password', name: 'password', placeholder: 'Password' },
  { type: 'password', name: 'confirmPassword', placeholder: 'Confirm Password' },
];

export default function SignUp() {
  const navigate = useNavigate();
  const actionData = useActionData() as ActionData<typeof action>;

  useEffect(() => {
    // TODO: go to prev URL if appropriate
    if (actionData?.success) navigate('/');
  }, [actionData?.success, navigate]);

  return (
    <div id="sign-up-page">
      <div id="sign-up-title">
        <Icon id="sign-up-title-icon" icon="fa:address-book-o" />
        <h1>Sign up</h1>
      </div>

      <Form id="sign-up-form" method="post" action="/sign-up">
        {inputParamsArr.map(inputParams => (
          <TextInput
            key={inputParams.name}
            type={inputParams.type}
            name={inputParams.name}
            placeholder={inputParams.placeholder}
            width="50vw"
            margin="0 0 50px 0"
          />
        ))}
        <Button type="submit" width={180} margin="0 24px">Sign up</Button>
      </Form>

      <p id="login-cta">
        Already a
        {' '}
        <strong>Member</strong>
        {' '}
        ?
        {' '}
        <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}

export const action = (
  auth: AuthContext,
) => async ({ request }: Parameters<ActionFunction>[0]) => {
  const formData = await request.formData();
  const username = formData.get('username')?.toString();
  const emailAddress = formData.get('emailAddress')?.toString();
  const password = formData.get('password')?.toString();
  const confirmPassword = formData.get('confirmPassword')?.toString();
  if (!username || !emailAddress || !password || !confirmPassword) {
    // TODO
    throw new Error('missing param(s)');
  }
  if (password !== confirmPassword) throw new Error('passwords don\'t match');

  await auth.signUp({
    username,
    emailAddress,
    password,
  });

  return { success: true };
};
