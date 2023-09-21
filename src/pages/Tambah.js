import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import InfoCard from "./SideBar";
import Navbar from "./Navbar";

function TambahData() {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [songs, setSongs] = useState([]);
  const [formTambahLagu, setFormTambahLagu] = useState({
    nama: "",
    judul_lagu: "",
    image: null
  });
  
  const [tampilkanFormTambahLagu, setTampilkanFormTambahLagu] = useState(false);
  const handleChangeTambahLagu = (e) => {
    const { name, value, files } = e.target;
    setFormTambahLagu({
      ...formTambahLagu,
      [name]: name === 'image' ? files[0] : value
    });
  };

  const [validation, setValidation] = useState([]);

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
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  
    fetchData(token);
    fetchSongs();
  }, []);
  
  const handleSubmitTambahLagu = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("image", formTambahLagu.image);
    formData.append("nama", formTambahLagu.nama);
    formData.append("judul_lagu", formTambahLagu.judul_lagu);
  
    try {
      await axios.post('http://localhost:8000/api/songs', formData);
      Swal.fire({
        icon: 'success',
        title: 'Data lagu berhasil ditambahkan',
      });
      setFormTambahLagu({
        nama: "",
        judul_lagu: "",
        image: null
      });
      setTampilkanFormTambahLagu(false);
      fetchSongs();
      fetchData();
      navigate('/home');
    } catch (error) {
      setValidation(error.response.data);
      console.error('Terjadi kesalahan saat menambahkan data lagu:', error);
    }
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

  const handleReset = async () => {
    document.getElementById("formTambah").reset();
  }

  return (
    <div>
      {/* Navbar */}
      <Navbar />
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
                <strong>TambahData lagu</strong>
              </div>
              <div className="card-body">
                {/* Tambah data lagu form */}
                    <form onSubmit={handleSubmitTambahLagu} id="formTambah" className="mt-4">
                        <div className="mb-3">
                            <label htmlFor="nama">Nama</label>
                            <input
                            type="text"
                            className="form-control"
                            id="nama"
                            name="nama"
                            autoComplete="off"
                            autoFocus
                            value={formTambahLagu.nama}
                            onChange={handleChangeTambahLagu}
                            />
                            {
                                validation.nama && (
                                    <small className="text-danger">
                                        { validation.nama[0] }
                                    </small>
                                )
                            }
                        </div>
                        <div className="mb-3">
                            <label htmlFor="judulLagu">Judul Lagu</label>
                            <input
                            type="text"
                            className="form-control"
                            id="judulLagu"
                            name="judul_lagu"
                            autoComplete="off"
                            value={formTambahLagu.judul_lagu}
                            onChange={handleChangeTambahLagu}
                            />
                            {
                                validation.judul_lagu && (
                                    <small className="text-danger">
                                        { validation.judul_lagu[0] }
                                    </small>
                                )
                            }
                        </div>
                        <div className="mb-3">
                            <label htmlFor="image">Gambar</label>
                            <input
                            type="file"
                            className="form-control"
                            id="image"
                            name="image"
                            accept="image/*"
                            onChange={handleChangeTambahLagu}
                            />
                            {
                              formTambahLagu.image && typeof formTambahLagu.image !== 'string' && (
                                <img
                                    src={URL.createObjectURL(formTambahLagu.image)}
                                    alt="Selected Image"
                                    style={{ maxWidth: '180px', marginTop: '10px' }}
                                />
                              )
                            }
                            {
                                validation.image && (
                                    <small className="text-danger">
                                        { validation.image[0] }
                                    </small>
                                )
                            }
                        </div>
                        <button type="submit" className="btn btn-primary"><i className="bi bi-floppy"></i> Simpan</button>
                        <Link to="/home" className="btn btn-danger ms-2 text-center">Back</Link>
                    </form>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TambahData;
