import React from "react";
import "./Resources.css";

const resources = [
  {
    icon: "📊",
    title: "Annual Report",
    status: "coming-soon",
    statusLabel: "⏳ Coming Soon",
    description:
      "The Annual Report of NEXUS Biomedical Research Foundation Trust documents the Trust's activities, research milestones, financial summary, and impact for each year.",
    points: [
      "Research activities and publications overview",
      "Academic events, workshops, and conferences conducted",
      "Membership growth and committee updates",
      "Financial summary and fund utilisation",
      "Strategic goals and achievements for the year",
    ],
  },
  {
    icon: "📝",
    title: "Concept Note",
    status: "available",
    statusLabel: "✅ Available",
    description:
      "The Concept Note outlines the founding vision, mandate, and operational framework of NEXUS Biomedical Research Foundation Trust.",
    points: [
      "Established in 2025 as a Public Charitable Trust under Indian law",
      "Registered: Reg. No. 202501041059811, Lucknow, U.P.",
      "Focus on forensic medicine, toxicology, emergency care & biomedical sciences",
      "Platform for interdisciplinary research, publishing, and academic collaboration",
      "Committed to evidence-based practice and scientific integrity",
    ],
  },
  {
    icon: "🔒",
    title: "Policies",
    status: "available",
    statusLabel: "✅ Available",
    description:
      "NEXUS operates under a robust set of institutional policies ensuring ethical conduct, data protection, and academic integrity across all activities.",
    points: [
      "Privacy Policy: protection of member and participant data",
      "Ethics Policy: adherence to COPE, ICMJE, and institutional ethics",
      "Publication Policy: peer review standards and authorship guidelines",
      "Anti-Plagiarism Policy: mandatory similarity checks below 15%",
      "Conflict of Interest Policy: mandatory declaration by all members",
    ],
  },
  {
    icon: "📋",
    title: "Standard Operating Procedures (SOPs)",
    status: "coming-soon",
    statusLabel: "⏳ Coming Soon",
    description:
      "Detailed SOPs govern all research, administrative, and governance activities within the Trust to ensure consistency, compliance, and quality.",
    points: [
      "SOP for research proposal submission and ethical review",
      "SOP for manuscript submission and peer review process",
      "SOP for membership registration and renewal",
      "SOP for event organisation and academic dissemination",
      "SOP for financial management and fund disbursement",
    ],
  },
];

const Resources = () => {
  return (
    <div className="resources-page-container">
      <div className="resources-page-title">
        <h1>Resources</h1>
        <p>
          Official documents, policies, and operational frameworks of NEXUS
          Biomedical Research Foundation Trust
        </p>
      </div>

      <div className="resources-container">
        <div className="resources-section-header">
          <h2>Document Library</h2>
          <p>
            Access key institutional documents, guidelines, and standard
            procedures of the Trust
          </p>
        </div>

        <div className="resources-grid">
          {resources.map((item, index) => (
            <div key={index} className="resources-card">
              <div className="resources-card-header">
                <div className="resources-card-icon">{item.icon}</div>
                <h3>{item.title}</h3>
              </div>

              <div className="resources-card-divider" />

              <div className="resources-card-body">
                <p>{item.description}</p>
                <ul className="resources-card-list">
                  {item.points.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
                <span className={`resources-status-badge ${item.status}`}>
                  {item.statusLabel}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Resources;