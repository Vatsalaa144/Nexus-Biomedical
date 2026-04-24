import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import "./Navbar.css";

import logo from "../../assets/logo.jpeg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About Us" },
    { path: "/committee", label: "Committee" },
    { path: "/research", label: "Research/Grants" },
    { path: "/collaborations", label: "Collaborations" },
    { path: "/blog", label: "Blog" },
  ];

  return (
    <nav className="navbar">
      {/* Header Section: Logo + Title Info */}
      <div className="navbar-header">
        <div className="header-container">
          {/* Logo on left */}
          <div className="header-logo">
            <img
              src={logo}
              alt="Nexus Biomedical Research Foundation Trust Logo"
              className="logo-image"
            />
          </div>

          {/* Title Info in 3 lines on right */}
          <div className="header-info">
            <div className="info-line-2">
              NEXUS BIOMEDICAL RESEARCH FOUNDATION TRUST
            </div>
            <div className="info-line-3">
              Registered Trust | Reg. No.: 202501041059811
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links Section */}

      <div className="navbar-links">
        <div className="links-container">
          {/* Desktop Navigation */}
          <div className={`menu-wrapper ${isOpen ? "active" : ""}`}>
            <ul className="nav-menu">
              {navItems.map((item) => (
                <li key={item.path} className="nav-item">
                  <Link
                    to={item.path}
                    className={`nav-link ${
                      location.pathname === item.path ? "active" : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}

              <li className="nav-item">
                <Link
                  to="/jairam-journal"
                  className={`nav-link ${
                    location.pathname === "/jairam-journal" ? "active" : ""
                  }`}
                >
                  JAIRAM Journal
                </Link>
              </li>
              <li className="nav-item nav-item-dropdown">
                <Link
                  to="/membership"
                  className={`nav-link ${location.pathname.startsWith("/membership") ? "active" : ""}`}
                >
                  MEMBERSHIP
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/resources"
                  className={`nav-link ${
                    location.pathname === "/resources" ? "active" : ""
                  }`}
                >
                  Resources
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/media"
                  className={`nav-link ${
                    location.pathname === "/media" ? "active" : ""
                  }`}
                >
                  Media & Updates
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/contact"
                  className={`nav-link ${
                    location.pathname === "/contact" ? "active" : ""
                  }`}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            className="menu-toggle"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default React.memo(Navbar);
