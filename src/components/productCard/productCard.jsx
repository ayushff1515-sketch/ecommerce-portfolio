// src/components/ProductCard/ProductCard.jsx (Updated version with better image handling)
import { useState } from 'react';
import { FaStar, FaShoppingCart, FaRegStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './productCard.css';

const ProductCard = ({ product, onAddToCart }) => {
  const { id, title, price, description, thumbnail, images, rating, stock, category } = product;
  const [imageErrors, setImageErrors] = useState({});
  const navigate = useNavigate();

  // Get all available images
  const getAllImages = () => {
    const imageList = [];
    if (images && images.length > 0) {
      imageList.push(...images);
    }
    if (thumbnail && !imageErrors['thumbnail']) {
      imageList.push(thumbnail);
    }
    return imageList;
  };

  const availableImages = getAllImages();

  const handleImageError = (imageSrc) => {
    setImageErrors(prev => ({ ...prev, [imageSrc]: true }));
  };

  const getCurrentImage = () => {
    const validImages = availableImages.filter(img => !imageErrors[img]);
    if (validImages.length > 0) {
      return validImages[0];
    }
    return `https://via.placeholder.com/300x250/667eea/ffffff?text=${encodeURIComponent(title)}`;
  };

  // Calculate star rating
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={`full-${i}`} className="star-filled" />
        ))}
        {hasHalfStar && <FaStar key="half" className="star-half" />}
        {[...Array(emptyStars)].map((_, i) => (
          <FaRegStar key={`empty-${i}`} className="star-empty" />
        ))}
      </>
    );
  };

  const currentImage = getCurrentImage();
  const productDescription = description
    ? `${description.slice(0, 90)}${description.length > 90 ? '…' : ''}`
    : 'No description available.';

  const openProductDetails = () => navigate(`/product/${id}`);

  const handleCardKeyDown = (event) => {
    if (event.target.closest('button, a')) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openProductDetails();
    }
  };

  return (
    <article
      className="product-card"
      onClick={openProductDetails}
      onKeyDown={handleCardKeyDown}
      role="link"
      tabIndex={0}
      aria-label={`View details for ${title}`}
    >
      <div className="product-image">
        <img 
          src={currentImage} 
          alt={title}
          onError={() => handleImageError(currentImage)}
        />
        
        {stock === 0 && <div className="out-of-stock">Out of Stock</div>}
        {stock < 10 && stock > 0 && <div className="low-stock">Low Stock</div>}
        
        <div className="product-actions">
          <button 
            className="add-to-cart-btn" 
            onClick={(event) => {
              event.stopPropagation();
              onAddToCart(product);
            }}
            disabled={stock === 0}
          >
            <FaShoppingCart /> Add to Cart
          </button>
        </div>
      </div>
      <div className="product-info">
        <p className="product-category" title={category}>{category?.replaceAll('-', ' ') || 'ShopVerse pick'}</p>
        <h3 title={title}><span className="product-title">{title}</span></h3>
        <p className="product-description" title={description}>{productDescription}</p>
        <div className="product-rating">
          {renderStars(rating || 0)}
          <span>({(rating || 0).toFixed(1)})</span>
        </div>
        <div className="product-price">
          <span className="price">${Number(price || 0).toFixed(2)}</span>
          <button 
            className="quick-add-btn" 
            onClick={(event) => {
              event.stopPropagation();
              onAddToCart(product);
            }}
            disabled={stock === 0}
          >
            <FaShoppingCart />
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
