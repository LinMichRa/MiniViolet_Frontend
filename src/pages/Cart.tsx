import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

interface CartItem {
  id: number;
  product: { nombre: string; precio: number; };
  cantidad: number;
  product_id: number;
}

export default function Cart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/cart')
      .then(res => setItems(res.data))
      .catch(() => navigate('/login'));
  }, []);

  const handleRemove = (id: number) => {
    API.delete(`/cart/remove/${id}`)
      .then(() => setItems(items.filter(i => i.product_id !== id)));
  };

  const handleCheckout = () => {
    API.post('/orders/checkout')
      .then(() => {
        alert('Pago simulado exitosamente 🎉');
        navigate('/dashboard');
      })
      .catch(() => alert('Error al procesar orden'));
  };

  const total = items.reduce((acc, i) => acc + i.cantidad * i.product.precio, 0);

  return (
    <div className="container">
      <h2>Carrito</h2>
      {items.map(item => (
        <div key={item.id} className="panel panel-default">
          <div className="panel-body">
            <strong>{item.product.nombre}</strong> - {item.cantidad} x ${item.product.precio}
            <button className="btn btn-danger btn-sm pull-right" onClick={() => handleRemove(item.product_id)}>Eliminar</button>
          </div>
        </div>
      ))}
      <h4>Total: ${total.toFixed(2)}</h4>
      <button className="btn btn-success" onClick={handleCheckout}>Finalizar Compra</button>
    </div>
  );
}