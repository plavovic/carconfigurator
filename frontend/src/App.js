import React from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Checkout from "./pages/Checkout.jsx";






//bug in page taycan, css overlapping other pages




import HomePage from "./pages/HomePage.jsx";
import Configurator from "./pages/Configurator.jsx";
import EPerformance from "./pages/EPerformance.jsx";
import Informations from "./pages/Informations.jsx";
import Login from "./pages/Login.jsx";
import Profile from "./pages/Profile.jsx";
import Admin from "./pages/Admin.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Taycan from "./pages/models/Taycan.jsx";
import Macan from "./pages/models/Macan.jsx";
import NineEleven from "./pages/models/NineEleven.jsx";
import Cayenne from "./pages/models/Cayenne.jsx";




function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element ={<HomePage />} />
        <Route path="/login" element ={<Login />} />
        <Route path="/profile" element ={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/checkout" element ={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/admin" element ={<ProtectedRoute><Admin /></ProtectedRoute>} />
        <Route path="/configurator" element ={<Configurator />} />
        <Route path="/configurator/:modelName/*" element ={<Configurator />} />
        <Route path="/eperformance" element ={<EPerformance />} />
        <Route path="/informations" element ={<Informations />} />
        {/* Plural routes (existing) */}
        <Route path="/models/taycan" element ={<Taycan />} />
        <Route path="/models/macan" element ={<Macan />} />
        <Route path="/models/911" element ={<NineEleven />} />
        <Route path="/models/cayenne" element ={<Cayenne />} />

        {/* Singular routes (requested) */}
        <Route path="/model/taycan" element ={<Taycan />} />
        <Route path="/model/macan" element ={<Macan />} />
        <Route path="/model/911" element ={<NineEleven />} />
        <Route path="/model/cayenne" element ={<Cayenne />} />
        
      </Routes>
    </>
  );
}




/*function App() {
  const [options, setOptions] = useState([]);
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("http://localhost:5000/api/options")
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    })
    .then(setOptions)
    .catch((err) => setError(err.message));
  }, []);


return (
  <div>
    <h1>Options</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      
      <pre>{JSON.stringify(options, null, 2)}</pre>
    </div>
  );

}*/

export default App;