import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [PasswordConfirmation, setPasswordConfirmation] = useState("");
  const [validation, setValidation] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/home");
    }
  }, []);

  const registerHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("password_confirmation", PasswordConfirmation);

    await axios
      .post("http://localhost:8000/api/auth/register", formData)
      .then(() => {
        // Tampilkan SweetAlert setelah registrasi berhasil
        Swal.fire({
            title: "Registrasi Berhasil",
            text: "Anda telah berhasil mendaftar!",
            icon: "success",
          }).then(() => {
          navigate("/login");
        });
      })
      .catch((error) => {
        setValidation(error.response.data);
      });
  };

  return (
    <div className="container">
      <div className="d-flex align-items-center" style={{ height: "100vh" }}>
        <div style={{ width: "100%" }}>
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card border-0 shadow rounded">
                <div className="card-header">
                  <strong>Register</strong>
                </div>
                <div className="card-body">
                  <form onSubmit={registerHandler}>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">
                        Nama
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoComplete="off"
                        placeholder="Nama Anda"
                        autoFocus
                      />
                      {validation.name && (
                        <small className="text-danger">
                          {validation.name[0]}
                        </small>
                      )}
                    </div>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">
                        Alamat email
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@example.com"
                      />
                      {validation.email && (
                        <small className="text-danger">
                          {validation.email[0]}
                        </small>
                      )}
                    </div>
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">
                        Kata Sandi
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="********"
                      />
                      {validation.password && (
                        <small className="text-danger">
                          {validation.password[0]}
                        </small>
                      )}
                    </div>
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">
                        Ulangi Kata Sandi
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="password_confirmation"
                        value={PasswordConfirmation}
                        onChange={(e) =>
                          setPasswordConfirmation(e.target.value)
                        }
                        placeholder="********"
                      />
                    </div>
                    <button
                      className="btn btn-primary me-2"
                      type="submit"
                    >
                      Registrasi
                    </button>
                    <Link to="/login" className="btn btn-outline-dark">
                      Login
                    </Link>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;