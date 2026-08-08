import { Link, useParams } from 'react-router-dom';
import ProductImage from '../components/productImage/productImage';
import Loader from '../components/loader/loader';
import { useCart } from '../context/cart';
import { useProduct } from '../hooks/useProducts';
import './productDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const { product, loading, error } = useProduct(id);
  const { addToCart } = useCart();

  if (loading) return <Loader />;

  if (error || !product) {
    return (
      <section className="product-detail-message">
        <h1>Product unavailable</h1>
        <p>{error || 'This product could not be found.'}</p>
        <Link to="/products">Back to products</Link>
      </section>
    );
  }

  return (
    <section className="product-detail">
      <Link className="back-link" to="/products">← Back to products</Link>
      <div className="product-detail-content">
        <ProductImage images={product.images} thumbnail={product.thumbnail} title={product.title} />
        <div className="product-detail-info">
          <p className="product-category">{product.category}</p>
          <h1>{product.title}</h1>
          <p className="product-detail-rating">★ {Number(product.rating || 0).toFixed(1)}</p>
          <p className="product-detail-price">${Number(product.price || 0).toFixed(2)}</p>
          <p>{product.description}</p>
          <p>{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p>
          <button onClick={() => addToCart(product)} disabled={product.stock === 0}>
            {product.stock === 0 ? 'Out of stock' : 'Add to cart'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;
