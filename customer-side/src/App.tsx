import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import AddBalance from "./pages/AddBalance";
import Register from "./pages/Register";
import RequireAuth from "./components/RequireAuth";
import MapView from "./pages/MapView";



function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/History" element={<RequireAuth><History /></RequireAuth>} />
        <Route path="/add-balance" element={<RequireAuth><AddBalance /></RequireAuth>} />
        <Route path="/map" element={<RequireAuth><MapView /></RequireAuth>} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;