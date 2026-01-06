
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './NavBar.css';

const NavBar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const closeSidebar = () => setIsSidebarOpen(false);
    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
    const navigate = useNavigate();
    const { isAuthenticated, logout, user } = useAuth();
    const isAdmin = user?.role === 'admin' || user?.email === 'admin@admin.com';
   
   
   
      return (
    <>

      <header className="navbar">
        <div className="navbar-left">

          <button
            className="icon-button"
            onClick={toggleSidebar}
            aria-label="Toggle menu"
            aria-expanded={isSidebarOpen}
            aria-controls="sidebar"
          >

            {isSidebarOpen ? (
 
              <svg
                className="icon icon-close"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M18.3 5.71L12 12.01l-6.3-6.3-1.41 1.41L10.59 13.4l-6.3 6.3 1.41 1.41 6.3-6.3 6.29 6.3 1.42-1.41-6.3-6.3 6.3-6.29z" />
              </svg>
            ) : (
  
              <svg
                className="icon icon-burger"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
              </svg>
            )}
          </button>

          <a href="/" className="navbar-logo">
            Car Configurator
          </a>
        </div>

        <div className="navbar-right">

          <button
            className="icon-button"
            onClick={() => {
              // If user is authenticated go to profile, otherwise to login
              if (isAuthenticated) navigate('/profile');
              else navigate('/login', { state: { from: '/profile' } });
            }}
            aria-label="User menu"
          >
            <svg
              className="icon icon-user"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 2a5 5 0 0 0-5 5 5 5 0 0 0 5 5 5 5 0 0 0 5-5 5 5 0 0 0-5-5zm0 12c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z" />
            </svg>
          </button>
          {isAuthenticated && (
            <button
              className="icon-button"
              onClick={() => {
                logout();
                navigate('/');
              }}
              aria-label="Logout"
            >

              <svg
                className="icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M10 17l1.41-1.41L8.83 13H20v-2H8.83l2.58-2.59L10 7l-5 5 5 5z" />
                <path d="M4 5h6V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h6v-2H4V5z" />
              </svg>
            </button>
          )}
        </div>
      </header>


      {isSidebarOpen && (
        <div
          className="backdrop"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}


      <aside
        id="sidebar"
        className={`sidebar ${isSidebarOpen ? "sidebar-open" : ""}`}
        aria-hidden={!isSidebarOpen}
      >
        <div className="sidebar-header">
          <span className="sidebar-title">CAR CONFIGURATOR MENU</span>

          <button
            className="icon-button"
            onClick={closeSidebar}
            aria-label="Close menu"
          >
  
            <svg
              className="icon icon-close"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M18.3 5.71L12 12.01l-6.3-6.3-1.41 1.41L10.59 13.4l-6.3 6.3 1.41 1.41 6.3-6.3 6.29 6.3 1.42-1.41-6.3-6.3 6.3-6.29z" />
            </svg>
          </button>
        </div>

        <nav className="sidebar-nav">
          <button className="sidebar-item" onClick={() => navigate("/")}>Home</button>
          <button className="sidebar-item" onClick={() => navigate("/login")}>Login</button>
          <button className="sidebar-item" onClick={() => navigate("/configurator")}>Configurator</button>
          <button className="sidebar-item" onClick={() => navigate("/eperformance")}>E-Performance</button>
          <button className="sidebar-item" onClick={() => navigate("/informations")}>Informations</button>
          <button className="sidebar-item" onClick={() => navigate("/model/taycan")}>Taycan</button>
          {isAdmin && <button className="sidebar-item" onClick={() => navigate("/admin")}>Admin</button>}
          <button className="sidebar-item" onClick={() => navigate("/model/cayenne")}>Cayenne</button>
          <button className="sidebar-item" onClick={() => navigate("/model/911")}>911</button>
          <button className="sidebar-item" onClick={() => navigate("/model/macan")}>Macan</button>
        </nav>
      </aside>
    </>
  );
};


export default NavBar; 