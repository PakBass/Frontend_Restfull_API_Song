import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
// import ReactPaginate from 'react-paginate';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Pagination, Modal, Button} from 'react-bootstrap';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import InfoCard from "./SideBar";
import Navbar from "./Navbar";
import DataTable from 'react-data-table-component';


function Home() {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [songs, setSongs] = useState([]);
  const [perPage, setPerPage] = useState(5);

  const handlePerPageChange = (value) => {
    setPerPage(value);
  };

  const detailSong = (song) => {
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

  const fetchSongs = async (page = 1) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/songs?page=${page}`);
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

  //DataTable
  const columns = [
    {
      name: 'Cover',
      selector: 'image',
      cell: row => (
        <img
          src={row.image}
          style={{ width: '120px', height: '70px' }}
          alt={row.image}
          className='rounded'
        />
      ),
    },
    {
      name: 'Nama',
      selector: 'nama',
    },
    {
      name: 'Judul Lagu',
      selector: 'judul_lagu',
    },
    {
      name: 'Aksi',
      cell: row => (
        <>
          <Link to={`/detail/${row.id}`} style={{ textDecoration: 'none' }}>
            <i
              className="bi bi-file-earmark-music"
              data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Tooltip on top"
              style={{ cursor: "pointer", color: "black", marginRight: "10px", fontSize: "24px" }}
              onClick={() => detailSong(row)}
            ></i>
          </Link>
          <Link to={`/edit/${row.id}`} style={{ textDecoration: 'none' }}>
            <i
              className="bi bi-pencil-square"
              style={{ cursor: "pointer", color: "blue", marginRight: "10px", fontSize: "24px" }}
            ></i>
          </Link>
          <i
            className="bi bi-trash3"
            onClick={() => handleDeleteClick(row.id)}
            style={{ cursor: "pointer", color: "red", marginRight: "10px", fontSize: "24px" }}
          ></i>
        </>
      ),
    }
  ];

  const data = songs || [];

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
                <strong>Data lagu</strong>
              </div>
                <div className="card-body">
                  <a href="/TambahData" className="btn btn-primary ms-auto"><i className="bi bi-plus-square"></i> Tambah daata lagu</a>
                <div className="mt-4">
                  <DataTable
                    columns={columns}
                    data={data}
                    pagination
                    highlightOnHover
                    paginationPerPage={5}
                    paginationRowsPerPageOptions={[5,10,20]}
                    noDataComponent={<div className="text-center">Tidak ada data lagu..</div>}
                    customStyles={{
                      rows: {
                        style: {
                          padding: '10px', // Sesuaikan dengan jarak yang diinginkan
                        }
                      }
                    }}
                  />
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
