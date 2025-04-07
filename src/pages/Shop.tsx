import { useEffect, useState } from 'react';
import API from '../services/api';

export default function Shop() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    API.get('/products').then(res => setProductos(res.data));
  }, []);

  const agregarAlCarrito = async (product_id: number) => {
    await API.post('/cart/add', { product_id, cantidad: 1 });
    alert('Producto agregado');
  };

  return (
    <div className="container">
      <h3>Tienda</h3>
      <div className="row">
        {productos.map((p: any) => (
          <div key={p.id} className="col-md-4">
            <div className="panel panel-default">
              <div className="panel-heading">{p.nombre}</div>
              <div className="panel-body">
                <p>{p.descripcion}</p>
                <p><strong>${p.precio}</strong></p>
                <button className="btn btn-success" onClick={() => agregarAlCarrito(p.id)}>Agregar al carrito</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}