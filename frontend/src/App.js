import React from "react";
import { Routes, Route } from "react-router-dom";



//import Taycan from "./pages/models/Taycan.jsx";//
import HomePage from "./pages/HomePage.jsx";

//bug in imports, pages should be imported one by one

function App() {
  return (
    <Routes>
      <Route path ="/" element={<HomePage />} />
    </Routes>
  );
}

export default App;
