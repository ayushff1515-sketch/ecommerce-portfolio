// src/components/auth/UserProfile.jsx
import { FaSignOutAlt, FaUserCircle } from 'react-icons/fa'
import { useAuth } from '../../context/auth'
import './Auth.css'

const UserProfile = () => {
  const { user, signOut } = useAuth()

  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'
  const avatarUrl = user?.user_metadata?.avatar_url

  return (
    <div className="user-profile">
      {avatarUrl ? (
        <img className="user-avatar" src={avatarUrl} alt={userName} />
      ) : (
        <FaUserCircle className="user-avatar-icon" />
      )}
      <span className="user-name" title={user?.email}>{userName}</span>
      <button className="sign-out-btn" onClick={signOut} title="Sign out">
        <FaSignOutAlt />
      </button>
    </div>
  )
}

export default UserProfile

