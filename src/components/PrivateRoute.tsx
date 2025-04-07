import { JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children, role }: { children: JSX.Element, role?: 'admin' | 'user' }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && user.rol !== role) return <Navigate to="/" />;
  return children;
}
