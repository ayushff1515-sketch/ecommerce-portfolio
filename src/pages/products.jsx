// src/pages/Products.jsx
import { useMemo, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Sidebar from '../components/sidebar/sidebar';
import ProductCard from '../components/productCard/productCard';
import Loader from '../components/loader/loader';
import { useCategories } from '../hooks/useProducts';
import './products.css';

const Products = ({ products, onAddToCart, loading, searchQuery }) => {
  const productsPerPage = 9;
  const [sortOption, setSortOption] = useState('default');
  const [filters, setFilters] = useState({ category: 'All', priceRange: [0, Number.POSITIVE_INFINITY] });
  const [currentPage, setCurrentPage] = useState(1);
  const { categories, loading: categoriesLoading } = useCategories();

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (filters.category !== 'All') {
      result = result.filter((product) => product.category === filters.category);
    }

    if (Number.isFinite(filters.priceRange[1])) {
      result = result.filter((product) => Number(product.price) <= filters.priceRange[1]);
    }

    const byTitle = (first, second) =>
      String(first.title || '').localeCompare(String(second.title || ''));
    const byPrice = (direction) => (first, second) => {
      const priceDifference = Number(first.price || 0) - Number(second.price || 0);
      return priceDifference === 0 ? byTitle(first, second) : priceDifference * direction;
    };

    switch (sortOption) {
      case 'price-low':
        return [...result].sort(byPrice(1));
      case 'price-high':
        return [...result].sort(byPrice(-1));
      case 'rating':
        return [...result].sort((first, second) => {
          const ratingDifference = Number(second.rating || 0) - Number(first.rating || 0);
          return ratingDifference === 0 ? byTitle(first, second) : ratingDifference;
        });
      default:
        return result;
    }
  }, [products, filters, sortOption]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / productsPerPage));
  const activePage = Math.min(currentPage, totalPages);
  const pageProducts = useMemo(() => {
    const startIndex = (activePage - 1) * productsPerPage;
    return filteredProducts.slice(startIndex, startIndex + productsPerPage);
  }, [activePage, filteredProducts]);

  const pageNumbers = useMemo(() => {
    const start = Math.max(1, Math.min(activePage - 2, totalPages - 4));
    const end = Math.min(totalPages, start + 4);
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }, [activePage, totalPages]);

  const handleFilterChange = ({ category, priceRange }) => {
    setFilters({ category, priceRange });
    setCurrentPage(1);
  };

  const handleSort = (option) => {
    setSortOption(option);
    setCurrentPage(1);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="products-page">
      <div className="products-header">
        <div>
          <h1>{searchQuery ? `Results for "${searchQuery}"` : 'All Products'}</h1>
          <p className="product-count">{filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'} to explore</p>
        </div>
        <div className="sort-controls">
          <label>Sort by:</label>
          <select 
            value={sortOption} 
            onChange={(e) => handleSort(e.target.value)}
          >
            <option value="default">Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </div>

      <div className="products-layout">
        <Sidebar 
          onFilterChange={handleFilterChange}
          categories={categories}
          loading={categoriesLoading}
        />
        <div className="products-grid">
          {filteredProducts.length === 0 ? (
            <div className="no-products">
              <p>No products found matching your criteria</p>
            </div>
          ) : (
            pageProducts.map(product => (
              <ProductCard 
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))
          )}
        </div>
      </div>

      {filteredProducts.length > productsPerPage && (
        <nav className="pagination" aria-label="Products pagination">
          <p className="pagination-summary">
            Showing {(activePage - 1) * productsPerPage + 1}–{Math.min(activePage * productsPerPage, filteredProducts.length)} of {filteredProducts.length}
          </p>
          <div className="pagination-controls">
            <button
              className="pagination-button pagination-arrow"
              onClick={() => setCurrentPage(Math.max(1, activePage - 1))}
              disabled={activePage === 1}
              aria-label="Previous page"
            >
              <FaChevronLeft />
            </button>
            {pageNumbers.map((page) => (
              <button
                key={page}
                className={`pagination-button ${activePage === page ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
                aria-label={`Page ${page}`}
                aria-current={activePage === page ? 'page' : undefined}
              >
                {page}
              </button>
            ))}
            <button
              className="pagination-button pagination-arrow"
              onClick={() => setCurrentPage(Math.min(totalPages, activePage + 1))}
              disabled={activePage === totalPages}
              aria-label="Next page"
            >
              <FaChevronRight />
            </button>
          </div>
        </nav>
      )}
    </div>
  );
};

export default Products;
