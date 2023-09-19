import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
// import ReactPaginate from 'react-paginate';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Pagination, Modal, Button } from 'react-bootstrap';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import InfoCard from "./SideBar";

function Home() {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [songs, setSongs] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // Menentukan halaman saat ini
  const itemsPerPage = 5; // Jumlah item per halaman

  const handleClick = (song) => {
    Swal.fire({
      title: `Nama Band: ${song.nama}`,
      html: `
        <p>Judul Lagu: <b>${song.judul_lagu}</p></p>
        <img 
            src="${song.image}"
            style="width: 250px; height: 170px;"
            alt="Cover Lagu"
            class="rounded" />
      `,
      icon: 'info',
      showCancelButton: false,
      focusConfirm: false,
      confirmButtonText: 'OK',
    }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = '/home'; // Mengarahkan kembali ke halaman home setelah klik OK
    }
  });
};

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
      customClass: {
        confirmButton: 'btn btn-danger' // Tambahkan kelas 'btn-danger' untuk membuat tombol menjadi merah
      }
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

  const handleDeleteClick = async (id) => {
    // Tampilkan SweetAlert konfirmasi
    Swal.fire({
      title: "Apakah Anda yakin ingin menghapus data?",
      text: "Anda tidak akan dapat mengembalikan data ini!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
      reverseButtons: true,
      customClass: {
        confirmButton: 'btn btn-danger' // Tambahkan kelas 'btn-danger' untuk membuat tombol menjadi merah
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`http://127.0.0.1:8000/api/songs/${id}`);
          console.log('Data berhasil dihapus', response.data);
          Swal.fire(
            "Berhasil!",
            "Data telah dihapus.",
            "success"
          ).then(() => {
            window.location.reload(); // Auto-refresh halaman setelah SweetAlert tertutup
          });
        } catch (error) {
          console.error('Terjadi kesalahan saat menghapus data lagu:', error);
          Swal.fire(
            "Gagal!",
            "Terjadi kesalahan saat menghapus data.",
            "error"
          );
        }
      }
    });
  };

  const handlePageClick = (selected) => {
    setCurrentPage(selected);
  };
  const pageCount = Math.ceil(songs.length / itemsPerPage); 
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
          <div>
            <InfoCard user={user} logoutHandler={logoutHandler} />
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
                          <Link to={`/detail/${song.id}`} style={{ textDecoration: 'none' }}>
                            <i 
                              className="bi bi-file-earmark-music"
                              data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Tooltip on top"
                              style={{ cursor: "pointer", color: "black", marginRight: "10px" }}
                              onClick={() => handleClick(song)}
                            ></i>
                          </Link>
                          <Link to={`/edit/${song.id}`} style={{ textDecoration: 'none' }}>
                          <i 
                            className="bi bi-pencil-square" 
                            style={{ cursor: "pointer",color:"blue", marginRight: "10px" }}
                          ></i>
                          </Link>
                          <i 
                          className="bi bi-trash3"
                          onClick={() => handleDeleteClick(song.id)} 
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
                        onClick={() => handlePageClick(index)} // Menggunakan index sebagai parameter
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
