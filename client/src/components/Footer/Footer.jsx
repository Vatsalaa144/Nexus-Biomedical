import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaTwitter,
  FaLinkedinIn,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import "./Footer.css";

const modalContent = {
  privacy: {
    title: "PRIVACY POLICY",
    content: `Nexus Biomedical Research Foundation Trust ("the Trust") is committed to protecting the privacy and confidentiality of all users, research participants, collaborators, and stakeholders.

1. Information We Collect
We may collect the following types of information:
• Personal details (name, email, phone number, affiliation)
• Professional and institutional information
• Research-related data (submitted voluntarily)
• Website usage data (cookies, IP address, analytics)

2. Use of Information
The collected information is used for:
• Communication and correspondence
• Research collaboration and project management
• Processing membership or proposal submissions
• Improving website functionality and user experience

3. Data Protection & Security
The Trust implements appropriate technical and organizational safeguards to protect data against unauthorized access, disclosure, or misuse. Sensitive research data is handled in compliance with applicable ethical and legal standards.

4. Confidentiality of Research Data
All research-related data, especially human subject data, is treated with strict confidentiality and used only for approved scientific purposes under ethical guidelines.

5. Third-Party Sharing
We do not sell or rent personal information. Data may be shared only:
• With authorized collaborators or institutions
• When required by law or regulatory authorities

6. Cookies Policy
Our website may use cookies to enhance user experience and analyze traffic. Users may disable cookies through browser settings.

7. User Rights
Users may request access, correction, or deletion of their personal data by contacting the Trust.

8. Policy Updates
This policy may be updated periodically. Continued use of the website implies acceptance of updated terms.`,
  },
  terms: {
    title: "TERMS & CONDITIONS",
    content: `By accessing this website, you agree to comply with the following terms:

1. Use of Website
• Content is for informational and academic purposes only
• Unauthorized use, reproduction, or distribution is prohibited

2. Intellectual Property Rights
All content, including text, logos, research materials, and publications, is the property of the Trust unless otherwise stated.

3. Research Content Disclaimer
The information provided does not constitute medical, legal, or professional advice and should not be relied upon as such.

4. User Submissions
Any information submitted (proposals, forms, etc.) must be accurate and lawful. The Trust reserves the right to review and reject submissions.

5. External Links
The website may contain links to third-party sites. The Trust is not responsible for their content or privacy practices.

6. Limitation of Liability
The Trust shall not be held liable for any direct or indirect damages arising from the use of this website.

7. Governing Law
These terms shall be governed by the laws of India, and disputes shall fall under the jurisdiction of relevant courts.`,
  },
  disclaimer: {
    title: "DISCLAIMER",
    content: `The information provided on this website is intended for general informational and academic purposes only.

• The Trust makes no warranties regarding the completeness, accuracy, or reliability of the content
• Research findings and publications represent scientific observations and may evolve over time
• The website does not provide medical diagnosis, treatment, or legal advice
• Users are advised to consult qualified professionals for specific concerns

The Trust shall not be liable for any loss or damage arising from reliance on the information provided on this website.`,
  },
  ethics: {
    title: "ETHICAL COMPLIANCE STATEMENT",
    content: `Nexus Biomedical Research Foundation Trust is committed to maintaining the highest standards of ethical conduct in all research and institutional activities.

1. Human Research Ethics
All studies involving human participants are conducted in accordance with:
• Institutional Ethics Committee (IEC) approval
• Informed consent procedures
• National and international ethical guidelines (e.g., ICMR, Declaration of Helsinki)

2. Animal Ethics (If Applicable)
Any research involving animals adheres to established ethical guidelines and regulatory approvals.

3. Data Integrity & Scientific Rigor
• Ensuring accuracy, transparency, and reproducibility in research
• Avoidance of fabrication, falsification, or plagiarism

4. Conflict of Interest
All researchers and collaborators are required to disclose any potential conflicts of interest.

5. Privacy & Confidentiality
Strict confidentiality is maintained for all research participants and sensitive data.

6. Responsible Publication
The Trust promotes ethical publication practices in accordance with recognized standards and journal guidelines.`,
  },
};

