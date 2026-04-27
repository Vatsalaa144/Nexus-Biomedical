import React from "react";
import "./JairamJournal.css";
import Logo from "../../assets/logo.jpg";

const scopeAreas = [
  {
    icon: "🚨",
    title: "Emergency Medicine",
    desc: "Acute care, trauma, critical interventions, and pre-hospital medicine.",
  },
  {
    icon: "🧬",
    title: "Clinical Sciences",
    desc: "Internal medicine, diagnostics, therapeutics, and clinical trials.",
  },
  {
    icon: "🔬",
    title: "Forensic Medicine",
    desc: "Medico-legal investigations, toxicology, and forensic pathology.",
  },
  {
    icon: "💊",
    title: "Pharmacology & Toxicology",
    desc: "Drug studies, poison management, and adverse effect research.",
  },
  {
    icon: "🏥",
    title: "Public Health",
    desc: "Epidemiology, health policy, preventive medicine, and community health.",
  },
  {
    icon: "🤖",
    title: "AI in Healthcare",
    desc: "Machine learning applications in diagnostics and medico-legal systems.",
  },
];

const stats = [
  { icon: "📖", value: "Open", label: "Access Journal" },
  { icon: "✅", value: "Peer", label: "Reviewed" },
  { icon: "🌐", value: "Global", label: "Reach" },
  { icon: "📅", value: "2026", label: "Established" },
];

const JairamJournal = () => {
  return (
    <div className="journal-page-container">
      {/* Banner */}
      <div className="journal-page-title">
        <div className="journal-banner-badge">
          Official Publication — NEXUS Trust
        </div>
        <h1>Journal of Advanced &amp; Integrated Research in Acute Medicine</h1>

        <p>
          A peer-reviewed, open-access platform publishing high-quality research
          in emergency medicine, clinical sciences, and interdisciplinary
          healthcare.
        </p>
      </div>

      <div className="journal-container">
        {/* About Card */}
        <div className="journal-about-card">
          <div className="journal-about-icon">
            <img src={Logo} alt="JAIRAM Logo" className="journal-about-logo" />
          </div>
          <div className="journal-about-text">
            <h2>About JAIRAM</h2>
            <p>
              JAIRAM is the official journal of NEXUS Biomedical Research
              Foundation Trust, dedicated to advancing knowledge in acute and
              emergency medicine. It provides a rigorous academic platform for
              clinicians, researchers, and forensic scientists to publish
              impactful, evidence-based research that improves patient care and
              strengthens medico-legal systems.
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="journal-stats">
          {stats.map((s, i) => (
            <div key={i} className="journal-stat-card">
              <div className="journal-stat-icon">{s.icon}</div>
              <div className="journal-stat-value">{s.value}</div>
              <div className="journal-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Scope */}
        <h2 className="journal-section-heading">📌 Scope &amp; Focus Areas</h2>
        <div className="journal-scope-grid">
          {scopeAreas.map((area, i) => (
            <div key={i} className="journal-scope-card">
              <div className="journal-scope-icon">{area.icon}</div>
              <div>
                <h4>{area.title}</h4>
                <p>{area.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Info Cards */}
        <div className="journal-info-grid">
          <div className="journal-info-card">
            <h3>📥 Submission Guidelines</h3>
            <ul>
              <li>Original research articles, reviews, and case reports</li>
              <li>Manuscripts submitted in English (APA / Vancouver style)</li>
              <li>Strict double-blind peer review process</li>
              <li>
                Ethical clearance certificate required for clinical studies
              </li>
              <li>Plagiarism check mandatory — below 15% similarity</li>
            </ul>
          </div>
          <div className="journal-info-card">
            <h3>🏅 Publication Ethics</h3>
            <ul>
              <li>Adherence to COPE guidelines and ICMJE recommendations</li>
              <li>Authors must declare conflicts of interest</li>
              <li>Data fabrication and falsification strictly prohibited</li>
              <li>Corrections and retractions handled transparently</li>
              <li>All submissions screened for ethical compliance</li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="journal-cta">
          <h3>Ready to Submit Your Research?</h3>
          <p>
            Join a growing community of researchers publishing in emergency
            medicine, forensic sciences, and biomedical research.
          </p>
          <a
            href="https://jai-ram.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="journal-cta-btn"
          >
            🔗 Visit JAIRAM Journal
          </a>
        </div>
      </div>
    </div>
  );
};

export default JairamJournal;
