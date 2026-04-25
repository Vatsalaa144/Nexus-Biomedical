import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MembershipLanding.css";

const MembershipLanding = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const benefits = [
    "Participation in academic discussions and research-related activities",
    "Basic guidance on research methodology and study design",
    "Orientation to scientific writing and publication process (advisory level)",
    "Exposure to case-based discussions in biomedical and forensic fields",
    "Introduction to clinical research concepts and documentation",
    "Access to workshops, seminars, and training programs (as available)",
    "E-certificates for participation in academic activities",
    "Opportunity to interact with professionals from relevant disciplines",
  ];

  return (
    <div className="ml-page">
      {/* Hero */}
      <div className="ml-hero">
        <div className="ml-hero-bg" />
        <div className="ml-hero-content">
          <span className="ml-hero-tag">Official Membership Programme</span>
          <h1 className="ml-hero-title">MEMBERSHIP</h1>
          
          <p className="ml-hero-desc">
            Nexus Biomedical Research Foundation Trust offers a platform for academic
            interaction, research orientation, and professional development in
            biomedical, clinical, and medicolegal.
          </p>
        </div>
      </div>

      <div className="ml-body">

        {/* Membership Categories */}
        <section className="ml-section">
          <div className="ml-section-label">💼 Membership Categories</div>
          <div className="ml-cards">
            <div className="ml-card annual-card">
              <div className="ml-card-icon">📅</div>
              <h3>Annual Membership</h3>
              <div className="ml-card-price">₹5,000</div>
              <div className="ml-card-meta">1 Year &nbsp;|&nbsp; Renewable</div>
              <p>Stay connected year-round with full access to all academic activities and resources.</p>
            </div>
            <div className="ml-card lifetime-card">
              <div className="ml-card-badge">Most Popular</div>
              <div className="ml-card-icon">♾️</div>
              <h3>Lifetime Membership</h3>
              <div className="ml-card-price">₹10,000</div>
              <div className="ml-card-meta">One-time &nbsp;|&nbsp; Lifetime</div>
              <p>Become a permanent member and enjoy lifelong benefits, recognition, and access to all Trust activities.</p>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="ml-section ml-benefits-section">
          <div className="ml-section-label">🎁 Membership Benefits</div>
          <div className="ml-benefits-grid">
            {benefits.map((b, i) => (
              <div className="ml-benefit-item" key={i} style={{ animationDelay: `${i * 0.07}s` }}>
                <span className="ml-benefit-check">✔</span>
                <span>{b}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Eligibility */}
        <section className="ml-section ml-eligibility-section">
          <div className="ml-section-label">🎓 Eligibility</div>
          <p className="ml-eligibility-text">
            Open to <strong>students, researchers, clinicians, forensic professionals,
            scientists, doctors</strong> and <strong>academicians</strong> in biomedical and allied fields.
          </p>
        </section>

        {/* Apply CTA */}
        <section className="ml-cta-section">
          <h2 className="ml-cta-title">Ready to Join?</h2>
          <p className="ml-cta-sub">Select your preferred membership type and fill in your application.</p>
          <div className="ml-apply-wrapper" ref={dropdownRef}>
            <button
              className="ml-apply-btn"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              Apply for Membership &nbsp; {dropdownOpen ? "▲" : "▼"}
            </button>
            {dropdownOpen && (
              <div className="ml-apply-dropdown">
                <button
                  className="ml-dropdown-item annual-item"
                  onClick={() => { setDropdownOpen(false); navigate("/membership/annual"); }}
                >
                  <span className="ml-drop-icon">📅</span>
                  <div>
                    <div className="ml-drop-title">Annual Membership</div>
                    <div className="ml-drop-meta">₹5,000 &nbsp;|&nbsp; 1 Year</div>
                  </div>
                </button>
                <button
                  className="ml-dropdown-item lifetime-item"
                  onClick={() => { setDropdownOpen(false); navigate("/membership/lifetime"); }}
                >
                  <span className="ml-drop-icon">♾️</span>
                  <div>
                    <div className="ml-drop-title">Lifetime Membership</div>
                    <div className="ml-drop-meta">₹10,000 &nbsp;|&nbsp; Lifetime</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
};

export default MembershipLanding;