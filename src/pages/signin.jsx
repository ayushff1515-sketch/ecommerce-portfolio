// src/pages/SignIn.jsx
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaGoogle, FaLock, FaEnvelope, FaUserPlus, FaArrowLeft, FaUser } from 'react-icons/fa'
import { useAuth } from '../context/auth'
import './signin.css'

const SignIn = () => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [localError, setLocalError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const { signInWithEmail, signUp, signInWithGoogle, authLoading, authError, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) navigate('/', { replace: true })
  }, [navigate, user])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLocalError('')
    setSuccessMessage('')

    if (!email.trim()) {
      setLocalError('Please enter your email address.')
      return
    }
    if (isSignUp && !firstName.trim()) {
      setLocalError('Please enter your first name.')
      return
    }
    if (isSignUp && !lastName.trim()) {
      setLocalError('Please enter your last name.')
      return
    }
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters long.')
      return
    }

    const result = isSignUp
      ? await signUp(email.trim(), password, firstName.trim(), lastName.trim())
      : await signInWithEmail(email.trim(), password)

    if (result.success && result.requiresEmailConfirmation) {
      setSuccessMessage('Check your inbox and confirm your email address before signing in.')
      setPassword('')
    } else if (result.success) {
      navigate('/')
    }
  }

  const handleGoogleSignIn = () => {
    signInWithGoogle()
  }

  const toggleMode = () => {
    setIsSignUp((prev) => !prev)
    setLocalError('')
    setSuccessMessage('')
    setFirstName('')
    setLastName('')
  }

  const errorMessage = localError || authError

  return (
    <section className="signin-page">
      <div className="signin-card">
        <Link to="/" className="signin-back-link">
          <FaArrowLeft /> Back to shop
        </Link>

        <div className="signin-heading">
          <h1>{isSignUp ? 'Create your account' : 'Welcome back'}</h1>
          <p>{isSignUp ? 'Join ShopVerse to enjoy a seamless shopping experience.' : 'Sign in to continue shopping with ShopVerse.'}</p>
        </div>

        <form className="signin-form" onSubmit={handleSubmit}>
          {isSignUp && (
            <div className="signin-name-fields">
              <label className="signin-field">
                <span>First name</span>
                <div className="signin-input-wrap">
                  <FaUser className="signin-input-icon" />
                  <input
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    autoComplete="given-name"
                    required
                  />
                </div>
              </label>
              <label className="signin-field">
                <span>Last name</span>
                <div className="signin-input-wrap">
                  <FaUser className="signin-input-icon" />
                  <input
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    autoComplete="family-name"
                    required
                  />
                </div>
              </label>
            </div>
          )}
          <label className="signin-field">
            <span>Email</span>
            <div className="signin-input-wrap">
              <FaEnvelope className="signin-input-icon" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </label>

          <label className="signin-field">
            <span>Password</span>
            <div className="signin-input-wrap">
              <FaLock className="signin-input-icon" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                required
              />
            </div>
          </label>

          {errorMessage && <p className="signin-error">{errorMessage}</p>}
          {successMessage && <p className="signin-success" role="status">{successMessage}</p>}

          <button
            type="submit"
            className="signin-submit-btn"
            disabled={authLoading}
          >
            {authLoading ? (
              'Please wait...'
            ) : isSignUp ? (
              <><FaUserPlus /> Create account</>
            ) : (
              <><FaLock /> Sign in</>
            )}
          </button>
        </form>

        <div className="signin-divider">
          <span>or continue with</span>
        </div>

        <button
          className="signin-google-btn"
          onClick={handleGoogleSignIn}
          disabled={authLoading}
        >
          <FaGoogle />
          <span>Sign in with Google</span>
        </button>

        <p className="signin-toggle">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button type="button" onClick={toggleMode}>
            {isSignUp ? 'Sign in' : 'Create account'}
          </button>
        </p>
      </div>
    </section>
  )
}

export default SignIn
