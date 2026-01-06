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