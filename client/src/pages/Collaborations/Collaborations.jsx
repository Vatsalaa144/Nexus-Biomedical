import React from "react";
import "./Collaborations.css";

const sections = [
  {
    title: "Partner With Us",
    icon: "🤝",
    desc: "Join hands with NEXUS to advance biomedical research and expand scientific impact.",
  },
  {
    title: "Institutional Collaborations",
    icon: "🏛️",
    desc: "Academic and research partnerships with hospitals, universities, and health institutions.",
  },
  {
    title: "MoU / Agreements",
    icon: "📜",
    desc: "Formal memoranda of understanding with national and international research bodies.",
  },
  {
    title: "Funding Opportunities",
    icon: "💡",
    desc: "Grants, CSR funding, and collaborative research sponsorship avenues for members.",
  },
];

const Collaborations = () => {
  return (
    <div className="collab-page-container">
      <div className="collab-page-title">
        <h1>Collaborations</h1>
        <p>
          Building bridges across institutions, disciplines, and borders for
          impactful biomedical research
        </p>
      </div>

      <div className="collab-container">
        <div className="collab-section-header">
          <h2>Collaboration Areas</h2>
          <p>
            Explore partnership opportunities, institutional tie-ups, and
            funding pathways
          </p>
        </div>

        <div className="collab-grid">
          {sections.map((item, index) => (
            <div key={index} className="collab-card">
              <div className="collab-card-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <div className="collab-coming-soon">
                <span className="collab-coming-soon-badge">Coming Soon</span>
                <p className="collab-coming-soon-text">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collaborations;