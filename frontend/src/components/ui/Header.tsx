import { Link, useLocation } from 'react-router-dom';
import './Header.css';
import { useAuth } from '../../contexts/AuthContext';

export default function Header() {
  const auth = useAuth();
  const location = useLocation();

  let loginLogoutNavItem: null | JSX.Element = null;
  if (location.pathname !== '/login') {
    loginLogoutNavItem = auth.isAuthenticated
      ? <li><Link to="/logout">Log out</Link></li>
      : <li><Link to="/login">Log in</Link></li>;
  }

  return (
    <header
      id="header"
      className={location.pathname === '/' ? 'home-header' : ''}
    >
      <Link id="header-logo-link" to="/">
        <img src="/logo.png" alt="Ludi logo" />
      </Link>

      <nav>
        <ul>
          <li><Link to="/login">About Us</Link></li>
          <li><Link to="/create-event">Create an Event</Link></li>
          <li style={{ flex: 1 }} />
          <li><Link to="/login">Profile</Link></li>
          {loginLogoutNavItem}
        </ul>
      </nav>
    </header>
  );
}
