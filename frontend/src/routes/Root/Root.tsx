import { Outlet } from 'react-router-dom';
import Header from '../../components/ui/Header';

export default function Root() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
