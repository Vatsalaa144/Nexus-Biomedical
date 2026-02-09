import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaYoutube,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container">
          <div className="footer-grid">
            {/* Organization Info */}
            <div className="footer-column">
              <div className="footer-logo">
                <h3>NEXUS BIOMEDICAL RESEARCH FOUNDATION TRUST</h3>
                <p className="tagline">Advancing Medical Science globally</p>
              </div>
              <p className="footer-description">
                An International Forum for Biomedical Professionals &
                Researchers
              </p>
              <div className="social-links">
                <a
                  href="https://facebook.com/IndianSocietyofToxicology"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <FaFacebookF />
                </a>
                <a
                  href="https://twitter.com/IST_India"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                >
                  <FaTwitter />
                </a>
                <a
                  href="https://linkedin.com/company/indian-society-of-toxicology"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <FaLinkedinIn />
                </a>
                <a
                  href="https://youtube.com/@indiansocietyoftoxicology"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                >
                  <FaYoutube />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-column">
              <h4 className="footer-heading">Quick Links</h4>
              <ul className="footer-links">
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/about">About Us</Link>
                </li>
                <li>
                  <Link to="/committee">Executive Committee</Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div className="footer-column">
              <h4 className="footer-heading">Resources</h4>
              <ul className="footer-links">
                <li>
                  <Link to="/blog">Our Blogs</Link>
                </li>
                <li>
                  <Link to="/contact">Feedback</Link>
                </li>
                <li>
                  <a
                    href="https://jist-journal.org"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    JAIRAM Journal
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Information */}
            <div className="footer-column">
              <h4 className="footer-heading">Contact Us</h4>
              <div className="contact-info">
                <div className="contact-item">
                  <FaMapMarkerAlt className="contact-icon" />
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Department+of+Forensic+Medicine+and+Toxicology+King+George's+Medical+University+Lucknow"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="address-link"
                  >
                    <div>
                      <p>
                        Office Add- 151, Sector- J Pocket-2, Sushant Golf City.
                      </p>
                      <p>Lucknow, PO:Sushant Golf City,</p>
                      <p>DIST:Lucknow, Uttar Pradesh, 226030</p>
                    </div>
                  </a>
                </div>
                <div className="contact-item">
                  <FaEnvelope className="contact-icon" />
                  <div>
                    <a href="mailto:secretary@insoctox.org">
                      secretary@insoctox.org
                    </a>
                    <br />
                    <a href="mailto:info@insoctox.org">info@insoctox.org</a>
                  </div>
                </div>
                <div className="contact-item">
                  <FaPhone className="contact-icon" />
                  <div>
                    <a href="tel:+914027143000">+91 8881778519</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <p className="copyright">
              &copy; {new Date().getFullYear()} Nexus Biomedical Research
              Foundation Trust. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default React.memo(Footer);
