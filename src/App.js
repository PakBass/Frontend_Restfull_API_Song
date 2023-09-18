import { Route, Routes } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import TambahData from "./pages/Tambah";
import EditData from "./pages/Edit";
import Register from "./pages/register";
import Home from "./pages/home";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Welcome/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/home" element={<Home/>} />
        <Route path="/tambahData" element={<TambahData/>} />
        <Route path="/edit/:id" element={<EditData/>} />
      </Routes>
    </div>
  );
}

export default App;