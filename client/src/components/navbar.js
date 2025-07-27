// Navbar.jsx
import React, { useState ,useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import axios from '../axiosConfig';

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
    const [username, setUsername] = useState('');
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    alert("Logged out!");
    navigate('/login');
  };
  const student = localStorage.getItem('student');
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (token) {
          const res = await axios.get('/protected');
          // Adjust this based on your actual response shape
          // For example: res.data.username
          setUsername(res.data.msg || 'User');
        }
      } catch (err) {
        console.error('Error fetching protected data:', err);
      }
    };

    fetchUser();
  }, [token]);

  

  return (
    <nav className="navbar">
      <h2>EduBridge</h2>
            <div className="nav-links">
              <Link to="/">Home</Link>
              {/* <Link to="/contact">Contact Us</Link> */}
      
            
              {!token ? (
                <>
                  <Link to="/login">Login</Link>
                  <Link to="/register">Register</Link>

                </>
              ) : (
                <>
                    <Link to="/chatpage">ChatBox</Link>
                    
                    {student==='school' && <Link to="/match">AI Profile-Match</Link>}
                    {student==='school' && <Link to="/browseseniors">Browse-Seniors</Link>}
                  <Link to="/profile">Profile - {username.split(" ")[1]}</Link>
                  <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </>
              )}
            </div>

      {/* Hamburger for mobile */}
      <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </div>

      {/* Mobile menu */}
      <div className={`mobile-nav ${isOpen ? 'show' : ''}`}>
        <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
        <Link to="/menu" onClick={() => setIsOpen(false)}>Menu</Link>
        <Link to="/recommend" onClick={() => setIsOpen(false)}>Recommend</Link>
        {/* <Link to="/profile" onClick={() => setIsOpen(false)}>Profile</Link> */}
        {!token ? (
                <>
            
                  <Link to="/loginSurya" onClick={() => setIsOpen(false)}>LoginSurya</Link>
             
                  <Link to="/registerSurya" onClick={() => setIsOpen(false)}>RegisterSurya</Link>
                </>
              ) : (
                <>
                  <Link to="/profile" onClick={() => setIsOpen(false)}>Profile - {username.split(" ")[1]}</Link>
                  <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </>
              )}

      </div>
    </nav>
  );
};

export default Navbar;


