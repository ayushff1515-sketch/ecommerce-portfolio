// src/components/Sidebar/Sidebar.jsx
import { useState } from 'react';
import { FaFilter, FaTag, FaStar, FaCheck } from 'react-icons/fa';
import './sidebar.css';

const Sidebar = ({ onFilterChange, categories = [], loading = false }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 1000]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    onFilterChange({ category, priceRange });
  };

  const handlePriceChange = (e) => {
    const newPrice = [0, parseInt(e.target.value)];
    setPriceRange(newPrice);
    onFilterChange({ category: selectedCategory, priceRange: newPrice });
  };

  // Format category name
  const formatCategoryName = (category) => {
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <h3><FaFilter /> Categories</h3>
        {loading ? (
          <p>Loading categories...</p>
        ) : (
          <ul className="category-list">
            <li 
              className={`category-item ${selectedCategory === 'All' ? 'active' : ''}`}
              onClick={() => handleCategoryClick('All')}
            >
              <FaCheck className="check-icon" /> All Products
            </li>
            {categories.map((category) => (
              <li 
                key={category}
                className={`category-item ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => handleCategoryClick(category)}
              >
                <FaTag className="category-icon" /> {formatCategoryName(category)}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="sidebar-section">
        <h3><FaStar /> Price Range</h3>
        <div className="price-range">
          <input 
            type="range" 
            min="0" 
            max="1000" 
            value={priceRange[1]}
            onChange={handlePriceChange}
          />
          <div className="price-labels">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      <div className="sidebar-section">
        <h3>Rating</h3>
        <div className="rating-filters">
          {[5, 4, 3, 2, 1].map((rating) => (
            <label key={rating} className="rating-label">
              <input type="checkbox" />
              <span>{'★'.repeat(rating)}</span>
              <span className="rating-count">({rating})</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
