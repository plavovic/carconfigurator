import React from "react";
import { useState } from "react";

import user_icon from "../assets/user.svg";
import email_icon from "../assets/email.svg";
import password_icon from "../assets/password.svg";

import background from "../images/loginbackground.jpg";
import "./Login.css";


const Login = () => {
  const [action, setAction] = useState("Sign Up");

  return (
    <div className="background">
      <div className="container">
        

        <div className="header">
          <div className="text">{action}</div>
          <div className="underline"></div>
        </div>


        <div className={`form-wrapper ${action}`}>
          

          {action === "Sign Up" && (
            <div className="input">
              <img src={user_icon} alt="" />
              <input type="text" placeholder="Username" />
            </div>
          )}


          <div className="input">
            <img src={email_icon} alt="" />
            <input type="email" placeholder="Email" />
          </div>


          <div className="input">
            <img src={password_icon} alt="" />
            <input type="password" placeholder="Password" />
          </div>
        </div>


        {action === "Login" && (
          <div className="forgot-password">
            Forgot Password? <span>Click Here</span>
          </div>
        )}


        <div className="submit-container">
          <div className={action === "Login" ? "submit gray" : "submit"}
            onClick={() => setAction("Sign Up")}>Sign Up</div>

          <div className={action === "Sign Up" ? "submit gray" : "submit"}
            onClick={() => setAction("Login")}>Login</div>
        </div>

      </div>
    </div>
  );
};

export default Login;
