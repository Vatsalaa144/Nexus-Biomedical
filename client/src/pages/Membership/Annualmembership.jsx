import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitMembershipApplication } from "../../api/membershipApi";
import "./Membership.css";

const TERMS = [
  "Membership is granted at the discretion of the Trust after verification of submitted details.",
  "Membership fees (Life/Annual) are non-transferable and non-refundable, unless decided otherwise by the Trust.",
  "Members are expected to maintain professional and ethical conduct in all activities.",
  "Participation in research, workshops, or programs is subject to availability.",
  "The Trust does not guarantee publication, authorship, or clinical placement.",
  "Any misuse of membership or misconduct may lead to termination without refund.",
  "The Trust reserves the right to modify membership policies at any time.",
];

const PRIVACY = [
  "Personal information (name, email, phone, qualification) collected during registration is used only for academic and administrative purposes.",
  "The Trust does not share personal data with third parties, except when required by law.",
  "Payment-related information is handled securely through authorized banking channels.",
  "Members' data is stored securely and used only for communication and program updates.",
  "By applying for membership, users agree to this privacy policy.",
];

const AnnualMembership = () => {
  const clinicalQualifications = ["MBBS", "MD", "MS"];
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "", dob: "", gender: "", nationality: "",
    email: "", phone: "", whatsapp: "", address: "", city: "", state: "", pin: "",
    qualification: "", designation: "", department: "", institution: "", institutionCity: "",
    registrationNo: "", orcidId: "",
  });
  const [files, setFiles] = useState({ govtId: null, qualificationProof: null, designationProof: null });
  const [errors, setErrors] = useState({});
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const isClinicalQualification = clinicalQualifications.includes(formData.qualification);
  const registrationLabel = isClinicalQualification ? "Medical Registration No." : "University / College Roll No.";
  const registrationPlaceholder = isClinicalQualification ? "Enter medical registration number" : "Enter university/college roll number";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e) => {
    const { name, files: fl } = e.target;
    setFiles((prev) => ({ ...prev, [name]: fl[0] || null }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!formData.fullName.trim()) e.fullName = "Required";
    if (!formData.dob) e.dob = "Required";
    if (!formData.gender) e.gender = "Required";
    if (!formData.nationality.trim()) e.nationality = "Required";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) e.email = "Valid email required";
    if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone)) e.phone = "Valid 10-digit number required";
    if (!formData.whatsapp.trim()) e.whatsapp = "Required";
    if (!formData.address.trim()) e.address = "Required";
    if (!formData.city.trim()) e.city = "Required";
    if (!formData.state.trim()) e.state = "Required";
    if (!formData.pin.trim() || !/^\d{6}$/.test(formData.pin)) e.pin = "Valid 6-digit PIN required";
    if (!formData.qualification) e.qualification = "Required";
    if (!formData.designation.trim()) e.designation = "Required";
    if (!formData.department.trim()) e.department = "Required";
    if (!formData.institution.trim()) e.institution = "Required";
    if (!formData.institutionCity.trim()) e.institutionCity = "Required";
    if (!formData.registrationNo.trim()) {
      e.registrationNo = isClinicalQualification ? "Medical registration number is required" : "Roll number is required";
    }
    if (!files.govtId) e.govtId = "Required";
    if (!files.qualificationProof) e.qualificationProof = "Required";
    if (!files.designationProof) e.designationProof = "Required";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setShowDisclaimer(true);
  };

  const handleFinalSubmit = async () => {
    if (!agreeTerms || !agreePrivacy) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      await submitMembershipApplication("annual", formData, files, agreeTerms, agreePrivacy);
      setShowDisclaimer(false);
      setSubmitted(true);
      setTimeout(() => navigate("/"), 4000);
    } catch (err) {
      setSubmitError(err?.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="mem-page">
        <div className="mem-success-overlay">
          <div className="mem-thankyou mem-thankyou-popup">
            <div className="mem-ty-icon">🎉</div>
            <h2>Thank You for Your Submission!</h2>
            <p>We have received your <strong>Annual Membership</strong> application.</p>
            <p>We will review your details and <strong>connect with you shortly</strong>.</p>
            <p className="mem-ty-redirect">Redirecting you to home page...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mem-page">
      <div className="mem-header annual-header">
        <div className="mem-header-badge">Annual Plan</div>
        <h1>Annual Membership Application</h1>
        <p>Fill in your details below. Our team will reach out regarding payment and next steps.</p>
        <div className="mem-fee-tag">Annual Fee: ₹5,000 &nbsp;|&nbsp; 1 Year Validity</div>
      </div>

      <div className="mem-container">
        {Object.keys(errors).length > 0 && (
          <div className="mem-error-banner">⚠ Please fill in all required fields before submitting.</div>
        )}

        <form className="mem-form" onSubmit={handleSubmit} noValidate>

          {/* 01 Personal */}
          <div className="mem-section">
            <div className="mem-section-head">
              <span className="mem-num">01</span><h3>Personal Information</h3>
            </div>
            <div className="mem-grid">
              <div className={`mem-field full ${errors.fullName ? "err" : ""}`}>
                <label>Full Name <span className="req">*</span></label>
                <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="As per official documents" />
                {errors.fullName && <span className="err-msg">{errors.fullName}</span>}
              </div>
              <div className={`mem-field ${errors.dob ? "err" : ""}`}>
                <label>Date of Birth <span className="req">*</span></label>
                <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
                {errors.dob && <span className="err-msg">{errors.dob}</span>}
              </div>
              <div className={`mem-field ${errors.gender ? "err" : ""}`}>
                <label>Gender <span className="req">*</span></label>
                <select name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="">Select</option>
                  <option>Male</option><option>Female</option><option>Other</option><option>Prefer not to say</option>
                </select>
                {errors.gender && <span className="err-msg">{errors.gender}</span>}
              </div>
              <div className={`mem-field ${errors.nationality ? "err" : ""}`}>
                <label>Nationality <span className="req">*</span></label>
                <input name="nationality" value={formData.nationality} onChange={handleChange} placeholder="e.g. Indian" />
                {errors.nationality && <span className="err-msg">{errors.nationality}</span>}
              </div>
            </div>
          </div>

          {/* 02 Contact */}
          <div className="mem-section">
            <div className="mem-section-head">
              <span className="mem-num">02</span><h3>Contact Details</h3>
            </div>
            <div className="mem-grid">
              <div className={`mem-field ${errors.email ? "err" : ""}`}>
                <label>Email Address <span className="req">*</span></label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" />
                {errors.email && <span className="err-msg">{errors.email}</span>}
              </div>
              <div className={`mem-field ${errors.phone ? "err" : ""}`}>
                <label>Phone Number <span className="req">*</span></label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="10-digit number" maxLength={10} />
                {errors.phone && <span className="err-msg">{errors.phone}</span>}
              </div>
              <div className={`mem-field ${errors.whatsapp ? "err" : ""}`}>
                <label>WhatsApp Number <span className="req">*</span></label>
                <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleChange} placeholder="WhatsApp number" maxLength={10} />
                {errors.whatsapp && <span className="err-msg">{errors.whatsapp}</span>}
              </div>
              <div className={`mem-field full ${errors.address ? "err" : ""}`}>
                <label>Address <span className="req">*</span></label>
                <input name="address" value={formData.address} onChange={handleChange} placeholder="Street / Area / Locality" />
                {errors.address && <span className="err-msg">{errors.address}</span>}
              </div>
              <div className={`mem-field ${errors.city ? "err" : ""}`}>
                <label>City <span className="req">*</span></label>
                <input name="city" value={formData.city} onChange={handleChange} placeholder="City" />
                {errors.city && <span className="err-msg">{errors.city}</span>}
              </div>
              <div className={`mem-field ${errors.state ? "err" : ""}`}>
                <label>State <span className="req">*</span></label>
                <input name="state" value={formData.state} onChange={handleChange} placeholder="State" />
                {errors.state && <span className="err-msg">{errors.state}</span>}
              </div>
              <div className={`mem-field ${errors.pin ? "err" : ""}`}>
                <label>PIN Code <span className="req">*</span></label>
                <input name="pin" value={formData.pin} onChange={handleChange} placeholder="6-digit PIN" maxLength={6} />
                {errors.pin && <span className="err-msg">{errors.pin}</span>}
              </div>
            </div>
          </div>

          {/* 03 Professional */}
          <div className="mem-section">
            <div className="mem-section-head">
              <span className="mem-num">03</span><h3>Professional Details</h3>
            </div>
            <div className="mem-grid">
              <div className={`mem-field ${errors.qualification ? "err" : ""}`}>
                <label>Highest Qualification <span className="req">*</span></label>
                <select name="qualification" value={formData.qualification} onChange={handleChange}>
                  <option value="">Select</option>
                  <option>MBBS</option><option>MD</option><option>MS</option><option>PhD</option>
                  <option>BPharm</option><option>MPharm</option><option>BSc</option><option>MSc</option><option>Other</option>
                </select>
                {errors.qualification && <span className="err-msg">{errors.qualification}</span>}
              </div>
              <div className={`mem-field ${errors.designation ? "err" : ""}`}>
                <label>Designation <span className="req">*</span></label>
                <input name="designation" value={formData.designation} onChange={handleChange} placeholder="e.g. Professor, Doctor, Researcher" />
                {errors.designation && <span className="err-msg">{errors.designation}</span>}
              </div>
              <div className={`mem-field ${errors.department ? "err" : ""}`}>
                <label>Department / Specialization <span className="req">*</span></label>
                <input name="department" value={formData.department} onChange={handleChange} placeholder="e.g. Pharmacology, Oncology" />
                {errors.department && <span className="err-msg">{errors.department}</span>}
              </div>
              <div className={`mem-field ${errors.institution ? "err" : ""}`}>
                <label>Institution / Hospital / University <span className="req">*</span></label>
                <input name="institution" value={formData.institution} onChange={handleChange} placeholder="Full name of institution" />
                {errors.institution && <span className="err-msg">{errors.institution}</span>}
              </div>
              <div className={`mem-field ${errors.institutionCity ? "err" : ""}`}>
                <label>City of Practice <span className="req">*</span></label>
                <input name="institutionCity" value={formData.institutionCity} onChange={handleChange} placeholder="City where you work" />
                {errors.institutionCity && <span className="err-msg">{errors.institutionCity}</span>}
              </div>
              <div className={`mem-field ${errors.registrationNo ? "err" : ""}`}>
                <label>{registrationLabel} <span className="req">*</span></label>
                <input name="registrationNo" value={formData.registrationNo} onChange={handleChange} placeholder={registrationPlaceholder} />
                {errors.registrationNo && <span className="err-msg">{errors.registrationNo}</span>}
              </div>
              <div className="mem-field">
                <label>ORCID ID <span className="opt">(Optional)</span></label>
                <input name="orcidId" value={formData.orcidId} onChange={handleChange} placeholder="0000-0000-0000-0000" />
              </div>
            </div>
          </div>

          {/* 04 Documents */}
          <div className="mem-section">
            <div className="mem-section-head">
              <span className="mem-num">04</span><h3>Document Uploads</h3>
            </div>
            <p className="mem-section-note">Upload clear scans or photos. Accepted: PDF, JPG, PNG (max 5MB each).</p>
            <div className="mem-upload-grid">
              {[
                { key: "govtId", icon: "📄", label: "Government ID Proof", hint: "Aadhaar / PAN / Driving Licence" },
                { key: "qualificationProof", icon: "🎓", label: "Qualification Proof", hint: "Degree Certificate / Marksheet" },
                { key: "designationProof", icon: "🏥", label: "Designation Proof", hint: "Appointment Letter / Institution ID / Employment Certificate" },
              ].map(({ key, icon, label, hint }) => (
                <div className={`mem-upload-item ${errors[key] ? "err" : ""}`} key={key}>
                  <label className="mem-upload-label">{label} <span className="req">*</span></label>
                  <p className="mem-upload-hint">{hint}</p>
                  <label className={`mem-upload-box ${files[key] ? "selected" : ""}`}>
                    <input type="file" name={key} accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} hidden />
                    <span className="mem-up-icon">{icon}</span>
                    <span className="mem-up-text">{files[key] ? files[key].name : "Click to upload"}</span>
                    <span className="mem-up-sub">PDF, JPG, PNG — max 5MB</span>
                  </label>
                  {errors[key] && <span className="err-msg">{errors[key]}</span>}
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="mem-submit annual-submit">
            Submit Application →
          </button>
        </form>
      </div>

      {/* Disclaimer Modal */}
      {showDisclaimer && (
        <div className="mem-modal-overlay">
          <div className="mem-modal">
            <h2 className="mem-modal-title">Before You Submit</h2>
            <p className="mem-modal-sub">Please read and agree to the following before your application is submitted.</p>
            <div className="mem-modal-block">
              <h4>📋 Terms & Conditions – Membership</h4>
              <ul>{TERMS.map((t, i) => <li key={i}>{t}</li>)}</ul>
              <label className="mem-check-label">
                <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} />
                <span>I have read and agree to the <strong>Terms & Conditions</strong></span>
              </label>
            </div>
            <div className="mem-modal-block">
              <h4>🔒 Privacy Policy</h4>
              <ul>{PRIVACY.map((p, i) => <li key={i}>{p}</li>)}</ul>
              <label className="mem-check-label">
                <input type="checkbox" checked={agreePrivacy} onChange={(e) => setAgreePrivacy(e.target.checked)} />
                <span>I have read and agree to the <strong>Privacy Policy</strong></span>
              </label>
            </div>
            <div className="mem-modal-actions">
              {submitError && (
                <p style={{ color: "red", fontSize: "13px", marginBottom: "10px", textAlign: "center" }}>
                  ⚠ {submitError}
                </p>
              )}
              <button className="mem-modal-back" onClick={() => setShowDisclaimer(false)} disabled={submitting}>
                ← Go Back
              </button>
              <button
                className={`mem-modal-confirm annual-confirm ${(!agreeTerms || !agreePrivacy || submitting) ? "disabled" : ""}`}
                onClick={handleFinalSubmit}
                disabled={!agreeTerms || !agreePrivacy || submitting}
              >
                {submitting ? "Submitting..." : "Confirm & Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnualMembership;