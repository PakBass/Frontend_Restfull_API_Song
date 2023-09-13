import { Route, Routes } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import TambahData from "./pages/Tambah";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Welcome/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/home" element={<Home/>} />
        <Route path="/tambahData" element={<TambahData/>} />
      </Routes>
    </div>
  );
}

export default App;