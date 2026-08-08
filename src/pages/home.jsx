// src/pages/Home.jsx
import ProductCard from '../components/productCard/productCard';
import Loader from '../components/loader/loader';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaHeadset, FaLock, FaTruck, FaUndoAlt } from 'react-icons/fa';
import './home.css';

const Home = ({ products, onAddToCart, loading }) => {
  if (loading) {
    return <Loader />;
  }

  return (
    <div className="home">
      <section className="hero-section">
        <div className="hero-content">
          <p className="eyebrow">THE NEW SEASON IS HERE</p>
          <h1>Discover things<br /><em>you’ll love.</em></h1>
          <p>Thoughtfully selected products, easy shopping, and a little everyday delight — all in one place.</p>
          <div className="hero-actions">
            <Link className="cta-button" to="/products">Shop collection <FaArrowRight /></Link>
            <span className="hero-note">Free delivery on orders over $50</span>
          </div>
          <div className="hero-metrics">
            <div><strong>10k+</strong><span>happy shoppers</span></div>
            <div><strong>4.8/5</strong><span>average rating</span></div>
            <div><strong>24h</strong><span>dispatch promise</span></div>
          </div>
        </div>
        <div className="hero-orb hero-orb-one" />
        <div className="hero-orb hero-orb-two" />
        <div className="hero-sparkle sparkle-one">✦</div>
        <div className="hero-sparkle sparkle-two">✧</div>
      </section>

      <section className="featured-section">
        <div className="section-heading">
          <div><p className="eyebrow">CURATED FOR YOU</p><h2>Featured finds</h2></div>
          <Link to="/products" className="text-link">View all products <FaArrowRight /></Link>
        </div>
        {products.length === 0 ? (
          <p className="no-products">No featured products available</p>
        ) : (
          <div className="featured-grid">
            {products.map(product => (
              <ProductCard 
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}
      </section>

      <section className="features-section">
        <div className="feature-card">
          <span className="feature-icon shipping"><FaTruck /></span>
          <h3>Free Shipping</h3>
          <p>On orders over $50</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon payment"><FaLock /></span>
          <h3>Secure Payment</h3>
          <p>100% secure transactions</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon support"><FaHeadset /></span>
          <h3>24/7 Support</h3>
          <p>Dedicated customer service</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon returns"><FaUndoAlt /></span>
          <h3>Money Back</h3>
          <p>30-day return policy</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
