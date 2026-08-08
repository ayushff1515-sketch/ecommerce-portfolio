// src/services/api.js
class ApiService {
  constructor() {
    this.baseUrl = 'https://dummyjson.com';
  }

  // Get all products with pagination
  async getAllProducts(limit = 30, skip = 0) {
    try {
      const response = await fetch(`${this.baseUrl}/products?limit=${limit}&skip=${skip}`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  // Get single product by ID
  async getProductById(id) {
    try {
      const response = await fetch(`${this.baseUrl}/products/${id}`);
      if (!response.ok) {
        throw new Error('Product not found');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  // Get products by category
  async getProductsByCategory(category) {
    try {
      const response = await fetch(`${this.baseUrl}/products/category/${category}`);
      if (!response.ok) {
        throw new Error('Category not found');
      }
      const data = await response.json();
      return data.products;
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  }

  // Get all categories
  async getAllCategories() {
    try {
      const response = await fetch(`${this.baseUrl}/products/categories`);
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const categories = await response.json();
      return categories.map((category) =>
        typeof category === 'string' ? category : category.slug
      );
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  // Search products
  async searchProducts(query) {
    try {
      const response = await fetch(`${this.baseUrl}/products/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Search failed');
      }
      const data = await response.json();
      return data.products;
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }

  // Get featured products (top rated)
  async getFeaturedProducts(limit = 4) {
    try {
      const response = await fetch(`${this.baseUrl}/products?limit=100`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      // Sort by rating and return top products
      return data.products
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  }
}

export default new ApiService();
