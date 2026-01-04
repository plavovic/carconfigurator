import React from "react";
import "./Informations.css";
import NavBar from "../components/NavBar.jsx";
import Footer from "../components/Footer.jsx";

const Informations = () => {
  return (
    <div className="legal-page">
      <header>
        <NavBar />
      </header>
      <div className="legal-container">
        <h1 className="legal-title">Important Limitations of Assistance Systems</h1>

        <p className="legal-intro">
          <strong>A Few Important Words About Porsche Driver Assistance Systems …</strong>
        </p>

        <p>
          None of Porsche’s Driver Assistance Systems can prevent accidents or loss of control.
          No Driver Assistance System is ever a substitute for attentive driving.
          It is the driver’s responsibility to be observant and in control of the vehicle at all times.
        </p>

        <p>
          Please see your vehicle’s owners’ manual for further details about, and important limitations
          of, each of the specific systems described below.
        </p>

        <section>
          <h2>Active Lane Keep</h2>
          <p>Active Lane Keep may not detect lane markings in certain road, weather, and driving conditions.</p>
          <p>System is available only in conjunction with active Adaptive Cruise Control (ACC).</p>
        </section>

        <section>
          <h2>Adaptive Cruise Control</h2>
          <p>Adaptive Cruise Control should not be used in unfavorable road conditions and poor weather conditions.</p>
          <p>Automatically maintains a set speed and distance between approximately 19 mph – 130 mph.</p>
        </section>

        <section>
          <h2>Auto Emergency Stop</h2>
          <p>
            Auto Emergency Stop depends on signals from the Global Positioning Satellite network.
            Vehicle electronics, data connection, and satellite availability must function properly.
          </p>
        </section>

        <section>
          <h2>Porsche Dynamic Lighting System</h2>
          <p>
            Static cornering lights activate up to 80 mph when steering input is detected.
          </p>
          <p>
            Dynamic cornering lights swivel headlights above approximately 3 mph based on steering angle and speed.
          </p>
        </section>

        <section>
          <h2>Porsche Dynamic Lighting System (Plus)</h2>
          <p>High Beam Assistant operates between 20 mph and 37 mph.</p>
        </section>

        <section>
          <h2>Head-Up Display</h2>
          <ul>
            <li>Sunglasses with certain polarizing filters</li>
            <li>Wet roads</li>
            <li>Unfavorable lighting conditions</li>
          </ul>
        </section>

        <section>
          <h2>Porsche InnoDrive Including Adaptive Cruise Control</h2>
          <p>
            InnoDrive depends on GPS signals and mapping data. Road construction,
            traffic changes, and incomplete mapping may result in discrepancies.
          </p>
          <p>
            Always prioritize road signage over system guidance and remain attentive.
          </p>
        </section>

        <section>
          <h2>Intersection Assist</h2>
          <p>
            Detects other vehicles only. It may not detect pedestrians, cyclists, or animals.
          </p>
        </section>

        <section>
          <h2>Lane Change Assist</h2>
          <p>Operates above approximately 10 mph.</p>
          <p>
            Rear Turn Assist supports Lane Change Assist up to approximately 12 mph
            on the side where the turn signal is activated.
          </p>
        </section>

        <section>
          <h2>Lane Keep Assist with Traffic Sign Recognition</h2>
          <p>
            May not detect lane markers in all conditions and may be inactive below approximately 40 mph.
          </p>
          <p>
            Traffic Sign Recognition depends on clear, unobstructed, well-maintained road signs.
          </p>
        </section>

        <section>
          <h2>Night Vision Assist</h2>
          <p>
            Does not prevent accidents and may not detect all persons, animals, or objects.
          </p>
          <p>
            Operates when sufficiently dark and below ambient temperatures of approximately 82°.
          </p>
        </section>

        <section>
          <h2>ParkAssist (Front and Rear)</h2>
          <p>
            May not detect certain sound-absorbing or reflective obstacles.
          </p>
          <p>
            Activates automatically up to approximately 10 mph.
          </p>
          <p>
            Camera views may be distorted and not show the entire surrounding area.
          </p>
        </section>

        <section>
          <h2>Traffic Jam Assist</h2>
          <p>
            Supports the driver in slow-moving traffic below approximately 40 mph.
          </p>
        </section>

        <section>
          <h2>Warn and Brake Assist</h2>
          <p>
            Cannot prevent most collisions but may reduce severity.
          </p>
          <p>
            Available from walking speed and may react to pedestrians or cyclists up to approximately 53 mph.
          </p>
        </section>

        <section>
          <h2>Wet Mode</h2>
          <p>
            Depends on sensors in the front wheel arches and cannot prevent aquaplaning.
          </p>
        </section>

        <section className="legal-muted">
          <p>
            Not all Driver Assistance Systems are available on every model.
            Some systems are optional or require additional selections.
            Availability may vary.
          </p>
        </section>

        <section>
          <h2>Links</h2>
          <p>
            Porsche may include links to third-party websites. Porsche does not control or endorse
            these sites and assumes no responsibility for their content.
          </p>
        </section>

        <section>
          <h2>Submissions</h2>
          <p>
            Any material submitted becomes the property of Porsche and may be used without restriction
            or compensation.
          </p>
        </section>

        <section>
          <h2>Governing Law</h2>
          <p>
            This website is governed by the laws of the State of Georgia and applicable U.S. federal law.
          </p>
        </section>
      </div>
      <div className="footer">
      <Footer />
    </div>
    </div>

    
  );
};

export default Informations;
