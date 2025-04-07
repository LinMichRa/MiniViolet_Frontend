import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    if (user) fetchProducts();
  }, [user]);

  const fetchProducts = async () => {
    try {
      const res = await API.get('/products');
      setProducts(res.data);
    } catch (err: any) {
      console.error('Error al obtener productos', err);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between">
        <h2>Dashboard ({user?.rol})</h2>
        <button className="btn btn-danger" onClick={logout}>Cerrar sesión</button>
      </div>

      {user?.rol === 'admin' && (
        <div className="mt-4">
          <h4>Agregar producto (solo admin)</h4>
        </div>
      )}

      <div className="mt-5">
        <h4>Productos disponibles</h4>
        <div className="row">
          {products.map((prod) => (
            <div className="col-md-4" key={prod.id}>
              <div className="card mb-3">
                <div className="card-body">
                  <h5>{prod.nombre}</h5>
                  <p>{prod.descripcion}</p>
                  <p><b>${prod.precio}</b></p>
                  {user?.rol === 'user' && (
                    <button className="btn btn-primary">Agregar al carrito</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}