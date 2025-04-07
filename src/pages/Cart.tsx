import { useEffect, useState } from 'react';
import API from '../services/api';

export default function Cart() {
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  const cargarCarrito = async () => {
    const res = await API.get('/cart/');
    setItems(res.data);
    setTotal(res.data.reduce((sum: number, i: any) => sum + i.product.precio * i.cantidad, 0));
  };

  useEffect(() => {
    cargarCarrito();
  }, []);

  const realizarPago = async () => {
    const res = await API.post('/orders/checkout');
    alert(res.data.message);
    cargarCarrito();
  };

  return (
    <div className="container">
      <h3>Carrito de Compras</h3>
      {items.map((item: any) => (
        <p key={item.id}>{item.product.nombre} x {item.cantidad} = ${item.product.precio * item.cantidad}</p>
      ))}
      <h4>Total: ${total}</h4>
      <button className="btn btn-primary" onClick={realizarPago}>Pagar</button>
    </div>
  );
}