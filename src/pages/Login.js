import axios from "axios";
import { useEffect, useState } from "react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    //validasi data
    const [validation, setValidation] = useState([]);

    const navigate = useNavigate()
    const [showAlert, setShowAlert] = useState(false);

    //midleware halaman home
    useEffect(() => {
        if(localStorage.getItem('token')){
            setTimeout(() => {
                navigate('/home');
              }, 3000);
        }

    }, [navigate]);

    const loginHandler = async(e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append('email',email);
        formData.append('password',password);

        await axios.post('http://localhost:8000/api/auth/login', formData)
        .then((response) => {

            console.log(response.data.access_token);
            localStorage.setItem('token',response.data.access_token);
            navigate('/home');

        }).catch((error) => {
            console.log(error.response.data);
            setValidation(error.response.data);
        })
    }
    return(
        <div className="container">
            <div className="d-flex align-items-center" style={{ height:'100vh' }}>
                <div style={{ width:'100%' }}>
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <div className="card border-0 shadow rounded">
                                <div className="card-header"><strong>Login</strong></div>
                                <div className="card-body">
                                    {
                                        validation.message && (
                                            <div className="alert alert-danger" role="alert">
                                                {validation.message}
                                            </div>
                                        )
                                    }
                                    <form onSubmit={loginHandler}>
                                        <div className="mb-3">
                                            <input type="email" 
                                                   className="form-control" 
                                                   id="email" 
                                                   value={email} 
                                                   onChange={(e) => setEmail(e.target.value)} 
                                                   placeholder="Alamat email" 
                                                   autoFocus />
                                                    {
                                                        validation.email && (
                                                            <small className="text-danger">
                                                                { validation.email[0] }
                                                            </small>
                                                        )
                                                    }
                                        </div>
                                        <div className="mb-3">
                                            <input type="password" 
                                                   className="form-control" 
                                                   id="password"  
                                                   value={password} 
                                                   onChange={(e) => setPassword(e.target.value)}
                                                   placeholder="Kata Sandi" />
                                                    {
                                                        validation.password && (
                                                            <small className="text-danger">
                                                                { validation.password[0] }
                                                            </small>
                                                        )
                                                    }
                                        </div>
                                        <button className="btn btn-primary me-2" type="submit">Entry</button>
                                        <Link to="/register" className="btn btn-outline-dark me-2">Register</Link>
                                        <Link to="/" className="btn btn-outline-dark me-auto">Dashboard</Link>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Login;