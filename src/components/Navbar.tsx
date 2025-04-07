import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-default">
      <div className="container-fluid">
        <div className="navbar-header">
          <Link className="navbar-brand" to="/">MiniViolet</Link>
        </div>
        <ul className="nav navbar-nav">
          {user?.rol === 'admin' && <li><Link to="/admin">Admin</Link></li>}
          <li><Link to="/shop">Tienda</Link></li>
          <li><Link to="/cart">Carrito</Link></li>
        </ul>
        <ul className="nav navbar-nav navbar-right">
          {user ? (
            <>
              <li><span className="navbar-text">Hola, {user.username}</span></li>
              <li><button className="btn btn-link navbar-btn" onClick={logout}>Cerrar sesión</button></li>
            </>
          ) : (
            <li><Link to="/login">Login</Link></li>
          )}
        </ul>
      </div>
    </nav>
  );
}