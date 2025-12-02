import React from 'react';
import { useState, useEffect, useRef } from "react";
import { Routes, Route } from "react-router-dom";

//import MainLayout from './layouts/MainLayout'; //layout component will be invoked later

//import pages
import Configurator from './pages/Configurator';
import HomePage from './pages/HomePage';
import Licenses from './pages/Licenses';
import Login from './pages/Login';
import Register from './pages/Register';
import Services from './pages/Services';

//import model pages
import Cayenne from './pages/models/Cayenne';
import Macan from './pages/models/Macan';
import NineEleven from './pages/models/NineEleven';
import Taycan from './pages/models/Taycan';

function App() {
  
  return (
    <Routes>
      <Route path="/" element={<Cayenne />} />
    </Routes>
      );
}

export default App;