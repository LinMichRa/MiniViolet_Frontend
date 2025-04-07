import { useEffect, useState } from 'react';
import API from '../services/api';

export default function AdminProducts() {
  const [productos, setProductos] = useState([]);
  const [nuevo, setNuevo] = useState({ nombre: '', descripcion: '', precio: '', categoria: '', stock: '' });

  const cargarProductos = async () => {
    const res = await API.get('/products/');
    setProductos(res.data);
  };

  useEffect(() => { cargarProductos(); }, []);

  const handleAdd = async () => {
    await API.post('/products/', nuevo);
    setNuevo({ nombre: '', descripcion: '', precio: '', categoria: '', stock: '' });
    cargarProductos();
  };

  const handleDelete = async (id: number) => {
    await API.delete(`/products/${id}`);
    cargarProductos();
  };

  return (
    <div className="container">
      <h3>Administrar Productos</h3>
      <div className="form-inline">
        <input placeholder="Nombre" value={nuevo.nombre} onChange={e => setNuevo({ ...nuevo, nombre: e.target.value })} />
        <input placeholder="Descripción" value={nuevo.descripcion} onChange={e => setNuevo({ ...nuevo, descripcion: e.target.value })} />
        <input placeholder="Precio" value={nuevo.precio} onChange={e => setNuevo({ ...nuevo, precio: e.target.value })} />
        <input placeholder="Categoría" value={nuevo.categoria} onChange={e => setNuevo({ ...nuevo, categoria: e.target.value })} />
        <input placeholder="Stock" value={nuevo.stock} onChange={e => setNuevo({ ...nuevo, stock: e.target.value })} />
        <button className="btn btn-primary" onClick={handleAdd}>Agregar</button>
      </div>

      <ul>
        {productos.map((p: any) => (
          <li key={p.id}>{p.nombre} - ${p.precio}
            <button className="btn btn-danger btn-xs" onClick={() => handleDelete(p.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}