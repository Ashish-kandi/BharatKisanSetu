import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import VoiceCommand from '../components/VoiceCommand';

// Demo dataset: other farmers selling these products
const otherFarmersData = {
  Tomatoes: [
    { name: 'Amit', price: 21, phone: '9876543210', avatar: '👨‍🌾' },
    { name: 'Sunita', price: 20, phone: '9876501234', avatar: '👩‍🌾' }
  ],
  Onions: [
    { name: 'Raj', price: 24, phone: '9876512345', avatar: '👨‍🌾' }
  ],
  Potatoes: [
    { name: 'Priya', price: 19, phone: '9876523456', avatar: '👩‍🌾' }
  ],
  Carrots: [
    { name: 'Vikram', price: 32, phone: '9876534567', avatar: '👨‍🌾' },
    { name: 'Lakshmi', price: 31, phone: '9876545678', avatar: '👩‍🌾' }
  ]
};

function FarmerDashboard() {
  const location = useLocation();
  const storedFarmer = JSON.parse(localStorage.getItem('farmer'));
  const farmer = location.state?.farmer || storedFarmer || {
    name: 'Ramesh Kumar',
    phone: '9876543210',
    address: 'Nalgonda, Telangana',
    avatar: 'https://thumbs.dreamstime.com/z/happy-indian-farmer-holding-sickle-paddy-crop-hand-concept-good-yields-due-to-monsoon-rains-217982627.jpg',
  };

  // Farmer's own products (with farmer info)
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Tomatoes',
      price: 20,
      icon: '🍅',
      seller: { ...farmer }
    },
    {
      id: 2,
      name: 'Onions',
      price: 25,
      icon: '🧅',
      seller: { ...farmer }
    },
    {
      id: 3,
      name: 'Potatoes',
      price: 18,
      icon: '🥔',
      seller: { ...farmer }
    },
    {
      id: 4,
      name: 'Carrots',
      price: 30,
      icon: '🥕',
      seller: { ...farmer }
    }
  ]);

  // Orders (static for demo, but can be made dynamic)
  const [orders] = useState([
    { id: 101, product: 'Tomatoes', quantity: 10, customer: 'Ravi', status: 'Delivered', date: '2025-06-10', address: 'Hyderabad' },
    { id: 102, product: 'Onions', quantity: 5, customer: 'Sita', status: 'Shipped', date: '2025-06-11', address: 'Warangal' },
    { id: 103, product: 'Carrots', quantity: 8, customer: 'Lakshmi', status: 'Processing', date: '2025-06-12', address: 'Nizamabad' },
    { id: 104, product: 'Potatoes', quantity: 15, customer: 'Anil', status: 'Delivered', date: '2025-06-09', address: 'Karimnagar' },
    { id: 105, product: 'Tomatoes', quantity: 12, customer: 'Priya', status: 'Shipped', date: '2025-06-12', address: 'Khammam' },
    { id: 106, product: 'Onions', quantity: 7, customer: 'Ramesh', status: 'Delivered', date: '2025-06-08', address: 'Adilabad' },
    { id: 107, product: 'Carrots', quantity: 9, customer: 'Swathi', status: 'Processing', date: '2025-06-12', address: 'Suryapet' },
    { id: 108, product: 'Potatoes', quantity: 11, customer: 'Vijay', status: 'Shipped', date: '2025-06-11', address: 'Nalgonda' }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '' });

  // For product icons
  const productIcons = {
    Tomatoes: '🍅',
    Onions: '🧅',
    Potatoes: '🥔',
    Carrots: '🥕'
  };

  const handleInputChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;
    setProducts([
      ...products,
      {
        id: products.length + 1,
        name: newProduct.name,
        price: Number(newProduct.price),
        icon: productIcons[newProduct.name] || '🛒',
        seller: { ...farmer }
      }
    ]);
    setNewProduct({ name: '', price: '' });
    setShowAddModal(false);
  };

  // Reports
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const bestSeller = (() => {
    if (orders.length === 0) return null;
    const count = {};
    orders.forEach(o => {
      count[o.product] = (count[o.product] || 0) + o.quantity;
    });
    let max = 0, best = '';
    Object.entries(count).forEach(([prod, qty]) => {
      if (qty > max) { max = qty; best = prod; }
    });
    return { name: best, qty: max };
  })();

  return (
    <div style={styles.container}>
      <VoiceCommand />

      {/* Header */}
      <div style={styles.headerCard}>
        <div style={styles.avatarSection}>
          <img
            src={farmer.avatar}
            alt={farmer.name}
            style={{ ...styles.avatar, objectFit: 'cover' }}
            onError={e => (e.target.src = 'https://thumbs.dreamstime.com/z/happy-indian-farmer-holding-sickle-paddy-crop-hand-concept-good-yields-due-to-monsoon-rains-217982627.jpg')}
          />
          <div>
            <h1 style={styles.welcome}>
              Welcome, <span style={styles.farmerName}>{farmer?.name || 'Farmer'}</span>
            </h1>
            <div style={styles.infoRow}>
              <span style={styles.infoIcon}>📞</span> {farmer?.phone}
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoIcon}>📍</span> {farmer?.address}
            </div>
          </div>
        </div>
        <div style={styles.quickActions}>
          <button style={styles.actionBtn} onClick={() => setShowAddModal(true)}>
            + Add Product
          </button>
          <button style={styles.actionBtn} onClick={() => setShowReportModal(true)}>
            📊 View Reports
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div style={styles.grid}>
        {/* Products */}
        <section style={styles.card}>
          <h2 style={styles.sectionTitle}>🧺 My Products</h2>
          {products.length > 0 ? (
            <div style={styles.productGrid}>
              {products.map(product => (
                <div key={product.id} style={styles.productCard}>
                  <div style={styles.productIcon}>{product.icon}</div>
                  <div style={styles.productNameRow}>
                    <span style={styles.productName}>{product.name}</span>
                    <span style={styles.productPrice}>₹{product.price}/kg</span>
                  </div>
                  <div style={styles.farmerListTitle}>Sellers for {product.name}</div>
                  <div style={styles.farmerListPanelAlways}>
                    {/* Always show the logged-in farmer as a seller */}
                    <div style={styles.farmerRow}>
                      <img
                        src={product.seller.avatar}
                        alt={product.seller.name}
                        style={{ width: 24, height: 24, borderRadius: '50%', marginRight: 6, objectFit: 'cover' }}
                        onError={e => (e.target.src = 'https://i.ibb.co/3T2TtL8/farmer-avatar.jpg')}
                      />
                      <span style={styles.farmerNameText}>{product.seller.name}</span>
                      <span style={styles.farmerPrice}>₹{product.price}/kg</span>
                      <span style={styles.farmerPhone}>📞 {product.seller.phone}</span>
                    </div>
                    {/* Show other demo farmers if available */}
                    {otherFarmersData[product.name]?.map((f, idx) => (
                      <div key={idx} style={styles.farmerRow}>
                        <span style={styles.farmerAvatar}>{f.avatar}</span>
                        <span style={styles.farmerNameText}>{f.name}</span>
                        <span style={styles.farmerPrice}>₹{f.price}/kg</span>
                        <span style={styles.farmerPhone}>📞 {f.phone}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No products listed yet.</p>
          )}
        </section>

        {/* Orders */}
        <section style={styles.card}>
          <h2 style={styles.sectionTitle}>📦 Recent Orders</h2>
          {orders.length > 0 ? (
            <ul style={styles.orderList}>
              {orders.map(order => (
                <li key={order.id} style={styles.orderItem}>
                  <div style={styles.orderLeft}>
                    <span style={styles.orderBadge}>{order.quantity}kg</span>
                    <b>{order.product}</b>
                  </div>
                  <div style={styles.orderRight}>
                    <span style={styles.orderCustomer}>by {order.customer}</span>
                    <span style={styles.orderAddress}>{order.address}</span>
                    <span style={styles.orderDate}>{order.date}</span>
                    <span style={{
                      ...styles.statusBadge,
                      background: order.status === 'Delivered' ? '#b7e4c7': order.status === 'Shipped' ? '#ffd60a'
                        : '#f8d7da',
                      color: order.status === 'Delivered' ? '#2d6a4f'
                        : order.status === 'Shipped' ? '#7c4700'
                        : '#b71c1c'
                    }}>
                      {order.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No orders yet.</p>
          )}
        </section>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3>Add New Product</h3>
            <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={newProduct.name}
                onChange={handleInputChange}
                style={styles.input}
                required
              />
              <input
                type="number"
                name="price"
                placeholder="Price (₹/kg)"
                value={newProduct.price}
                onChange={handleInputChange}
                style={styles.input}
                required
                min="1"
              />
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button type="submit" style={styles.actionBtn}>Add</button>
                <button type="button" style={styles.actionBtn} onClick={() => setShowAddModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Reports Modal */}
      {showReportModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3>📊 Your Reports</h3>
            <ul style={{ marginTop: 18, marginBottom: 18, fontSize: '1.1rem', lineHeight: 1.7 }}>
              <li><b>Total Products:</b> {totalProducts}</li>
              <li><b>Total Orders:</b> {totalOrders}</li>
              <li>
                <b>Best Seller:</b>{' '}
                {bestSeller
                  ? `${bestSeller.name} (${bestSeller.qty}kg sold)`
                  : 'N/A'}
              </li>
            </ul>
            <button style={styles.actionBtn} onClick={() => setShowReportModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ...styles (same as your previous code)...
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #e0f7fa 0%, #fffde4 100%)',
    fontFamily: 'Segoe UI, Arial, sans-serif',
    padding: '0',
    margin: '0',
  },
  headerCard: {
    background: 'linear-gradient(90deg, #2d6a4f 60%, #95d5b2 100%)',
    color: '#fff',
    padding: '32px 20px 20px 20px',
    borderRadius: '0 0 32px 32px',
    boxShadow: '0 4px 24px rgba(44, 62, 80, 0.12)',
    marginBottom: '24px',
    textAlign: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '24px',
  },
  avatarSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '22px',
  },
  avatar: {
    fontSize: '3.2rem',
    background: '#fff',
    borderRadius: '50%',
    width: '70px',
    height: '70px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(44,62,80,0.08)',
    color: '#2d6a4f',
  },
  welcome: {
    margin: '0 0 8px 0',
    fontWeight: 700,
    fontSize: '2rem',
    letterSpacing: '1px',
  },
  farmerName: {
    color: '#ffd60a',
    fontWeight: 800,
  },
  infoRow: {
    margin: '2px 0',
    fontSize: '1.08rem',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  infoIcon: {
    fontSize: '1.2rem',
  },
  quickActions: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  actionBtn: {
    background: '#ffd60a',
    color: '#2d6a4f',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 18px',
    fontWeight: 600,
    fontSize: '1rem',
    cursor: 'pointer',
    boxShadow: '0 1px 4px rgba(44,62,80,0.08)',
    transition: 'background 0.18s',
  },
  grid: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '32px',
    margin: '0 0 32px 0',
  },
  card: {
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 2px 12px rgba(44, 62, 80, 0.08)',
    padding: '28px 20px 20px 20px',
    minWidth: '320px',
    maxWidth: '460px',
    flex: '1 1 340px',
    margin: '0 10px',
    textAlign: 'left',
    transition: 'transform 0.15s',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  sectionTitle: {
    color: '#2d6a4f',
    fontWeight: 700,
    marginBottom: '18px',
    fontSize: '1.3rem',
    letterSpacing: '0.5px',
  },
  productGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '18px',
    justifyContent: 'flex-start',
  },
  productCard: {
    background: '#f1f5f9',
    borderRadius: '12px',
    padding: '18px 20px 16px 20px',
    marginBottom: '8px',
    minWidth: '220px',
    boxShadow: '0 1px 4px rgba(44, 62, 80, 0.06)',
    textAlign: 'left',
    flex: '1 1 220px',
    transition: 'box-shadow 0.2s, transform 0.15s, border-color 0.2s',cursor: 'default',
    border: '2px solid #b7e4c7',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    position: 'relative',
    overflow: 'hidden'
  },
  productIcon: {
    fontSize: '2.2rem',
    marginBottom: '8px',
    alignSelf: 'center'
  },
  productNameRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '10px',
    marginBottom: '5px',
    width: '100%',
    justifyContent: 'space-between'
  },
  productName: {
    fontWeight: 700,
    fontSize: '1.18rem',
    color: '#1b4332',
    letterSpacing: 0.2
  },
  productPrice: {
    color: '#2d6a4f',
    fontWeight: 500,
    fontSize: '1.07rem',
  },
  farmerListTitle: {
    fontWeight: 600,
    margin: '10px 0 6px 0',
    color: '#2d6a4f',
    fontSize: 15,
    textAlign: 'left'
  },
  farmerListPanelAlways: {
    width: '100%',
    borderRadius: 8,
    background: '#fff',
    boxShadow: '0 1px 4px rgba(44,62,80,0.05)',
    padding: '8px 8px',
    marginBottom: 0
  },
  farmerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 6,
    background: '#f8f9fa',
    borderRadius: 6,
    padding: '6px 8px',
    fontSize: 15,
    boxShadow: '0 1px 2px rgba(44,62,80,0.04)'
  },
  farmerAvatar: {
    fontSize: 22,
    marginRight: 6
  },
  farmerNameText: {
    fontWeight: 500,
    minWidth: 70
  },
  farmerPrice: {
    color: '#2d6a4f',
    marginLeft: 8,
    fontWeight: 600
  },
  farmerPhone: {
    color: '#888',
    marginLeft: 8,
    fontSize: 13
  },
  noOtherFarmers: {
    color: '#888',
    fontSize: 14,
    margin: '8px 0'
  },
  orderList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    width: '100%'
  },
  orderItem: {
    background: '#f8f9fa',
    margin: '8px 0',
    padding: '14px 18px',
    borderRadius: '10px',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 1px 4px rgba(44, 62, 80, 0.04)',
    gap: '14px',
    flexWrap: 'wrap'
  },orderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  orderBadge: {
    background: '#2d6a4f',
    color: '#fff',
    borderRadius: '6px',
    padding: '2px 10px',
    fontWeight: 700,
    fontSize: '0.98rem',
    letterSpacing: '0.5px',
    marginRight: '8px',
  },
  orderRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  orderCustomer: {
    color: '#1b4332',
    fontWeight: 500,
    fontSize: '0.98rem'
  },
  orderAddress: {
    color: '#888',
    fontSize: '0.98rem'
  },
  orderDate: {
    color: '#888',
    fontSize: '0.98rem'
  },
  statusBadge: {
    borderRadius: '6px',
    padding: '2px 10px',
    fontWeight: 700,
    fontSize: '0.9rem',
    marginLeft: '8px',
    background: '#eee',
    color: '#333',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modalContent: {
    background: '#fff',
    borderRadius: 12,
    padding: 32,
    minWidth: 320,
    maxWidth: '90vw',
    boxShadow: '0 4px 24px rgba(44,62,80,0.15)',
    textAlign: 'center'
  },
  input: {
    padding: 10,
    borderRadius: 6,
    border: '1px solid #ccc',
    fontSize: '1rem'
  }
};


export default FarmerDashboard;
