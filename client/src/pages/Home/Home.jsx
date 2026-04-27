import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import BlogCard from "../../components/BlogCard/BlogCard";
import blogData from "../../data/blogData";

// images
import hero_bg1 from "../../assets/hero-bg1.jpeg";
import hero_bg2 from "../../assets/hero-bg2.jpg";
import hero_bg3 from "../../assets/hero-bg3.jpg";
import hero_bg4 from "../../assets/hero-bg4.jpg";
import hero_bg5 from "../../assets/hero-bg5.jpg";
import axios from "axios"

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const API_BASE = import.meta.env.VITE_API_URL;
  // Get only first 3 blogs for homepage
  const featuredBlogs = blogData.slice(0, 3);

  // Hero slider
  const heroSlides = [
    {
      image: hero_bg1,
    },
    {
      image: hero_bg2,
    },
    {
      image: hero_bg3,
    },
    {
      image: hero_bg4,
    },
    {
      image: hero_bg5,
    },
  ];

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  // Navigate to specific slide
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
    );
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  useEffect(() => {
    const healthCheck = async () => {
      try {
        await axios.get(`${API_BASE}/health`, {
          timeout: 55000, // 55 seconds
        });
      } catch (err) {
        console.log(err);
      }
    };

    healthCheck();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Slider Section  */}
      <section className="home-hero-slider">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`home-hero-slide ${index === currentSlide ? "active" : ""
              }`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="home-hero-overlay"></div>
            <div className="home-hero-content-wrapper">
              {/* <div className="home-hero-text">
                NEXUS BIOMEDICAL RESEARCH FOUNDATION TRUST
              </div>
              <div className="home-hero-text2">
                An International professional organization dedicated to the
                promotion of academics and research in toxicology
              </div> */}
              <Link to="/about" className="home-hero-btn">
                Know More
              </Link>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button className="home-slider-arrow prev" onClick={goToPrevSlide}>
          <span>‹</span>
        </button>
        <button className="home-slider-arrow next" onClick={goToNextSlide}>
          <span>›</span>
        </button>
      </section>

      {/* Important Dates Section */}
      <section className="home-important-dates-section">
        <div className="container">
          <div className="home-dates-container">
            <h2 className="home-section-heading-alt">Important Dates</h2>

            <div className="home-dates-content">
              <div className="home-date-card">
                <div className="home-date-badge">Upcoming Event</div>
                <h3 className="home-event-title-main">
                  1st Governing Body Meeting
                </h3>

                <div className="home-date-highlight">
                  <div className="home-date-main">25th December 2025</div>
                </div>

                {/* <div className="home-event-status">
                  <div className="home-status-indicator"></div>
                  <span className="home-status-text">
                    Event Day Has Arrived!
                  </span>
                </div> */}

                <p className="home-date-message">
                  Save the date and stay tuned for more updates!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Blog Section */}
      <section className="home-blog-section">
        <div className="container">
          <h2 className="home-section-heading">Our Blog</h2>
          <p className="home-section-subtitle">
            Latest insights, research updates, and news from the field of
            Biomedical Science and Allied Health
          </p>

          <div className="home-blog-grid">
            {featuredBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>

          <div className="home-blog-cta">
            <Link to="/blog" className="home-view-all-btn">
              View All Blog Articles →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default React.memo(Home);