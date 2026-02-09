import React, { useState, useEffect, useRef } from "react";
import "./Contact.css";
import {
  FaUser,
  FaBuilding,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const contactCardsRef = useRef([]);
  const formCardRef = useRef(null);
  const mapRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Thank you for your message. We'll get back to you soon.");
  };

  // Scroll animation observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    [
      contactCardsRef.current[0],
      contactCardsRef.current[1],
      formCardRef.current,
      mapRef.current,
    ].forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="contact-page-container">
      <div className="contact-page-title">
        <div className="container">
          <h1>Contact Us</h1>
          <p>
            Get in touch with the Nexus Biomedical Research Foundation Trust
          </p>
        </div>
      </div>

      <div className="container">
        {/* Main Contact Content - Three Column Layout (2 Cards + Form) */}
        <div className="contact-main-container">
          {/* First Card: Executive Headquarters */}
          <div className="contact-cards-container">
            <div className="contact-main-content">
              <h2>Contact Info</h2>
              <div
                className="contact-card contact-executive-card"
                ref={(el) => (contactCardsRef.current[0] = el)}
              >
                <div className="contact-card-header">
                  <h2>Secretary</h2>
                </div>

                <div className="contact-card-content">
                  <div className="contact-person">
                    <FaUser className="contact-person-icon" />
                    <div className="contact-person-details">
                      <h3>Dr. Pradeep Kumar Yadav</h3>
                      <p className="contact-person-title">
                        Assistant Professor
                      </p>
                    </div>
                  </div>

                  <div className="contact-info">
                    <div className="contact-info-item">
                      <FaMapMarkerAlt className="contact-info-icon" />
                      <div className="contact-info-content">
                        <p>
                          Office Add- 151, Sector- J Pocket-2, Sushant Golf
                          City, Lucknow.
                        </p>
                        <p>
                          PO: Sushant Golf City, DIST: Lucknow, Uttar Pradesh,
                          226030
                        </p>
                      </div>
                    </div>

                    <div className="contact-info-item">
                      <FaPhone className="contact-info-icon" />
                      <a href="tel:+918881778519" className="contact-link">
                        +91 8881778519
                      </a>
                    </div>

                    <div className="contact-info-item">
                      <FaEnvelope className="contact-info-icon" />
                      <a
                        href="mailto:drnishatsheikh@gmail.com"
                        className="contact-link"
                      >
                        drnishatsheikh@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Second Card: Editorial Headquarters */}
              <div
                className="contact-card contact-editorial-card"
                ref={(el) => (contactCardsRef.current[1] = el)}
              >
                <div className="contact-card-header">
                  <h2>Treasurer</h2>
                </div>

                <div className="contact-card-content">
                  <div className="contact-person">
                    <FaUser className="contact-person-icon" />
                    <div className="contact-person-details">
                      <h3>Mr. Sachin Kumar Tripathi</h3>
                      <p className="contact-person-title">
                        Scientific Officer Toxicology
                      </p>
                    </div>
                  </div>

                  <div className="contact-info">
                    <div className="contact-info-item">
                      <FaMapMarkerAlt className="contact-info-icon" />
                      <div className="contact-info-content">
                        <p>
                          Office Add- 151, Sector- J Pocket-2, Sushant Golf
                          City, Lucknow.
                        </p>
                        <p>
                          PO: Sushant Golf City, DIST: Lucknow, Uttar Pradesh,
                          226030
                        </p>
                      </div>
                    </div>

                    <div className="contact-info-item">
                      <FaPhone className="contact-info-icon" />
                      <a href="tel:+918881778519" className="contact-link">
                        +91 8881778519
                      </a>
                    </div>

                    <div className="contact-info-item">
                      <FaEnvelope className="contact-info-icon" />
                      <a
                        href="mailto:dranandmdfm@gmail.com"
                        className="contact-link"
                      >
                        dranandmdfm@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="contact-form-column" ref={formCardRef}>
            <div className="contact-form-header">
              <h2>Send us a message</h2>
            </div>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-form-group">
                <label htmlFor="name">Name *</label>
                <div className="contact-input-container">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div className="contact-form-group">
                <label htmlFor="email">Email *</label>
                <div className="contact-input-container">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <div className="contact-form-group">
                <label htmlFor="phone">Phone</label>
                <div className="contact-input-container">
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              <div className="contact-form-group">
                <label htmlFor="message">Message *</label>
                <div className="contact-input-container">
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Write your message here..."
                  ></textarea>
                </div>
              </div>

              <div className="contact-form-divider">
                <span className="divider-text">---</span>
              </div>

              <button type="submit" className="contact-submit-btn">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Contact);
