import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function Register() {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    tipo_identificacion: 'CC',
    identificacion: '',
    fecha_nacimiento: '',
    username: '',
    password: '',
    rol: 'user',
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', form);
      alert('Usuario registrado con éxito');
      navigate('/login');
    } catch (err) {
      alert('Error al registrar');
    }
  };

  return (
    <div className="container">
      <h2>Registro</h2>
      <form onSubmit={handleSubmit} className="form">
        <input name="nombre" placeholder="Nombre" onChange={handleChange} />
        <input name="apellido" placeholder="Apellido" onChange={handleChange} />
        <input name="identificacion" placeholder="Identificación" onChange={handleChange} />
        <input name="fecha_nacimiento" type="date" onChange={handleChange} />
        <input name="username" placeholder="Usuario" onChange={handleChange} />
        <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} />
        <button className="btn btn-success">Registrarse</button>
      </form>
    </div>
  );
}