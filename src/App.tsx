import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Root from './routes/Root';
import Home from './routes/Home';
import Search, { loader as searchLoader } from './routes/Search';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <h1>ERROR TODO</h1>,
    children: [
      {
        index: true,
        element: <Home />,
      },
      { path: '/search', element: <Search />, loader: searchLoader },
      { path: '/one', element: <p>one</p> },
      { path: '/two', element: <p>two</p> },
      { path: '/three', element: <p>three</p> },
    ],
  },
]);

export default function App() {
  return (
    <div id="app">
      <RouterProvider router={router} />
    </div>
  );
}
