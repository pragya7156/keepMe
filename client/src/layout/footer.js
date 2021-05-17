import React from 'react';
import '../styles/footer.css';
import { Link } from 'react-router-dom';
import { FaLinkedinIn, FaFacebookF, FaInstagram, FaGithub } from 'react-icons/fa';

function Footer() {
    return (
        <div className="footer">
            <div className="last">Copyright &copy; Pragya</div>
            <div className="social">
            <Link to={{pathname: 'https://www.linkedin.com/in/pragya-singh-138b12198/'}} target="_blank">
            <FaLinkedinIn className="linkedin" />
            </Link>
            <Link to={{pathname: 'https://www.facebook.com/profile.php?id=100040881640686'}} target="_blank">
            <FaFacebookF className="facebook" />
            </Link>
            <Link to={{pathname: 'https://www.instagram.com/pragya2160/'}} target="_blank">
            <FaInstagram className="instagram" />
            </Link>
            <Link to={{pathname: 'https://github.com/pragya7156'}} target="_blank">
            <FaGithub className="github" />
            </Link>
            </div>
        </div>
    )
}

export default Footer;
