// src/components/auth/GoogleSignIn.jsx
import { FaGoogle } from 'react-icons/fa'
import { useAuth } from '../../context/auth'
import './Auth.css'

const GoogleSignIn = () => {
  const { signInWithGoogle, loading } = useAuth()

  return (
    <button 
      className="google-signin-btn" 
      onClick={signInWithGoogle}
      disabled={loading}
    >
      <FaGoogle />
      <span>Sign in with Google</span>
    </button>
  )
}

export default GoogleSignIn