// src/App.jsx
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { CartProvider } from './context/cartContext';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/auth';
import { useCart } from './context/cart';
import Header from './components/header/header';
import Navbar from './components/navbar/navbar';
import Footer from './components/footer/footer';
import Cart from './components/cart/cart';
import Home from './pages/home';
import Products from './pages/products';
import About from './pages/about';
import ProductDetail from './pages/productDetail';
import Contact from './pages/contact';
import SignIn from './pages/signin';
import Payment from './pages/Payment';
import PaymentSuccess from './pages/PaymentSuccess';
import { useProducts, useFeaturedProducts, useSearch } from './hooks/useProducts';
import './App.css';
import AIChat from "./components/AIChat";

function AppContent() {
  const { cartItems, isCartOpen, setIsCartOpen, addToCart, removeFromCart, updateQuantity } = useCart();
  const { products, loading: productsLoading, error: productsError } = useProducts(30);
  const { products: featuredProducts, loading: featuredLoading } = useFeaturedProducts(4);
  const { results, loading: searchLoading, search } = useSearch();
  const [searchQuery, setSearchQuery] = useState('');
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      search(query);
      navigate('/products');
    }
  };

  const getCartCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  if (productsLoading || authLoading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading amazing products...</p>
      </div>
    );
  }

  if (productsError) {
    return (
      <div className="error-container">
        <p>Something went wrong: {productsError}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="app">
      <Header
        cartCount={getCartCount()}
        onSearch={handleSearch}
        user={user}
      />
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={
            <Home
              products={featuredProducts}
              onAddToCart={addToCart}
              loading={featuredLoading}
            />
          } />
          <Route path="/products" element={
            <Products
              products={searchQuery ? results : products}
              onAddToCart={addToCart}
              loading={searchQuery ? searchLoading : productsLoading}
              searchQuery={searchQuery}
            />
          } />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
        </Routes>
      </main>
      <Footer />
      <Cart
        cartItems={cartItems}
        onRemove={removeFromCart}
        onUpdateQuantity={updateQuantity}
        onClose={() => setIsCartOpen(false)}
        isOpen={isCartOpen}
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppContent />
          <AIChat />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

