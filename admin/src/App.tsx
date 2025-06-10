import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Register from "./pages/Register";
// import ChargingStationsMap from "./pages/mapRender";
import Customers from "./pages/Customers";
import Cities from "./pages/Cities";
import AddCityForm from "./pages/AddCityForm";
import AddParking from "./components/AddParking";
import ParkingZones from "./pages/ParkingZones";
import ChargingStations from "./pages/ChargingStations";
import AddChargingStation from "./components/AddChargingStation";
import UserTravelsPage from "./pages/UserTravelsPage";
import 'bootstrap/dist/css/bootstrap.min.css';
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* <Route path="/" element={<ChargingStationsMap />} /> */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/addcity" element={<AddCityForm />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cities" element={<Cities />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/parkingzones" element={<ParkingZones />} />
        <Route path="/addparking" element={<AddParking />} />
        <Route path="/chargingstations" element={<ChargingStations />} />
        <Route path="/addstation" element={<AddChargingStation />} />
        <Route path="/user-travels/:userId" element={<UserTravelsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
