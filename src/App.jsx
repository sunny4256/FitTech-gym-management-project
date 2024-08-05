import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ProgramsSection from './components/ProgramsSection';
import WhyChooseUsSection from './components/WhyChooseUsSection';
import PlansSection from './components/PlansSection';
import TestimonialsSection from './components/TestimonialsSection';
import Footer from './components/Footer';
import Login from './components/Login';
import Register from './components/Register';
import Checkout from './components/Checkout';
import PaymentSuccess from './components/PaymentSuccess';
import AdminDashboard from './components/AdminDashboard';
import TrainerDashboard from './components/TrainerDashboard';
import TrainerLogin from './components/TrainerLogin';
import './index.css';

function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    if (cart.length === 0) {
      setCart([item]);
    } else {
      alert("You can only add one item to the cart.");
    }
  };

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <Router>
      <div className="App">
        <ConditionalHeader cart={cart} clearCart={clearCart} removeFromCart={removeFromCart} />
        <Routes>
          <Route path="/" element={
            <>
              <HeroSection />
              <div id="programs-section">
                <ProgramsSection />
              </div>
              <div id="why-choose-us-section">
                <WhyChooseUsSection />
              </div>
              <div id="plans-section">
                <PlansSection addToCart={addToCart} />
              </div>
              <div id="testimonials-section">
                <TestimonialsSection />
              </div>
              <Footer />
            </>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/checkout" element={<Checkout clearCart={clearCart} />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/trainer-dashboard" element={<TrainerDashboard />} />
          <Route path="/trainer-login" element={<TrainerLogin />} />
        </Routes>
      </div>
    </Router>
  );
}

const ConditionalHeader = ({ cart, clearCart, removeFromCart }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/checkout' || location.pathname === '/admin-dashboard' || location.pathname === '/trainer-dashboard' || location.pathname === '/trainer-login' || location.pathname === '/payment-success';
  return !isAuthPage ? <Header cart={cart} clearCart={clearCart} removeFromCart={removeFromCart} /> : null;
};

export default App;
