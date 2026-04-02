import React, { useState, useEffect, useRef } from "react";
import "./Contact.css";
import { FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const contactCardsRef = useRef([]);
  const formCardRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    try {
      const API_BASE = import.meta.env.VITE_API_URL; // or VITE_API_URL if you used that name

      const response = await fetch(`${API_BASE}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          honeypot: "",
        }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setStatus("success");
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        setStatus("error");
        setErrorMsg(data.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        "Cannot connect to server. Please try again or email us directly at nexusbiomedicalresearch@gmail.com",
      );
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 },
    );

    [
      contactCardsRef.current[0],
      contactCardsRef.current[1],
      formCardRef.current,
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
        <div className="contact-main-container">
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
                      <FaEnvelope className="contact-info-icon" />
                      <a
                        href="https://mail.google.com/mail/u/0/?view=cm&fs=1&tf=1&to=nexusbiomedicalresearch@gmail.com"
                        className="contact-link"
                      >
                        nexusbiomedicalresearch@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

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
                      <FaEnvelope className="contact-info-icon" />
                      <a
                        href="https://mail.google.com/mail/u/0/?view=cm&fs=1&tf=1&to=nexusbiomedicalresearch@gmail.com"
                        className="contact-link"
                      >
                        nexusbiomedicalresearch@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-column" ref={formCardRef}>
            <div className="contact-form-header">
              <h2>Send us a message</h2>
            </div>

            <form className="contact-form" onSubmit={handleSubmit}>
              <input
                type="text"
                name="honeypot"
                style={{ display: "none" }}
                tabIndex="-1"
                autoComplete="off"
                aria-hidden="true"
              />

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
                    disabled={status === "sending"}
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
                    disabled={status === "sending"}
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
                    disabled={status === "sending"}
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
                    disabled={status === "sending"}
                  ></textarea>
                </div>
              </div>

              <button
                type="submit"
                className="contact-submit-btn"
                disabled={status === "sending"}
                style={{ opacity: status === "sending" ? 0.7 : 1 }}
              >
                {status === "sending" ? "Sending..." : "SEND MESSAGE"}
              </button>

              {status === "success" && (
                <div
                  style={{
                    marginTop: "14px",
                    padding: "12px 16px",
                    background: "#f0fff4",
                    border: "1px solid #68d391",
                    borderRadius: "6px",
                    color: "#276749",
                    fontSize: "0.9rem",
                    lineHeight: "1.5",
                  }}
                >
                  ✅ Message sent successfully! We'll get back to you within 2–3
                  business days. Check your email for a confirmation.
                </div>
              )}

              {status === "error" && (
                <div
                  style={{
                    marginTop: "14px",
                    padding: "12px 16px",
                    background: "#fff5f5",
                    border: "1px solid #fc8181",
                    borderRadius: "6px",
                    color: "#c53030",
                    fontSize: "0.9rem",
                    lineHeight: "1.5",
                  }}
                >
                  ❌ {errorMsg}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Contact);
