import { Link, useLocation } from 'react-router-dom';
import './Header.css';

export default function Header() {
  const location = useLocation();

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
          <li><Link to="/login">Create an Event</Link></li>
          <li style={{ flex: 1 }} />
          <li><Link to="/login">Profile</Link></li>
          <li><Link to="/login">Log in</Link></li>
        </ul>
      </nav>
    </header>
  );
}
