// src/components/Header/Header.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaShoppingCart, FaSearch, FaSignInAlt } from 'react-icons/fa'
import { useCart } from '../../context/cart'
import { useAuth } from '../../context/auth'
import UserProfile from '../auth/UserProfile'
import './header.css'

const Header = ({ cartCount = 0, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const { setIsCartOpen } = useCart()
  const { user } = useAuth()

  const handleSubmit = (event) => {
    event.preventDefault()
    if (onSearch) {
      onSearch(searchTerm)
    }
  }

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h1 onClick={() => window.location.href = '/'} style={{ cursor: 'pointer' }}>
            ShopVerse
          </h1>
        </div>
        
        <div className="header-actions">
          <form className="search-bar" onSubmit={handleSubmit}>
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">
              <FaSearch />
            </button>
          </form>
          
          <div className="header-icons">
            <span className="cart-icon" onClick={() => setIsCartOpen(true)}>
              <FaShoppingCart />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </span>
            
            {/* Auth Section */}
            <div className="auth-header">
              {user ? (
                <UserProfile />
              ) : (
                <Link to="/signin" className="signin-link">
                  <FaSignInAlt /> Sign in
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
