// src/components/ProductImage/ProductImage.jsx
import { useState } from 'react';
import './productimage.css';

const ProductImage = ({ images, title, thumbnail }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  // Get all available images
  const getAllImages = () => {
    if (images && images.length > 0) {
      return images;
    }
    if (thumbnail) {
      return [thumbnail];
    }
    return [];
  };

  const availableImages = getAllImages();

  const handleImageError = () => {
    setImageError(true);
  };

  const getCurrentImage = () => {
    if (!imageError && availableImages.length > 0) {
      return availableImages[currentIndex];
    }
    return `https://via.placeholder.com/400x300/667eea/ffffff?text=${encodeURIComponent(title)}`;
  };

  const goToImage = (index) => {
    setCurrentIndex(index);
    setImageError(false);
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % availableImages.length);
    setImageError(false);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + availableImages.length) % availableImages.length);
    setImageError(false);
  };

  if (availableImages.length === 0) {
    return (
      <div className="product-image-container">
        <img 
          src={`https://via.placeholder.com/400x300/667eea/ffffff?text=${encodeURIComponent(title)}`}
          alt={title}
          className="product-image-main"
        />
      </div>
    );
  }

  return (
    <div className="product-image-container">
      <div className="main-image-wrapper">
        <img 
          src={getCurrentImage()} 
          alt={title}
          className="product-image-main"
          onError={handleImageError}
        />
        
        {availableImages.length > 1 && (
          <>
            <button className="image-nav prev" onClick={prevImage}>
              ‹
            </button>
            <button className="image-nav next" onClick={nextImage}>
              ›
            </button>
          </>
        )}
      </div>

      {availableImages.length > 1 && (
        <div className="image-thumbnails">
          {availableImages.map((img, index) => (
            <div 
              key={index}
              className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToImage(index)}
            >
              <img src={img} alt={`${title} ${index + 1}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImage;
