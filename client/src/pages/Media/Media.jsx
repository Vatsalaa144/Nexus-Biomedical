import React from "react";
import "./Media.css";

const sections = [
  {
    icon: "📰",
    title: "News & Announcements",
    description:
      "Stay informed with the latest updates, press releases, and institutional announcements from NEXUS Biomedical Research Foundation Trust.",
    bullets: [
      "Official press releases and public statements",
      "Research milestones and publication highlights",
      "Committee decisions and policy updates",
      "Partnership and collaboration announcements",
      "Awards, recognitions, and achievements",
    ],
    status: "coming-soon",
  },
  {
    icon: "🗓️",
    title: "Events / Workshops",
    description:
      "Explore upcoming and past events, academic workshops, conferences, and community programs organized by the Trust.",
    bullets: [
      "Academic conferences and symposiums",
      "Hands-on research workshops and training",
      "Community outreach and health programs",
      "Webinars and online learning sessions",
      "Annual general meetings and seminars",
    ],
    status: "coming-soon",
  },
  {
    icon: "🖼️",
    title: "Gallery",
    description:
      "A curated visual archive of events, research activities, institutional milestones, and the people behind NEXUS.",
    bullets: [
      "Event and workshop photo collections",
      "Research lab and fieldwork documentation",
      "Committee and team photographs",
      "Institutional milestone moments",
      "Outreach and community engagement visuals",
    ],
    status: "coming-soon",
  },
];

const StatusBadge = ({ status }) => {
  if (status === "available") {
    return (
      <span className="badge badge-available">
        <span className="badge-dot" /> Available
      </span>
    );
  }
  return (
    <span className="badge badge-soon">
      <span className="badge-dot" /> Coming Soon
    </span>
  );
};

const Media = () => {
  return (
    <div className="media-page">
      <div className="media-hero">
        <h1 className="hero-title">Media &amp; Updates</h1>
        <p className="hero-subtitle">
          News, events, and visual stories from NEXUS Biomedical Research Foundation Trust
        </p>
      </div>

      <div className="media-content">
        <div className="section-header">
          <h2 className="section-title">Media Channels</h2>
          <div className="section-underline" />
          <p className="section-desc">
            Access news, event information, and gallery content from the Trust
          </p>
        </div>

        <div className="media-grid">
          {sections.map((item, index) => (
            <div key={index} className="media-card" style={{ "--i": index }}>
              <div className="card-header">
                <div className="card-icon-wrap">
                  <span className="card-icon">{item.icon}</span>
                </div>
                <h3 className="card-title">{item.title}</h3>
              </div>

              <p className="card-desc">{item.description}</p>

              <ul className="card-bullets">
                {item.bullets.map((b, i) => (
                  <li key={i} className="card-bullet">
                    <span className="bullet-dot">·</span> {b}
                  </li>
                ))}
              </ul>

              <div className="card-footer">
                <StatusBadge status={item.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Media;