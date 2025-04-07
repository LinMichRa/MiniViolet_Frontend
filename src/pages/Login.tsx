import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', form);
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} className="form">
        <input type="text" name="username" placeholder="Usuario" onChange={handleChange} required className="form-control" />
        <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} required className="form-control" />
        <button className="btn btn-primary">Entrar</button>
      </form>
      {error && <div className="alert alert-danger mt-2">{error}</div>}
    </div>
  );
}