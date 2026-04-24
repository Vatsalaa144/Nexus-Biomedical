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
  const officioMembers = [
    {
      name: "Miss. Rakhi Rajput",
      designation: "Senior Research fellow",
      department: "Department of Forensic Medicine and Toxicology",
      institution: "King George's Medical University Lucknow, India.",
    },
  ];

  const historicalTable = [
    {
      years: "2024-2025",
      president: "Dr. Rajiv Ratan Singh Yadav",
      secretary: "Dr. Pradeep Kumar Yadav",
      treasurer: "Mr. Sachin Kumar Tripathi",
    },
  ];

  return (
    <div className="about-page-container">
      {/* ── Page Banner ── */}
      <div className="about-page-title">
        <div className="about-container">
          <h1>About Us</h1>
          <p>Learn about the Nexus Biomedical Research Foundation Trust</p>
        </div>
      </div>

      <div className="about-container">

        {/* ── Who We Are ── */}
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

        {/* ── Info Cards ── */}
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

        {/* ── Objectives ── */}
        <div className="about-objectives-section">
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

            <div className="about-objective-item">
              <span className="about-objective-number">07</span>
              <div>
                <h3>Vision</h3>
                <p>
                  A globally recognized center of excellence in forensic and
                  biomedical research, driving innovation, strengthening
                  medico-legal systems, and improving population health through
                  scientific rigor.
                </p>
              </div>
            </div>

            <div className="about-objective-item">
              <span className="about-objective-number">08</span>
              <div>
                <h3>Mission</h3>
                <p>
                  Conduct ethical, high-quality biomedical and forensic research;
                  integrate AI into healthcare frameworks; drive evidence-based
                  policy; build global collaborations; and promote capacity
                  building and scientific dissemination.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Founder's Message ── */}
        <div className="about-founders-section">
          <h2 className="about-section-title about-founders-title">
            Founder's Message
          </h2>

          <div className="about-founders-grid">
            <div className="about-founder-card">
              <div className="about-founder-diamond">🔷</div>
              <div className="about-founder-meta">
                <span className="about-founder-name">
                  Dr. Rajiv Ratan Singh Yadav
                </span>
                <span className="about-founder-role">(President)</span>
                <span className="about-founder-dept">
                  Professor of Emergency Medicine, Dr. RMLIMS
                </span>
              </div>
              <blockquote className="about-founder-quote">
                "At NEXUS Biomedical Research Foundation Trust, our focus is to
                strengthen evidence-based practice in clinical and emergency
                medicine through high-quality research and academic
                collaboration. The Trust promotes excellence across clinical
                medicine, emergency care, forensic science, toxicology, and
                public health. We aim to create a robust platform for
                interdisciplinary research that translates into improved patient
                care and healthcare outcomes."
              </blockquote>
            </div>

            <div className="about-founder-card">
              <div className="about-founder-diamond">🔷</div>
              <div className="about-founder-meta">
                <span className="about-founder-name">
                  Dr. Pradeep Kumar Yadav
                </span>
                <span className="about-founder-role">(Secretary)</span>
                <span className="about-founder-dept">
                  Department of Forensic Medicine &amp; Toxicology, Dr. RMLIMS
                </span>
              </div>
              <blockquote className="about-founder-quote">
                "The Trust is committed to advancing forensic medicine and
                toxicology through scientific rigor and ethical research
                practices. By fostering academic publishing and collaborative
                research, we strive to enhance medico-legal understanding and
                contribute to justice and public health systems. NEXUS serves as
                a platform for integrating forensic science with broader
                biomedical research."
              </blockquote>
            </div>

            <div className="about-founder-card">
              <div className="about-founder-diamond">🔷</div>
              <div className="about-founder-meta">
                <span className="about-founder-name">
                  Sachin Kumar Tripathi
                </span>
                <span className="about-founder-role">(Treasurer)</span>
                <span className="about-founder-dept">
                  Scientific Officer (Toxicology), KGMU
                </span>
              </div>
              <blockquote className="about-founder-quote">
                "NEXUS Biomedical Research Foundation Trust supports innovation
                and analytical excellence in toxicology and biomedical sciences.
                Through structured research, academic dissemination, and
                interdisciplinary collaboration, the Trust aims to generate
                impactful scientific knowledge. Our goal is to contribute
                meaningfully to healthcare advancement and global scientific
                progress."
              </blockquote>
            </div>
          </div>
        </div>

        {/* ── Legal Status & Registration ── */}
        <section className="about-legal-section">
          <h2 className="about-section-title">
            Legal Status &amp; Registration
          </h2>

          <div className="about-legal-content">
            <div className="about-legal-block">
              <h3 className="about-legal-heading">Legal Constitution</h3>
              <p>
                NEXUS Biomedical Research Foundation Trust is a legally
                constituted, non-profit organization established under the
                applicable provisions of Indian law governing public charitable
                trusts. The Trust has been created through a duly executed Trust
                Deed and operates as an independent academic and research
                institution dedicated to biomedical, forensic, and public health
                advancement.
              </p>
            </div>

            <div className="about-legal-block">
              <h3 className="about-legal-heading">Registration Details</h3>
              <table className="about-legal-table">
                <tbody>
                  <tr>
                    <td className="about-legal-label">Name of the Trust</td>
                    <td>NEXUS Biomedical Research Foundation Trust</td>
                  </tr>
                  <tr>
                    <td className="about-legal-label">Registration Number</td>
                    <td>202501041059811</td>
                  </tr>
                  <tr>
                    <td className="about-legal-label">Date of Registration</td>
                    <td>03 December 2025</td>
                  </tr>
                  <tr>
                    <td className="about-legal-label">Nature of Entity</td>
                    <td>Public Charitable Trust (Non-Profit)</td>
                  </tr>
                  <tr>
                    <td className="about-legal-label">Governing Law</td>
                    <td>Indian Trust Act and applicable state regulations</td>
                  </tr>
                  <tr>
                    <td className="about-legal-label">Registration Authority</td>
                    <td>Office of the Sub-Registrar, Lucknow, Uttar Pradesh</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="about-legal-block">
              <h3 className="about-legal-heading">Registered Office</h3>
              <p className="about-legal-address">
                151, Sector-2,<br />
                Gomti Nagar Extension,<br />
                Lucknow, Uttar Pradesh, India
              </p>
            </div>

            <div className="about-legal-block">
              <h3 className="about-legal-heading">
                Jurisdiction &amp; Area of Operation
              </h3>
              <p>
                The Trust operates across India and internationally, with the
                authority to establish branch offices, research units, and
                collaborative centers in different regions as required for
                fulfilling its objectives.
              </p>
            </div>

            <div className="about-legal-block">
              <h3 className="about-legal-heading">
                Legal Nature &amp; Governance
              </h3>
              <ul className="about-legal-list">
                <li>The Trust is a non-profit, non-governmental organization.</li>
                <li>It is governed by a Board of Trustees as defined in the Trust Deed.</li>
                <li>The Managing/Founder Trustee holds executive authority as per deed provisions.</li>
                <li>The Trust operates under principles of transparency, accountability, and ethical governance.</li>
              </ul>
            </div>

            <div className="about-legal-block">
              <h3 className="about-legal-heading">
                Objectives as per Registration
              </h3>
              <p>As per the registered Trust Deed, the organization is established for:</p>
              <ul className="about-legal-list">
                <li>Promotion of scientific and biomedical research.</li>
                <li>Advancement of forensic medicine, toxicology, and healthcare sciences.</li>
                <li>Establishment of research laboratories and academic platforms.</li>
                <li>Conduct of educational programs, workshops, and conferences.</li>
                <li>Publication of scientific journals and research materials.</li>
                <li>Support for social welfare, education, and public health initiatives.</li>
              </ul>
            </div>

            <div className="about-legal-block">
              <h3 className="about-legal-heading">
                Financial &amp; Legal Compliance
              </h3>
              <ul className="about-legal-list">
                <li>The Trust operates through legally maintained funds and accounts.</li>
                <li>It is authorized to receive donations, grants, CSR funding, and institutional support.</li>
                <li>All financial activities are conducted in accordance with applicable laws and are subject to proper accounting and audit procedures.</li>
              </ul>
            </div>

            <div className="about-legal-block">
              <h3 className="about-legal-heading">Irrevocability Clause</h3>
              <p>
                The Trust is irrevocable in nature, and its assets and income
                shall be utilized solely for the fulfillment of its stated
                objectives and not for any personal or private benefit.
              </p>
            </div>

            <div className="about-legal-block">
              <h3 className="about-legal-heading">Dissolution Clause</h3>
              <p>
                In the event of dissolution, the remaining assets of the Trust
                shall be transferred to another organization with similar
                objectives, in compliance with applicable legal provisions.
              </p>
            </div>

            <div className="about-legal-block">
              <h3 className="about-legal-heading">Commitment to Compliance</h3>
              <p>
                The Trust adheres to all applicable statutory, ethical, and
                regulatory requirements and is committed to maintaining the
                highest standards of legal compliance, transparency, and
                institutional integrity.
              </p>
            </div>
          </div>
        </section>

        
       

      </div>
    </div>
  );
};

export default React.memo(About);