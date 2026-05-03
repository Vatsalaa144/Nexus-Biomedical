import React, { useState } from "react";
import "./Media.css";

// ── Event Photos ───────────────────────────────────────────────────────────────
// Files live in src/assets/photos/
import event1 from "../../assets/photos/event 1.png";
import event2 from "../../assets/photos/event 2.jpeg";
import event3 from "../../assets/photos/event 3.jpeg";

const eventPhotos = [
  { id: 1, src: event1, caption: "", date: "" },
  { id: 2, src: event2, caption: "", date: "" },
  { id: 3, src: event3, caption: "", date: "" },
];

// ── Other Media Sections ───────────────────────────────────────────────────────
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
];

// ── Lightbox ───────────────────────────────────────────────────────────────────
const Lightbox = ({ photo, onClose, onPrev, onNext }) => {
  if (!photo) return null;
  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <button className="lightbox-close" onClick={onClose} aria-label="Close">
        ✕
      </button>
      <button
        className="lightbox-nav lightbox-prev"
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        aria-label="Previous"
      >
        ‹
      </button>

      <div className="lightbox-body" onClick={(e) => e.stopPropagation()}>
        <img src={photo.src} alt={photo.caption} className="lightbox-img" />
        <div className="lightbox-caption">
          <span className="lightbox-cap-text">{photo.caption}</span>
          {photo.date && (
            <span className="lightbox-cap-date">{photo.date}</span>
          )}
        </div>
      </div>

      <button
        className="lightbox-nav lightbox-next"
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        aria-label="Next"
      >
        ›
      </button>
    </div>
  );
};

// ── Photo Gallery ──────────────────────────────────────────────────────────────
const PhotoGallery = () => {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const openLightbox = (i) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const prevPhoto = () =>
    setLightboxIndex((i) => (i - 1 + eventPhotos.length) % eventPhotos.length);
  const nextPhoto = () => setLightboxIndex((i) => (i + 1) % eventPhotos.length);

  return (
    <>
      <div className="gallery-grid">
        {eventPhotos.map((photo, i) => (
          <button
            key={photo.id}
            className="gallery-thumb"
            onClick={() => openLightbox(i)}
            aria-label={`View ${photo.caption}`}
          >
            <img src={photo.src} alt={photo.caption} loading="lazy" />
            <div className="gallery-thumb-overlay">
              <span className="gallery-thumb-caption">{photo.caption}</span>
              {photo.date && (
                <span className="gallery-thumb-date">{photo.date}</span>
              )}
            </div>
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          photo={eventPhotos[lightboxIndex]}
          onClose={closeLightbox}
          onPrev={prevPhoto}
          onNext={nextPhoto}
        />
      )}
    </>
  );
};

// ── Status Badge ───────────────────────────────────────────────────────────────
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

// ── Media Page ─────────────────────────────────────────────────────────────────
const Media = () => {
  return (
    <div className="media-page">
      <div className="media-hero">
        <h1 className="hero-title">Media &amp; Updates</h1>
        <p className="hero-subtitle">
          News, events, and visual stories from NEXUS Biomedical Research
          Foundation Trust
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

        {/* ── 1. Gallery card — full width, on top ── */}
        <div className="gallery-section-card">
          <div className="card-header">
            <div className="card-icon-wrap">
              <span className="card-icon">🖼️</span>
            </div>
            <h3 className="card-title">Gallery</h3>
          </div>
          <p className="card-desc">
            We hosted the launch event of Nexus Biomedical Research Foundation
            Trust, bringing together contributors across research, technology,
            and collaboration.
          </p>
          <PhotoGallery />
        </div>

        {/* ── 2. Other cards — two columns side by side below ── */}
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
