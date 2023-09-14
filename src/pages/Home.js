import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ReactPaginate from 'react-paginate';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Pagination } from 'react-bootstrap';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function Home() {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [songs, setSongs] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // Menentukan halaman saat ini
  const itemsPerPage = 5; // Jumlah item per halaman
  const pageCount = Math.ceil(songs.length / itemsPerPage); 

  const fetchSongs = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/songs');
      console.log(response.data.data.data);
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

  function handleEditClick(id) {
    const dataToSend = {
      image: 'url_gambar',
      nama: 'Nama Pengguna',
      judul_lagu: 'Judul Lagu'
    };
    // Mengirim permintaan ke API untuk mengedit data dengan ID tertentu
    fetch(`http://localhost:8000/api/songs/${id}`, {
      method: 'PUT',
      body: JSON.stringify({

      }),
      // ... tambahkan konfigurasi permintaan seperti headers, body, dll.
    })
    .then(response => response.json())
    .then(data => {
      navigate("/home");
    })
    .catch(error => console.error('Error:', error));
  }

  function handleDeleteClick(id) {
    // Mengirim permintaan ke API untuk menghapus data dengan ID tertentu
    fetch(`http://localhost:8000/api/songs/${id}`, {
      method: 'DELETE',
      // ... tambahkan konfigurasi permintaan seperti headers, body, dll.
    })
    .then(response => response.json())
    .then(data => {
      // Lakukan apa pun setelah berhasil menghapus data
    })
    .catch(error => console.error('Error:', error));
  }

  const handlePageClick = (selected) => {
    setCurrentPage(selected);
  };
  const indexOfLastSong = (currentPage + 1) * itemsPerPage;
  const indexOfFirstSong = indexOfLastSong - itemsPerPage;
  const currentSongs = songs.slice(indexOfFirstSong, indexOfLastSong);

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
                  Aplikasi ini dikembangkan dengan 2 bagian yang berbeda,
                  Backend yang yang dibuat Restfull-API dan frontend menggunakana React.js.
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
                  <a href="/TambahData" className="btn btn-primary ms-auto">+ Tambah daata lagu</a>
                <div className="mt-4">
                <Table striped bordered hover>
                    <thead>
                      <tr style={{ textAlign: "center" }}>
                        <th scope="col">Cover</th>
                        <th scope="col">Nama</th>
                        <th scope="col">Judul Lagu</th>
                        <th scope="col" colSpan={3}>Aksi</th>

                      </tr>
                    </thead>
                    <tbody>
                    {Array.isArray(currentSongs) && currentSongs.length > 0 ? (
                      currentSongs.map((song) => (
                        <tr key={song.id}>
                          <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                          <img 
                              src={`${song.image}`}
                              style={{ width: "120px", height: "70px" }}
                              // alt={song.image}
                              className='rounded' />
                          </td>
                          <td style={{ verticalAlign: "middle" }}>{song.nama}</td>
                          <td style={{ verticalAlign: "middle" }}>{song.judul_lagu}</td>
                          <td style={{ verticalAlign: "middle", textAlign:"center" }}>
                          <i 
                            className="bi bi-file-earmark-music"
                            // onClick={handleViewClick}
                            style={{ cursor: "pointer", color: "black", marginRight: "10px"  }}
                            ></i>
                          <i 
                            className="bi bi-pencil-square" 
                            onClick={handleEditClick} 
                            style={{ cursor: "pointer",color:"blue", marginRight: "10px" }}
                          ></i>
                          <i 
                          className="bi bi-trash3"
                          onClick={handleDeleteClick} 
                          style={{ cursor: "pointer",color:"red", marginRight: "10px" }}
                          ></i>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">Tidak ada data lagu..</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
                <Pagination className="mt-4 justify-content-center">
                  <Pagination.Prev 
                    onClick={() => handlePageClick(currentPage - 1)} 
                    disabled={currentPage === 0}
                  />
                  {Array.from({length: pageCount}, (_, index) => (
                    <Pagination.Item 
                      key={index} 
                      active={index === currentPage}
                      onClick={() => handlePageClick(index)}
                    >
                      {index + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next 
                    onClick={() => handlePageClick(currentPage + 1)} 
                    disabled={currentPage === pageCount - 1}
                  />
                </Pagination>
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