const Modal = ({ id, onClose }) => {
  const data = modalContent[id];
  if (!data) return null;

  const renderContent = (text) =>
    text.split("\n").map((line, i) => {
      if (!line.trim()) return <br key={i} />;
      const isBullet = line.trim().startsWith("•");
      const isNumbered = /^\d+\./.test(line.trim());
      if (isBullet) {
        return (
          <p key={i} className="modal-bullet">
            {line.trim()}
          </p>
        );
      }
      if (isNumbered) {
        const lineText = line.trim();
        // Add colon if not already present
        const withColon = lineText.endsWith(':') ? lineText : lineText + ':';
        return (
          <p key={i} className="modal-numbered">
            {withColon}
          </p>
        );
      }
      return (
        <p key={i} className="modal-para">
          {line.trim()}
        </p>
      );
    });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{data.title}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>
        <div className="modal-body">{renderContent(data.content)}</div>
      </div>
    </div>
  );
};

const Footer = () => {
  const [activeModal, setActiveModal] = useState(null);

  return (
    <>
      <footer className="footer">
        <div className="footer-top">
          <div className="container">
            <div className="footer-grid">
              {/* Organization Info */}
              <div className="footer-column">
                <div className="footer-logo">
                  <h3>NEXUS BIOMEDICAL RESEARCH FOUNDATION TRUST</h3>
                  <p className="tagline">Advancing Medical Science globally</p>
                </div>
                <p className="footer-description">
                  An International Forum for Biomedical Professionals &
                  Researchers
                </p>
                <div className="social-links">
                  <a
                    href="https://x.com/JairamJournal"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="X"
                  >
                    <FaTwitter />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/jairam-journal-5a8174404/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                  >
                    <FaLinkedinIn />
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div className="footer-column">
                <h4 className="footer-heading">Quick Links</h4>
                <ul className="footer-links">
                  <li>
                    <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to="/about">About Us</Link>
                  </li>
                  <li>
                    <Link to="/committee">Executive Committee</Link>
                  </li>
                  <li>
                    <button className="footer-modal-btn" onClick={() => setActiveModal("privacy")}>
                      Privacy Policy
                    </button>
                  </li>
                  <li>
                    <button className="footer-modal-btn" onClick={() => setActiveModal("disclaimer")}>
                      Disclaimer
                    </button>
                  </li>
                </ul>
              </div>

              {/* Resources */}
              <div className="footer-column">
                <h4 className="footer-heading">Resources</h4>
                <ul className="footer-links">
                  <li>
                    <Link to="/blog">Our Blogs</Link>
                  </li>
                  <li>
                    <Link to="/contact">Feedback</Link>
                  </li>
                  <li>
                    <button className="footer-modal-btn" onClick={() => setActiveModal("terms")}>
                      Terms &amp; Conditions
                    </button>
                  </li>
                  <li>
                    <button className="footer-modal-btn" onClick={() => setActiveModal("ethics")}>
                      Ethics Statement
                    </button>
                  </li>
                </ul>
              </div>

              {/* Contact Information */}
              <div className="footer-column">
                <h4 className="footer-heading">Contact Us</h4>
                <div className="contact-info">
                  <div className="contact-item">
                    <FaMapMarkerAlt className="contact-icon" />
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Department+of+Forensic+Medicine+and+Toxicology+King+George's+Medical+University+Lucknow"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="address-link"
                    >
                      <div>
                        <p>Office Add- 151, Sector- J Pocket-2, Sushant Golf City.</p>
                        <p>Lucknow, PO: Sushant Golf City,</p>
                        <p>DIST: Lucknow, Uttar Pradesh, 226030</p>
                      </div>
                    </a>
                  </div>
                  <div className="contact-item">
                    <FaEnvelope className="contact-icon" />
                    <div>
                      <a href="https://mail.google.com/mail/u/0/?view=cm&fs=1&tf=1&to=nexusbiomedicalresearch@gmail.com">
                        nexusbiomedicalresearch@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="container">
            <div className="footer-bottom-content">
              <p className="copyright">
                &copy; {new Date().getFullYear()} Nexus Biomedical Research
                Foundation Trust. All Rights Reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {activeModal && (
        <Modal id={activeModal} onClose={() => setActiveModal(null)} />
      )}
    </>
  );
};

export default React.memo(Footer);