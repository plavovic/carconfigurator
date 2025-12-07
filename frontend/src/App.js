import React from "react";
import { Routes, Route } from "react-router-dom";



import Login from "./pages/Login.jsx";

//bug in imports, pages should be imported one by one

function App() {
  return (
    <Routes>
      <Route path ="/" element={<Login />} />
    </Routes>
  );
}

export default App;
