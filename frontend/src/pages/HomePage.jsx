import React from 'react';
import "./HomePage.css";
import TestCarCard from '../components/TestCarCard';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import MapView from '../components/MapView';

import TaycanImage from "../images/porschetaycan.png";
import CayenneImage from "../images/porschecayenne.png";
import MacanImage from "../images/porschemacan.png";
import NineElevenImage from "../images/porsche911.png";


function HomePage () {
    return (
    <div className="container">
        <div className="navbar-container">    
            <NavBar />
        </div>
        <div className="body-container">
            <div className="header-section">
                <h1>Configure Your Vehicle.</h1>
            </div>
            
            
        <div className="cars-grid">
        <TestCarCard 
        image={TaycanImage}
        model="Taycan"
        tags={["Electric", "Sedan"]}
        stats={[
          { value: "3.7s", label: "Acceleration 0–100 km/h" },
          { value: "616hp", label: "Overboost Power" },
          { value: "250km/h", label: "Top Speed" }
        ]}
        consumption="Electric energy consumption: 20.1 – 17.6 kWh/100 km, CO₂: 0 g/km"
        />
      
        <TestCarCard 
        image={CayenneImage}
        model="Cayenne"
        tags={["SUV", "Hybrid"]} 
        stats={[
          { value: "4.9s", label: "Acceleration 0–100 km/h" },
          { value: "470hp", label: "Max Power" },
          { value: "253km/h", label: "Top Speed" }
        ]}
        consumption="Fuel consumption combined (model range): 11.7 – 10.6 l/100 km, CO₂-emissions (model range): 266 – 242 g/km"
        />

        <TestCarCard 
        image={NineElevenImage}
        model="911 Carrera"
        tags={["Coupe", "Iconic"]}
        stats={[
          { value: "4.2s", label: "Acceleration 0–100 km/h" },
          { value: "385hp", label: "Power" },
          { value: "293km/h", label: "Top Speed" }
        ]}
        consumption="Fuel consumption combined (model range): 10.5 – 9.9 l/100 km, CO₂-emissions (model range): 240 – 226 g/km"
        />

        <TestCarCard 
        image={MacanImage}
        model="Macan"
        tags={["Compact SUV"]}
        stats={[
          { value: "4.6s", label: "Acceleration 0–100 km/h" },
          { value: "440hp", label: "Power" },
          { value: "270km/h", label: "Top Speed" }
        ]}
        consumption="Electric energy consumption combined (model range): 19.3 – 16.7 kWh/100 km, CO₂: 0 g/km (preliminary value)"
        />
            </div>
        </div>     
      <div className="footer-container">
        <Footer />
      </div>
    </div>
    )
}

export default HomePage;