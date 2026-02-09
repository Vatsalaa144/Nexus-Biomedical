import React from "react";
import "./Committee.css";

// placeholder images - actual images
import presidentPhoto from "../../assets/Committee/president.jpeg";
import vicePresidentPhoto from "../../assets/Committee/vicePresident.jpeg";
import secretaryPhoto from "../../assets/Committee/secretary.jpeg";
import jointSecretaryPhoto from "../../assets/Committee/jointSecretary.jpeg";
import treasurerPhoto from "../../assets/Committee/treasurer.jpeg";

export const Committee = () => {
  const committeeMembers = [
    {
      name: "Dr. Rajiv Ratan Singh Yadav",
      photo: presidentPhoto,
      designation: "President",
      department: "Professor, Department of Emergency Medicine.",
      institution:
        "Dr. Ram Manohar Lohia Institute of Medical Sciences, Lucknow, India.",
    },
    {
      name: "Dr. Shobhna Yadav",
      photo: vicePresidentPhoto,
      designation: "Vice President",
      department: "Consultant Pediatric",
      institution:
        "Uttar Pradesh Provincial Medical Service (UPPMS), Lucknow, India.",
    },
    {
      name: "Dr. Pradeep Kumar Yadav",
      photo: secretaryPhoto,
      designation: "Secretary",
      department:
        "Assistant Professor, Department of Forensic Medicine and Toxicology",
      institution:
        "Dr. Ram Manohar Lohia Institute of Medical Sciences, Lucknow, India.",
    },
    {
      name: "Dr. Deepanjali Yadav",
      photo: jointSecretaryPhoto,
      designation: "Joint Secretary",
      department: "Medical Officer (Dental)",
      institution:
        "Community Health Centre, Mallawa, Hardoi, Uttar Pradesh, India.",
    },
    {
      name: "Mr. Sachin Kumar Tripathi",
      photo: treasurerPhoto,
      designation: "Treasurer",
      department:
        "Scientific Officer Toxicology, Department of Forensic Medicine and Toxicology",
      institution: "King George's Medical University Lucknow, India.",
    },
  ];

  // Officio Members
  const officioMembers = [
    {
      name: "Miss. Rakhi Rajput",
      designation: "Senior Research fellow",
      department: "Department of Forensic Medicine and Toxicology",
      institution: "King George's Medical University Lucknow, India.",
    },
  ];

  // Historical data
  const historicalTable = [
    {
      years: "2024-2025",
      president: "Dr. Rajiv Ratan Singh Yadav",
      secretary: "Dr. Pradeep Kumar Yadav",
      treasurer: "Mr. Sachin Kumar Tripathi",
    },
  ];

  // Handle image error for committee members
  const handleImageError = (e, name) => {
    e.target.onerror = null;
    e.target.src = createInitialImage(name);
  };

  return (
    <div className="committee-page-container">
      <div className="committee-page-title">
        <div className="container">
          <h1>Executive Committee</h1>
          <p>
            Leadership driving Nexus Biomedical Research Foundation Trust
            forward
          </p>
        </div>
      </div>

      <div className="container">
        <section className="committee-section">
          <div className="committee-content-section">
            <h2 className="committee-main-heading">Our Leadership</h2>
            <p className="committee-intro">
              Our leadership comprises experienced medical professionals,
              researchers, academicians, and subject experts committed to
              advancing biomedical research and healthcare excellence. Guided by
              integrity, transparency, and scientific rigor, the leadership team
              provides strategic direction, ensures ethical governance, and
              fosters collaboration across disciplines. Their collective
              expertise drives the Trust's mission of promoting research,
              education, innovation, and public health impact at national and
              international levels.
            </p>
          </div>

          {/* Current Committee - Professional cards with photos */}
          <div className="committee-lists-container">
            {committeeMembers.map((member, index) => (
              <div
                key={index}
                className="committee-category committee-animate-fade-in"
              >
                <div className="committee-member-cards">
                  <div className="committee-member-card">
                    <div className="committee-member-photo-container">
                      {member.photo ? (
                        <img
                          src={member.photo}
                          alt={member.name}
                          className="committee-member-photo"
                          onError={(e) => handleImageError(e, member.name)}
                        />
                      ) : (
                        <div className="committee-member-photo-initial">
                          {getFirstLetter(member.name)}
                        </div>
                      )}
                    </div>
                    <div className="committee-member-info">
                      <div className="committee-member-name">{member.name}</div>
                      <div className="committee-member-designation">
                        {member.designation}
                      </div>
                      <div className="committee-member-department">
                        {member.department}
                      </div>
                      <div className="committee-member-institution">
                        {member.institution}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Officio Members Section */}
        <section className="committee-section officio-section">
          <div className="committee-content-section">
            <h2 className="committee-main-heading">
              Officio Members & Advisors
            </h2>
            <p className="committee-intro">
              Our Officio Members and Advisors bring diverse expertise from
              various fields to provide strategic guidance, ensure compliance,
              and enhance the Trust's impact. Their valuable insights and
              experience help shape our policies, programs, and future
              directions.
            </p>
          </div>

          <div className="officio-members-container">
            {officioMembers.map((member, index) => (
              <div
                key={index}
                className="officio-member-card committee-animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="officio-member-info">
                  <h3 className="officio-member-name">{member.name}</h3>
                  <div className="officio-member-designation">
                    {member.designation}
                  </div>
                  <div className="officio-member-department">
                    {member.department}
                  </div>
                  <div className="officio-member-institution">
                    {member.institution}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Historical Table */}
        <section className="committee-historical-section">
          <h2 className="committee-historical-heading">
            Presidents, Secretaries and Treasurers of Nexus Biomedical Research
            Foundation Trust
          </h2>
          <p className="committee-historical-subheading">(Through the Ages)</p>

          <div className="committee-historical-table-container committee-animate-slide-up">
            <table className="committee-historical-table">
              <thead>
                <tr>
                  <th className="committee-table-header">Years</th>
                  <th className="committee-table-header">President</th>
                  <th className="committee-table-header">Secretary</th>
                  <th className="committee-table-header">Treasurer</th>
                </tr>
              </thead>
              <tbody>
                {historicalTable.map((row, index) => (
                  <tr key={index} className="committee-table-row">
                    <td className="committee-table-data committee-years">
                      {row.years}
                    </td>
                    <td className="committee-table-data committee-president">
                      {row.president}
                    </td>
                    <td className="committee-table-data committee-secretary">
                      {row.secretary}
                    </td>
                    <td className="committee-table-data committee-secretary">
                      {row.treasurer}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default React.memo(Committee);
