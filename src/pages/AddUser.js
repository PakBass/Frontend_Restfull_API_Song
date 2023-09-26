import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import InfoCard from "./SideBar";
import Navbar from "./Navbar";

function TambahUser() {
    const [user, setUser] = useState({});
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [PasswordConfirmation, setPasswordConfirmation] = useState("");
    const [validation, setValidation] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
  
    const fetchData = async () => {
      try {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const response = await axios.post(
          "http://localhost:8000/api/auth/user-profile"
        );
        setUser(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          console.error("Terjadi kesalahan:", error);
        }
      }
    };

    useEffect(() => {
      if (localStorage.getItem("token")) {
        navigate("/addUser");
      }
      fetchData(token);
    }, []);
  
    const handleSubmitTambahUser = async (e) => {
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
            navigate("/home");
          });
        })
        .catch((error) => {
          setValidation(error.response.data);
        });
    };

  const logoutHandler = async () => {
    // Tampilkan SweetAlert konfirmasi
    Swal.fire({
      title: "Apakah Anda yakin ingin keluar?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        axios
          .post("http://localhost:8000/api/auth/logout")
          .then(() => {
            localStorage.removeItem("token");
            navigate("/login");
          })
          .catch((error) => {
            console.error("Terjadi kesalahan:", error);
          });
      }
    });
  };

  return (
    <div>
      {/* Navbar */}
      <Navbar peranPengguna="admin" />
      {/* Content */}
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-4">
          <div>
            <InfoCard user={user} logoutHandler={logoutHandler} />
          </div>
          </div>
          <div className="col-md-8">
            <div className="card border-0 shadow rounded">
              <div className="card-header">
                <strong>Tambah User</strong>
              </div>
                <div className="card-body">
                  <form onSubmit={handleSubmitTambahUser}>
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
                    ><i className="bi bi-floppy"></i> Simpan
                    </button>
                    <Link to="/home" className="btn btn-danger ms-2 text-center"><i className="bi bi-arrow-left-square"></i> Back</Link>
                  </form>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TambahUser;
