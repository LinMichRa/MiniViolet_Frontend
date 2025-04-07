// ...otros imports
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

export default function Dashboard() {
  const { user, logout } = useAuth();

  const [productos, setProductos] = useState([]);
  const [carritoCount, setCarritoCount] = useState(0);
  const [editando, setEditando] = useState<null | number>(null);

  const [nuevo, setNuevo] = useState<{
    nombre: string;
    descripcion: string;
    precio: string;
    categoria: string;
    stock: string;
    imagen: File | null;
  }>({
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

  const cargarConteoCarrito = async () => {
    try {
      const res = await API.get('/cart/');
      const totalItems = res.data.reduce((sum: number, i: any) => sum + i.cantidad, 0);
      setCarritoCount(totalItems);
    } catch (err) {
      console.error('Error al cargar el carrito', err);
    }
  };

  useEffect(() => {
    cargarProductos();
    cargarConteoCarrito();
  }, []);

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('nombre', nuevo.nombre);
    formData.append('descripcion', nuevo.descripcion);
    formData.append('precio', nuevo.precio);
    formData.append('categoria', nuevo.categoria);
    formData.append('stock', nuevo.stock);
    if (nuevo.imagen) formData.append('imagen', nuevo.imagen);

    try {
      if (editando !== null) {
        await API.put(`/products/${editando}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await API.post('/products/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      setNuevo({ nombre: '', descripcion: '', precio: '', categoria: '', stock: '', imagen: null });
      setEditando(null);
      cargarProductos();
    } catch (err) {
      console.error('Error al guardar producto', err);
    }
  };

  const handleAgregarCarrito = async (productId: number) => {
    try {
      await API.post('/cart/add', { product_id: productId, cantidad: 1 });
      await cargarConteoCarrito();
      alert('Producto añadido al carrito');
    } catch (err) {
      console.error('Error al añadir al carrito', err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await API.delete(`/products/${id}`);
      cargarProductos();
    } catch (err) {
      console.error('Error al eliminar producto', err);
    }
  };

  const handleEdit = (producto: any) => {
    setNuevo({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      categoria: producto.categoria,
      stock: producto.stock,
      imagen: null,
    });
    setEditando(producto.id);
  };

  const handlePagar = async () => {
    try {
      const res = await API.post('orders/checkout');
      alert(`Pago ${res.data.estado === 'pagado' ? 'exitoso' : 'fallido'}`);
      cargarProductos();
      cargarConteoCarrito();
    } catch (err) {
      console.error('Error en el pago', err);
      alert('Error al procesar el pago');
    }
  };

  return (
    <div className="container">
      <h2>Dashboard ({user?.rol})</h2>
      <button onClick={logout} className="btn btn-danger">Salir</button>

      {user?.rol === 'admin' && (
  <div className="panel panel-default mt-4">
    <div className="panel-heading">Agregar / Editar producto</div>
    <div className="panel-body">
      <input
        className="form-control mb-2"
        placeholder="Nombre"
        value={nuevo.nombre}
        onChange={e => setNuevo({ ...nuevo, nombre: e.target.value })}
      />
      <input
        className="form-control mb-2"
        placeholder="Descripción"
        value={nuevo.descripcion}
        onChange={e => setNuevo({ ...nuevo, descripcion: e.target.value })}
      />
      <input
        className="form-control mb-2"
        placeholder="Precio"
        value={nuevo.precio}
        onChange={e => setNuevo({ ...nuevo, precio: e.target.value })}
      />
      <input
        className="form-control mb-2"
        placeholder="Categoría"
        value={nuevo.categoria}
        onChange={e => setNuevo({ ...nuevo, categoria: e.target.value })}
      />
      <input
        className="form-control mb-2"
        placeholder="Stock"
        value={nuevo.stock}
        onChange={e => setNuevo({ ...nuevo, stock: e.target.value })}
      />

      <input
        type="file"
        className="form-control mb-2"
        accept="image/*"
        onChange={(e) => setNuevo({ ...nuevo, imagen: e.target.files?.[0] || null })}
      />

      <button className="btn btn-primary" onClick={handleSave}>
        {editando !== null ? 'Actualizar Producto' : 'Guardar Producto'}
      </button>
    </div>
  </div>
)}

      <h4 className="mt-4">Productos en el carrito: {carritoCount}</h4>

      {user?.rol === 'user' && carritoCount > 0 && (
        <button className="btn btn-primary mb-3" onClick={handlePagar}>
          Pagar ahora
        </button>
      )}

      <div className="row mt-3">
        {productos.map((p: any) => (
          <div key={p.id} className="col-md-4 mb-3">
            <div className="panel panel-default">
              <div className="panel-heading"><strong>{p.nombre}</strong></div>
              <div className="panel-body">
                {p.imagen_url && (
                  <img
                    src={p.imagen_url}
                    alt={p.nombre}
                    style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }}
                  />
                )}
                <p>{p.descripcion}</p>
                <p><strong>${p.precio}</strong></p>

                {user?.rol === 'user' && (
                  <button className="btn btn-success" onClick={() => handleAgregarCarrito(p.id)}>Agregar al carrito</button>
                )}

                {user?.rol === 'admin' && (
                  <>
                    <button className="btn btn-warning mx-1" onClick={() => handleEdit(p)}>Editar</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(p.id)}>Eliminar</button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
