import React from "react";
import { Link } from "react-router-dom";

function Welcome() {
    return(
        <div className="container">
            <div className="d-flex align-items-center" style={{ height:'100vh' }}>
                <div style={{ width: '100%' }}>
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <div className="card border-0 shadow rounded">
                                <div className="card-header"><h3>Welcome</h3></div>
                                <div class="card-body text-center">
                                    <h5>RestFull-API Data Lagu-Lagu</h5>
                                    <p className="card-text">Selamat datang di aplikasi list data lagu, silahkan login jika sudah memiliki akun, pada pilih reegister jika belum mempunyai akun.</p>
                                    <Link to="/login" className="btn btn-success me-2 text-center">Login</Link>
                                    <Link to="/register" className="btn btn-success text-center">Register</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Welcome;