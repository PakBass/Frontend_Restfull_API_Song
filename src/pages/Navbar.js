import React, {useState} from "react";

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand" href="#">
            Restfull-API React
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation" >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className={`nav-link ${isLoggedIn ? 'active' : ''}`} href="/home" style={{ cursor: 'pointer' }}>
                <i className="bi bi-house-door"></i> Home
                </a>
              </li>
              <li className="nav-item">
                <a className={`nav-link ${isLoggedIn ? 'active' : ''}`} href="/addUser" style={{ cursor: 'pointer' }}>
                <i className="bi bi-person-plus-fill"></i> Add User
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
}

export default Navbar;