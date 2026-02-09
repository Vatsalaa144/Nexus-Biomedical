import React from "react";
import {
  FaHistory,
  FaGlobe,
  FaUsers,
  FaLightbulb,
  FaMicroscope,
  FaUserGraduate,
  FaHandshake,
  FaHeartbeat,
  FaShieldAlt,
  FaBook,
  FaAward,
  FaNetworkWired,
  FaCertificate,
  FaBriefcase,
  FaFlask,
} from "react-icons/fa";
import "./About.css";

const About = () => {
  return (
    <div className="about-page-container">
      <div className="about-page-title">
        <div className="about-container">
          <h1>About Us</h1>
          <p>Learn about the Nexus Biomedical Research Foundation Trust</p>
        </div>
      </div>

      <div className="about-container">
        <section className="about-section">
          <div className="about-content-section">
            <h2>Who We Are</h2>
            <p>
              NEXUS Biomedical Research Foundation Trust academic and research
              organization dedicated to advancing biomedical sciences and
              improving healthcare outcomes through ethical, evidence-based
              research. The Trust promotes excellence in clinical medicine,
              emergency medicine, forensic medicine, toxicology, public health,
              and allied health sciences. It serves as a platform for
              high-quality research, academic publishing, and interdisciplinary
              collaboration.Committed to scientific integrity and innovation,
              the Trust supports researchers, clinicians, and academicians in
              generating impactful knowledge. Through research, training, and
              scholarly dissemination, NEXUS Biomedical Research Foundation
              Trust aims to contribute meaningfully to medical advancement and
              the betterment of global health.
            </p>
          </div>

          <div className="about-info-cards">
            <div className="about-info-card">
              <div className="about-info-icon">
                <FaHistory />
              </div>
              <h3>Our History</h3>
              <p>
                Established in 2025, Nexus has grown from a small group of
                dedicated scientists to a nationwide network of Medical Science
                professionals.
              </p>
            </div>

            <div className="about-info-card">
              <div className="about-info-icon">
                <FaGlobe />
              </div>
              <h3>Our Reach</h3>
              <p>
                With members across India and international collaborations, we
                contribute to global Medical Science research and policy
                development.
              </p>
            </div>

            <div className="about-info-card">
              <div className="about-info-icon">
                <FaUsers />
              </div>
              <h3>Our Members</h3>
              <p>
                Over 50 active members including researchers, academicians,
                industry professionals, and students committed to Medical
                sciences.
              </p>
            </div>

            <div className="about-info-card">
              <div className="about-info-icon">
                <FaLightbulb />
              </div>
              <h3>Our Impact</h3>
              <p>
                Contributing to public health through research, education,
                regulatory guidance, and safety assessment in various domains of
                Medical Sciences.
              </p>
            </div>
          </div>
        </section>

        <section className="about-section about-objectives-section">
          <h2 className="about-section-title">Our Objectives</h2>
          <div className="about-objectives-grid">
            <div className="about-objective-item">
              <span className="about-objective-number">01</span>
              <div>
                <h3>Scientific Advancement</h3>
                <p>
                  Promote quality research and knowledge dissemination in
                  medicine and biomedical sciences.
                </p>
              </div>
            </div>

            <div className="about-objective-item">
              <span className="about-objective-number">02</span>
              <div>
                <h3>Professional Growth</h3>
                <p>
                  Support training, education, and skill development for
                  healthcare professionals.
                </p>
              </div>
            </div>

            <div className="about-objective-item">
              <span className="about-objective-number">03</span>
              <div>
                <h3>Public Health Impact</h3>
                <p>
                  Enhance healthcare quality, safety, and evidence-based public
                  health practices.
                </p>
              </div>
            </div>

            <div className="about-objective-item">
              <span className="about-objective-number">04</span>
              <div>
                <h3>Collaboration</h3>
                <p>
                  Strengthen national and international research partnerships.
                </p>
              </div>
            </div>

            <div className="about-objective-item">
              <span className="about-objective-number">05</span>
              <div>
                <h3>Ethical Excellence</h3>
                <p>Ensure ethical research practices and academic integrity.</p>
              </div>
            </div>

            <div className="about-objective-item">
              <span className="about-objective-number">06</span>
              <div>
                <h3>Student Engagement</h3>
                <p>Encourage and mentor students and young researchers.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="about-section about-membership-section">
          <h2 className="about-section-title">Membership Benefits</h2>
          <div className="about-benefits-grid">
            <div className="about-benefit-card">
              <h3>Access to Publications</h3>
              <p>
                Free or discounted access to trust journals, research articles,
                and scientific resources.
              </p>
            </div>
            <div className="about-benefit-card">
              <h3>Conference Participation</h3>
              <p>
                Concessional registration for conferences, workshops, seminars,
                and academic events.
              </p>
            </div>
            <div className="about-benefit-card">
              <h3>Networking Opportunities</h3>
              <p>
                Connect with researchers, clinicians, academicians, and industry
                professionals.
              </p>
            </div>
            <div className="about-benefit-card">
              <h3>Professional Recognition</h3>
              <p>
                Eligibility for awards, fellowships, certificates, and academic
                acknowledgements. Career Development
              </p>
            </div>
            <div className="about-benefit-card">
              <h3>Career Development</h3>
              <p>
                Support through career guidance, academic opportunities, and
                professional growth resources.
              </p>
            </div>
            <div className="about-benefit-card">
              <h3>Research Support</h3>
              <p>
                Opportunities for research collaboration, mentorship, funding
                guidance, and expert consultation.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default React.memo(About);
