import React from "react";
import { Routes, Route } from "react-router-dom";






//bug in page taycan, css overlapping other pages


import Configurator from "./pages/Configurator.jsx";





function App() {
  return (
    <Routes>
      <Route path="/configurator" element={<Configurator />} />
    </Routes>
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