import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import FarmerLogin from './pages/FarmerLogin';
import ConsumerLogin from './pages/ConsumerLogin';
import ProductsPage from './pages/ProductsPage';
import Cart from './pages/Cart';
import ProductDetails from './pages/ProductDetails';
import OrderHistory from './pages/OrderHistory';
import TrackOrder from './pages/TrackOrder';
import Navbar from './components/Navbar';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import FarmerProfile from './pages/FarmerProfile';
import FarmerDashboard from './pages/FarmerDashboard';
import ChatPage from './pages/ChatPage';
import HelpPage from './pages/HelpPage';
import ScrollToTop from './components/ScrollToTop';
import ConsumerProfile from './pages/ConsumerProfile';
import ConsumerOrders from './pages/ConsumerOrders';
import MyProducts from './MyProducts';   // Adjust path if needed
import Orders from './Orders';           // Adjust path if needed
import Messages from './Messages';       // Adjust path if needed
import 'leaflet/dist/leaflet.css';


function AppContent() {
  const location = useLocation();

  // Paths where NO navbar should be shown
  const noNavbarPaths = ['/help/farmer', '/help/consumer'];

  const showNavbar = !noNavbarPaths.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/farmer-login" element={<FarmerLogin />} />
        <Route path="/consumer-login" element={<ConsumerLogin />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order-history" element={<OrderHistory />} />
        <Route path="/track-order" element={<TrackOrder />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/farmer-profile" element={<FarmerProfile />} />
        <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
        <Route path="/help/:userType" element={<HelpPage />} />
        <Route path="/consumer-profile" element={<ConsumerProfile />} />
        <Route path="/consumer-orders" element={<ConsumerOrders />} />
        <Route path="/farmer-products" element={<MyProducts />} />
        <Route path="/farmer-orders" element={<Orders />} />
        <Route path="/farmer-messages" element={<Messages />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <AppContent />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
