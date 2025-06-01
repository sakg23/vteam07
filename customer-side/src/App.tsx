import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
// import About from "./pages/About";
// import Contact from "./pages/Contact";
import Register from "./pages/Register";
// import ChargingStationsMap from "./pages/mapRender";
// import Customers from "./pages/Customers";
// import Cities from "./pages/Cities";
// import { AddCityForm } from "./pages/AddCityForm";
// import AddParking from "./components/AddParking";
// import ChargingStationForm from "./pages/ChargingStationForm";
// import UserTravelsPage from "./pages/UserTravelsPage";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        {/* <Route path="/" element={<ChargingStationsMap />} /> /}
     

         {/ <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cities" element={<Cities />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/addcity" element={<AddCityForm />} />
        <Route path="/addparking" element={<AddParking />} />
        <Route path="/addstation" element={<ChargingStationForm />} />
        <Route path="/user-travels/:userId" element={<UserTravelsPage />} /> */}
      </Routes>
      <Footer />
    </BrowserRouter>

  );
}

export default App;