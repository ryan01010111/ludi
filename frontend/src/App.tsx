import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { useEffect } from 'react';
import Root from './routes/Root/Root';
import ErrorPage from './components/ErrorPage';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './routes/Home/Home';
import SignUp, { action as signUpAction } from './routes/SignUp/SignUp';
import ConfirmSignUp, { loader as confirmSignUpLoader } from './routes/ConfirmSignUp/ConfirmSignUp';
import Login, { action as loginAction } from './routes/Login/Login';
import Logout, { loader as logoutLoader } from './routes/Logout/Logout';
import LogoutSuccess from './routes/LogoutSuccess/LogoutSuccess';
import Search, { loader as searchLoader } from './routes/Search/Search';
import { useAuth } from './contexts/AuthContext';

export default function App() {
  const auth = useAuth();

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Root />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: '/search',
          element: <Search />,
          loader: searchLoader,
        },
        {
          path: '/sign-up',
          element: <SignUp />,
          action: signUpAction(auth),
        },
        {
          path: '/confirm-sign-up',
          element: <ConfirmSignUp />,
          loader: confirmSignUpLoader(auth),
        },
        {
          path: '/login',
          element: <Login />,
          action: loginAction(auth),
        },
        {
          path: '/logout',
          element: <Logout />,
          loader: logoutLoader(auth),
        },
        {
          path: '/logout-success',
          element: <LogoutSuccess />,
        },
        {
          element: <ProtectedRoute auth={auth} />,
          children: [
            {
              path: '/create-event',
              element: <h1>Create Event Page</h1>,
            },
          ],
        },
      ],
    },
  ]);

  useEffect(() => {
    (async () => {
      if (auth.isAuthenticated) return;
      await auth.authUser();
    })();
  }, [auth]);

  return (
    <div id="app">
      <RouterProvider router={router} />
    </div>
  );
}
