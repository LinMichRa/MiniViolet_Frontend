import { useEffect, useState } from 'react';
import API from '../services/api';

interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  imagen_url: string;
  stock: number;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    API.get('/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleAddToCart = (productId: number) => {
    API.post('/cart/add', { product_id: productId, cantidad: 1 })
      .then(() => alert('Producto añadido al carrito'))
      .catch(() => alert('Debes iniciar sesión para agregar al carrito'));
  };

  return (
    <div className="container">
      <h2>Productos</h2>
      <div className="row">
        {products.map(p => (
          <div key={p.id} className="col-sm-4">
            <div className="panel panel-default">
              <div className="panel-heading">{p.nombre}</div>
              <div className="panel-body">
                {p.imagen_url && <img src={p.imagen_url} className="img-responsive" />}
                <p>{p.descripcion}</p>
                <p><strong>${p.precio}</strong></p>
                <button className="btn btn-primary" onClick={() => handleAddToCart(p.id)}>Agregar al carrito</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}