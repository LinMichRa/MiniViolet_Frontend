import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    tipo_identificacion: '',
    identificacion: '',
    fecha_nacimiento: '',
    username: '',
    password: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', form);
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Error al registrar');
    }
  };

  return (
    <div className="container">
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleSubmit} className="form">
        <input name="nombre" placeholder="Nombre" onChange={handleChange} required className="form-control" />
        <input name="apellido" placeholder="Apellido" onChange={handleChange} required className="form-control" />
        <input name="tipo_identificacion" placeholder="Tipo ID" onChange={handleChange} required className="form-control" />
        <input name="identificacion" placeholder="Identificación" onChange={handleChange} required className="form-control" />
        <input type="date" name="fecha_nacimiento" onChange={handleChange} required className="form-control" />
        <input name="username" placeholder="Usuario" onChange={handleChange} required className="form-control" />
        <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} required className="form-control" />
        <button className="btn btn-success">Registrarse</button>
      </form>
      {error && <div className="alert alert-danger mt-2">{error}</div>}
    </div>
  );
}