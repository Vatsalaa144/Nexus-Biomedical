import React from "react";
import "./Research.css";

const sections = [
  {
    title: "Research Domains",
    icon: "🔬",
    desc: "Forensic toxicology, clinical medicine, emergency care & biomedical sciences.",
  },
  {
    title: "Research Methodology",
    icon: "📐",
    desc: "Evidence-based, ethically sound methodologies across quantitative and qualitative paradigms.",
  },
  {
    title: "Ethical Framework",
    icon: "⚖️",
    desc: "Governed by institutional ethics, informed consent protocols, and scientific integrity.",
  },
  {
    title: "Infrastructure & Facilities",
    icon: "🏛️",
    desc: "State-of-the-art laboratory, digital research tools, and collaborative academic spaces.",
  },
  {
    title: "Ongoing Projects",
    icon: "📊",
    desc: "Active multi-disciplinary research initiatives across forensic and biomedical domains.",
  },
  {
    title: "Completed Projects",
    icon: "🏆",
    desc: "Published and peer-reviewed research contributing to national and global health knowledge.",
  },
];

const Research = () => {
  return (
    <div className="research-page-container">
      <div className="research-page-title">
        <h1>Research</h1>
        <p>Advancing science through ethical, evidence-based biomedical and forensic research</p>
      </div>

      <div className="research-container">
        <div className="research-section-header">
          <h2>Research Areas</h2>
          <p>Explore our domains of research, active projects, and scientific infrastructure</p>
        </div>

        <div className="research-grid">
          {sections.map((item, index) => (
            <div key={index} className="research-card">
              <div className="research-card-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <div className="research-coming-soon">
                <span className="research-coming-soon-badge">Coming Soon</span>
                <p className="research-coming-soon-text">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Research;