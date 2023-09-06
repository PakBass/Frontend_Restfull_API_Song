import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Home() {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [songs, setSongs] = useState([]);

  const fetchSongs = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/songs');
      // console.log(response.data);
      setSongs(response.data.data.data);
    } catch (error) {
      console.error('Terjadi kesalahan saat mengambil data lagu:', error);
    }
  };
  
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
    if (!token) {
      navigate("/login");
    }

    fetchData();
    fetchSongs();
  }, []);

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
                <a className="nav-link" href="#">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="">
                  Profile
                </a>
              </li>
              <li className="nav-item">
                {/* button logout */}
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-4">
            <div className="card border-0 shadow rounded">
              <div className="card-header">
                <strong>Home</strong>
              </div>
              <div className="card-body">
                <h5>Belajar Backend/Frontend with Laravel + React</h5>
                <h6>User login: {user.name}</h6>
                <h6>User email: {user.email}</h6>
                <p>
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Reprehenderit quod, asperiores, pariatur in sunt ullam laudantium
                  facere natus deserunt voluptatibus, assumenda error atque fuga
                  veritatis?
                </p>
                <button onClick={logoutHandler} className="btn btn-danger">
                  Logout
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-8">
            <div className="card border-0 shadow rounded">
              <div className="card-header">
                <strong>Data lagu</strong>
              </div>
                <div className="card-body">
                <div className="mt-4">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">Cover</th>
                        <th scope="col">Nama</th>
                        <th scope="col">Judul Lagu</th>
                        <th scope="col">Aksi</th>

                      </tr>
                    </thead>
                    <tbody>
                    {Array.isArray(songs) && songs.length > 0 ? (
                      songs.map((song) => (
                        <tr key={song.id}>
                          <td>
                          <img 
                              src={`http://localhost:3000/storage/${song.image}`} 
                              style={{ width: "100px", height: "50px" }}
                              className='rounded' />
                          </td>
                          <td style={{ verticalAlign: "middle" }}>{song.nama}</td>
                          <td style={{ verticalAlign: "middle" }}>{song.judul_lagu}</td>
                          <td></td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center">Tidak ada lagu yang ditemukan.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
