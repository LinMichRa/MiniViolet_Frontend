import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [productos, setProductos] = useState([]);
  const [nuevo, setNuevo] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: '',
    stock: '',
    imagen: null,
  });

  const cargarProductos = async () => {
    try {
      const res = await API.get('/products/');
      setProductos(res.data);
    } catch (err) {
      console.error('Error al cargar productos', err);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const handleAdd = async () => {
    const formData = new FormData();
    formData.append('nombre', nuevo.nombre);
    formData.append('descripcion', nuevo.descripcion);
    formData.append('precio', nuevo.precio);
    formData.append('categoria', nuevo.categoria);
    formData.append('stock', nuevo.stock);
    if (nuevo.imagen) formData.append('imagen', nuevo.imagen);

    try {
      await API.post('/products/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setNuevo({ nombre: '', descripcion: '', precio: '', categoria: '', stock: '', imagen: null });
      cargarProductos();
    } catch (err) {
      console.error('Error al crear producto', err);
    }
  };

  const handleAgregarCarrito = async (productId: number) => {
    try {
      await API.post('/cart/add', { product_id: productId, cantidad: 1 });
      alert('Producto añadido al carrito');
    } catch (err) {
      console.error('Error al añadir al carrito', err);
    }
  };

  return (
    <div className="container">
      <h2>Dashboard ({user?.rol})</h2>
      <button onClick={logout} className="btn btn-danger">Salir</button>

      {user?.rol === 'admin' && (
        <div className="panel panel-default">
          <div className="panel-heading">Agregar nuevo producto</div>
          <div className="panel-body">
            <input className="form-control" placeholder="Nombre" value={nuevo.nombre} onChange={e => setNuevo({ ...nuevo, nombre: e.target.value })} />
            <input className="form-control" placeholder="Descripción" value={nuevo.descripcion} onChange={e => setNuevo({ ...nuevo, descripcion: e.target.value })} />
            <input className="form-control" placeholder="Precio" value={nuevo.precio} onChange={e => setNuevo({ ...nuevo, precio: e.target.value })} />
            <input className="form-control" placeholder="Categoría" value={nuevo.categoria} onChange={e => setNuevo({ ...nuevo, categoria: e.target.value })} />
            <input className="form-control" placeholder="Stock" value={nuevo.stock} onChange={e => setNuevo({ ...nuevo, stock: e.target.value })} />
            
            <button className="btn btn-primary" onClick={handleAdd}>Guardar Producto</button>
          </div>
        </div>
      )}

      <div className="row">
        {productos.map((p: any) => (
          <div key={p.id} className="col-md-4">
            <div className="panel panel-default">
              <div className="panel-heading">{p.nombre}</div>
              <div className="panel-body">
                {p.imagen_url && <img src={p.imagen_url} alt={p.nombre} style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} />}
                <p>{p.descripcion}</p>
                <p><strong>${p.precio}</strong></p>
                {user?.rol === 'user' && (
                  <button className="btn btn-success" onClick={() => handleAgregarCarrito(p.id)}>Agregar al carrito</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}