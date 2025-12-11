import react from 'react';
import './Footer.css'; 
import LicenseText from './LicenseText';

import {ReactComponent as Facebook} from '../assets/facebookicon.svg';
import {ReactComponent as Instagram} from '../assets/instagramicon.svg';
import {ReactComponent as Youtube} from '../assets/youtubeicon.svg';
import {ReactComponent as Linkedin} from '../assets/linkedinicon.svg';
import {ReactComponent as Call} from '../assets/callicon.svg';
import {ReactComponent as Mail} from '../assets/contactmailicon.svg';



function Footer() {
    
    return (
    <div className="fcontainer">
        <div className="text-container">
        <h1>Get In Touch With Us</h1>
        </div>
    

        
    <div className="social-media">
        <div className="social-media-top">
        <div className="social-h">
        <h1>Social Media</h1>
        <h2>Contact us via social media.</h2>
        </div>
        <div className="contacts">
        <div className="call">
            <Call className="icon"></Call>
            <a>+387 60 000 000</a>
        </div>
        <div className="mail">
            <Mail className="icon"></Mail>
            <a>info@carconfigurator.com</a>
        </div>
        </div>



        </div>
        <div className="social-media-icons">
            <Instagram className="icon"></Instagram>
            <Facebook className="icon"></Facebook>
            <Youtube className="icon"></Youtube>
            <Linkedin className="icon"></Linkedin>
        </div>
        </div>

        <div className="further-links">
            <a>Electric Vehicles</a>
            <a>Licenses</a>
            <a>Services</a>
        </div>
        <div className="underline"></div>
        <div className="license">
            <LicenseText />
        </div>
    </div>
    );

}

export default Footer;