import react from 'react';
import './Footer.css'; 

import {ReactComponent as Facebook} from '../assets/facebookicon.svg';
import {ReactComponent as Instagram} from '../assets/instagramicon.svg';
import {ReactComponent as Youtube} from '../assets/youtubeicon.svg';
import {ReactComponent as Linkedin} from '../assets/linkedinicon.svg';
import call from '../assets/callicon.svg';
import mail from '../assets/contactmailicon.svg';



function Footer() {
    
    return (
    <div className="fcontainer">
        <div className="text-container">
        <h1>Get In Touch With Us</h1>
        </div>
        
    <div className="social-media">
        <h1>Social Media</h1>
        <h2>Contact us via social media.</h2>
        <div className="social-media-icons">
        <Instagram className="icon"></Instagram>
        <Facebook className="icon"></Facebook>
        <Youtube className="icon"></Youtube>
        <Linkedin className="icon"></Linkedin>
        </div>
    </div>
    </div>
    );

}

export default Footer;