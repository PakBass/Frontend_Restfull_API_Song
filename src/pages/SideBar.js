import React from 'react';

const InfoCard = ({ user, logoutHandler }) => {
  return (
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
          <i className="bi bi-box-arrow-left"></i> Logout
        </button>
      </div>
    </div>
  );
}

export default InfoCard;