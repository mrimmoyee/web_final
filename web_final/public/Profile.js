import React from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    const userData = JSON.parse(localStorage.getItem('user'));

    if (!userData || !userData.isLoggedIn) {
      alert('Please log in first!');
      navigate('/login'); 
      return;
    }

    const { role } = userData;

    switch (role) {
      case 'admin':
        navigate('/admin-profile');
        break;
      case 'specialchild':
        navigate('/specialchild-profile');
        break;
      case 'parent':
        navigate('/parent-profile');
        break;
      case 'educator':
        navigate('/educator-profile');
        break;
      default:
        alert('Role not recognized. Redirecting to the home page.');
        navigate('/');
    }
  };

  return (
    <div
      id="profile-container"
      className="profile-container"
      onClick={handleProfileClick}
      style={{ cursor: 'pointer' }} 
    >
      <img
        id="profile-pic"
        src={JSON.parse(localStorage.getItem('user'))?.photoURL || '/default-profile.png'}
        alt="Profile"
        className="profile-pic"
        style={{
          width: '40px', 
          height: '40px',
          borderRadius: '50%',
          objectFit: 'cover',
        }} 
      />
    </div>
  );
};

export default Profile;
