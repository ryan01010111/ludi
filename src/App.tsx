import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { useEffect } from 'react';
import Root from './routes/Root/Root';
import ErrorPage from './components/ErrorPage';
import Home from './routes/Home/Home';
import SignUp, { action as signUpAction } from './routes/SignUp/SignUp';
import Login, { action as loginAction } from './routes/Login/Login';
import Search, { loader as searchLoader } from './routes/Search/Search';
import { useAuth } from './contexts/AuthContext';

export default function App() {
  const {
    isAuthenticated, authUser, login, signUp,
  } = useAuth();

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
          action: signUpAction(signUp),
        },
        {
          path: '/login',
          element: <Login />,
          action: loginAction(login),
        },
      ],
    },
  ]);

  useEffect(() => {
    (async () => {
      if (isAuthenticated) return;
      await authUser();
    })();
  }, [isAuthenticated, authUser]);

  return (
    <div id="app">
      <RouterProvider router={router} />
    </div>
  );
}
