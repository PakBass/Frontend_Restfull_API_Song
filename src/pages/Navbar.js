import React, {useState} from "react";
import { Button, NavDropdown } from 'react-bootstrap';

const Navbar = ({ peranPengguna })  => {
    const [showModal, setShowModal] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

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
                <a className= "nav-link" href="/home" style={{ cursor: 'pointer' }}>
                <i className="bi bi-house-door"></i> Home
                </a>
              </li>
              <li className="nav-item">
              {(peranPengguna === 'admin' || peranPengguna === 'operator') && (
                <NavDropdown title="Data" id="basic-nav-dropdown">
                  <NavDropdown.Item href="/addUser" onClick={handleShow}>
                    Tambah data pengguna
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#">Lihat data pengguna</NavDropdown.Item>
                </NavDropdown>
              )}
            </li>
            </ul>
          </div>
        </div>
      </nav>
    );
}

export default Navbar;