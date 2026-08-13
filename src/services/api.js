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
      const response = await fetch(`${this.baseUrl}/products?limit=0`);
      if (!response.ok) {
        throw new Error('Search failed');
      }
      const data = await response.json();
      const searchTerms = normalizeSearchText(query).split(' ').filter(Boolean);
      return data.products
        .map((product) => {
          const searchableText = [
          product.title,
          product.description,
          product.brand,
          product.category,
          ...(product.tags || []),
          ].map(normalizeSearchText).join(' ');
          const words = searchableText.split(' ').filter(Boolean);
          const score = searchTerms.reduce((total, term) => total + getMatchScore(term, searchableText, words), 0);
          return { product, score };
        })
        .filter(({ score }) => score > 0)
        .sort((first, second) => second.score - first.score || first.product.title.localeCompare(second.product.title))
        .map(({ product }) => product);
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }

  // Get top-rated products from the live catalogue for the homepage.
  async getFeaturedProducts(limit = 4) {
    try {
      const response = await fetch(`${this.baseUrl}/products?limit=100`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      return data.products
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  }

}

const normalizeSearchText = (value) => String(value || '')
  .toLocaleLowerCase()
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();

const editDistance = (first, second) => {
  const previous = Array.from({ length: second.length + 1 }, (_, index) => index);
  for (let row = 1; row <= first.length; row += 1) {
    let diagonal = previous[0];
    previous[0] = row;
    for (let column = 1; column <= second.length; column += 1) {
      const saved = previous[column];
      previous[column] = Math.min(
        previous[column] + 1,
        previous[column - 1] + 1,
        diagonal + (first[row - 1] === second[column - 1] ? 0 : 1),
      );
      diagonal = saved;
    }
  }
  return previous[second.length];
};

const getMatchScore = (term, searchableText, words) => {
  if (searchableText.includes(term)) return term.length >= 4 ? 6 : 4;
  if (term.length < 3) return 0;

  const closeWord = words.find((word) => {
    const maxDistance = term.length >= 6 ? 2 : 1;
    return Math.abs(word.length - term.length) <= maxDistance && editDistance(term, word) <= maxDistance;
  });
  return closeWord ? 2 : 0;
};

export default new ApiService();
