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

const ACCEPTED_FILE_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png", ".docx"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const LifetimeMembership = () => {
  const clinicalQualifications = ["MBBS", "MD", "MS"];
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
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

  const isClinical = clinicalQualifications.includes(formData.qualification);
  const registrationLabel = isClinical ? "Medical Registration No." : "University / College Roll No.";
  const registrationPlaceholder = isClinical ? "Enter medical registration number" : "Enter university/college roll number";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e) => {
    const { name, files: fl } = e.target;
    const file = fl[0] || null;
    if (!file) {
      setFiles((prev) => ({ ...prev, [name]: null }));
      return;
    }

    const ext = `.${file.name.split(".").pop()?.toLowerCase() || ""}`;
    if (!ACCEPTED_FILE_EXTENSIONS.includes(ext)) {
      setFiles((prev) => ({ ...prev, [name]: null }));
      setErrors((prev) => ({ ...prev, [name]: "Accepted formats: PDF, JPG, PNG, DOCX" }));
      e.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setFiles((prev) => ({ ...prev, [name]: null }));
      setErrors((prev) => ({ ...prev, [name]: "File must be under 5MB" }));
      e.target.value = "";
      return;
    }

    setFiles((prev) => ({ ...prev, [name]: file }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateStep = (s) => {
    const e = {};
    if (s === 0) {
      if (!formData.fullName.trim()) e.fullName = "Required";
      if (!formData.dob) e.dob = "Required";
      if (!formData.gender) e.gender = "Required";
      if (!formData.nationality.trim()) e.nationality = "Required";
    }
    if (s === 1) {
      if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) e.email = "Valid email required";
      if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone)) e.phone = "Valid 10-digit number required";
      if (!formData.whatsapp.trim() || !/^\d{10}$/.test(formData.whatsapp)) e.whatsapp = "Valid 10-digit number required";
      if (!formData.address.trim()) e.address = "Required";
      if (!formData.city.trim()) e.city = "Required";
      if (!formData.state.trim()) e.state = "Required";
      if (!formData.pin.trim() || !/^\d{6}$/.test(formData.pin)) e.pin = "Valid 6-digit PIN required";
    }
    if (s === 2) {
      if (!formData.qualification) e.qualification = "Required";
      if (!formData.designation.trim()) e.designation = "Required";
      if (!formData.department.trim()) e.department = "Required";
      if (!formData.institution.trim()) e.institution = "Required";
      if (!formData.institutionCity.trim()) e.institutionCity = "Required";
      if (!formData.registrationNo.trim()) e.registrationNo = isClinical ? "Medical registration number is required" : "Roll number is required";
    }
    if (s === 3) {
      if (!files.govtId) e.govtId = "Required";
      if (!files.qualificationProof) e.qualificationProof = "Required";
      if (!files.designationProof) e.designationProof = "Required";
    }
    return e;
  };

  const handleNext = () => {
    const errs = validateStep(step);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setErrors({});
    setStep((s) => s - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validateStep(3);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setShowDisclaimer(true);
  };

  const handleFinalSubmit = async () => {
    if (!agreeTerms || !agreePrivacy) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      await submitMembershipApplication("lifetime", formData, files, agreeTerms, agreePrivacy);
      setShowDisclaimer(false);
      setSubmitted(true);
      setTimeout(() => navigate("/"), 4000);
    } catch (err) {
      setSubmitError(err?.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const cs = (i) => (i === step ? "active" : i < step ? "done" : "upcoming");

  if (submitted) {
    return (
      <div className="mem-page lifetime-flow">
        <div className="mem-success-overlay">
          <div className="mem-thankyou lifetime-thankyou">
            <div className="mem-ty-icon">🎉</div>
            <h2>Thank You for Your Submission!</h2>
            <p>We have received your <strong>Lifetime Membership</strong> application.</p>
            <p>We will review your details and <strong>connect with you shortly</strong>.</p>
            <p className="mem-ty-redirect">Redirecting you to home page...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mem-page lifetime-flow">
      {submitting && !showDisclaimer && (
        <div className="mem-loader-overlay">
          <div className="mem-spinner" />
          <div className="mem-loader-text">Submitting your application...</div>
        </div>
      )}

      <div className="mem-hero-banner">
        <div className="mem-hero-content">
          <h1 className="mem-hero-title">Lifetime Membership Application</h1>
          <p className="mem-hero-sub">Fill in your details below.</p>
         
        </div>
      </div>

      <div className="mem-container">
        <div className="mem-progress-track">
          {["Personal", "Contact", "Professional", "Documents"].map((label, i) => (
            <React.Fragment key={i}>
              <div className={`mem-progress-step${step === i ? " active" : step > i ? " done" : ""}`}>
                <div className={`mem-progress-dot${step === i ? " active" : step > i ? " done" : ""}`}>
                  {step > i ? "✓" : i + 1}
                </div>
                <span className="mem-progress-label">{label}</span>
              </div>
              {i < 3 && <div className={`mem-progress-line${step > i ? " done" : ""}`} />}
            </React.Fragment>
          ))}
        </div>

        {Object.keys(errors).length > 0 && (
          <div className="mem-error-banner">⚠ Please fill in all required fields before continuing.</div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mem-grid-layout">

            <div className={`mem-step-card mem-cs-${cs(0)}`}>
              <div className="mem-card-header">
                <div className="mem-card-badge">{step > 0 ? "✓" : "1"}</div>
                <div className="mem-card-title-group">
                 
                  <span className="mem-card-title">Personal</span>
                  <span className="mem-card-desc">Basic personal details</span>
                </div>
                {cs(0) === "done" && (
                  <button type="button" className="mem-edit-btn lifetime-edit" onClick={() => { setStep(0); setErrors({}); }}>✎ Edit</button>
                )}
              </div>
              <div className="mem-card-body">
                <div className="mem-grid">
                  <div className={`mem-field full${errors.fullName && step === 0 ? " err" : ""}`}>
                    <label>Full Name <span className="req">*</span></label>
                    <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="As per official documents" disabled={step !== 0} />
                    {errors.fullName && step === 0 && <span className="err-msg">{errors.fullName}</span>}
                  </div>
                  <div className={`mem-field${errors.dob && step === 0 ? " err" : ""}`}>
                    <label>Date of Birth <span className="req">*</span></label>
                    <input type="date" name="dob" value={formData.dob} onChange={handleChange} disabled={step !== 0} />
                    {errors.dob && step === 0 && <span className="err-msg">{errors.dob}</span>}
                  </div>
                  <div className={`mem-field${errors.gender && step === 0 ? " err" : ""}`}>
                    <label>Gender <span className="req">*</span></label>
                    <select name="gender" value={formData.gender} onChange={handleChange} disabled={step !== 0}>
                      <option value="">Select</option>
                      <option>Male</option><option>Female</option><option>Other</option><option>Prefer not to say</option>
                    </select>
                    {errors.gender && step === 0 && <span className="err-msg">{errors.gender}</span>}
                  </div>
                  <div className={`mem-field${errors.nationality && step === 0 ? " err" : ""}`}>
                    <label>Nationality <span className="req">*</span></label>
                    <input name="nationality" value={formData.nationality} onChange={handleChange} placeholder="e.g. Indian" disabled={step !== 0} />
                    {errors.nationality && step === 0 && <span className="err-msg">{errors.nationality}</span>}
                  </div>
                </div>
                {step === 0 && (
                  <div className="mem-card-nav">
                    <button type="button" className="mem-btn-confirm lifetime-confirm-btn" onClick={handleNext}>
                      <span className="mem-btn-confirm-icon">✓</span><span>Confirm &amp; Continue</span>
                    </button>
                  </div>
                )}
              </div>
              {cs(0) !== "active" && (
                <div className={`mem-blur-overlay ${cs(0) === "done" ? "mem-blur-done" : "mem-blur-upcoming"}`} />
              )}
            </div>

            <div className={`mem-step-card mem-cs-${cs(1)}`}>
              <div className="mem-card-header">
                <div className="mem-card-badge">{step > 1 ? "✓" : "2"}</div>
                <div className="mem-card-title-group">
                  
                  <span className="mem-card-title">Contact</span>
                  <span className="mem-card-desc">Email, phone &amp; address</span>
                </div>
                {cs(1) === "done" && (
                  <button type="button" className="mem-edit-btn lifetime-edit" onClick={() => { setStep(1); setErrors({}); }}>✎ Edit</button>
                )}
              </div>
              <div className="mem-card-body">
                <div className="mem-grid">
                  <div className={`mem-field${errors.email && step === 1 ? " err" : ""}`}>
                    <label>Email Address <span className="req">*</span></label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" disabled={step !== 1} />
                    {errors.email && step === 1 && <span className="err-msg">{errors.email}</span>}
                  </div>
                  <div className={`mem-field${errors.phone && step === 1 ? " err" : ""}`}>
                    <label>Phone Number <span className="req">*</span></label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="10-digit number" maxLength={10} disabled={step !== 1} />
                    {errors.phone && step === 1 && <span className="err-msg">{errors.phone}</span>}
                  </div>
                  <div className={`mem-field${errors.whatsapp && step === 1 ? " err" : ""}`}>
                    <label>WhatsApp Number <span className="req">*</span></label>
                    <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleChange} placeholder="10-digit number" maxLength={10} disabled={step !== 1} />
                    {errors.whatsapp && step === 1 && <span className="err-msg">{errors.whatsapp}</span>}
                  </div>
                  <div className={`mem-field full${errors.address && step === 1 ? " err" : ""}`}>
                    <label>Address <span className="req">*</span></label>
                    <input name="address" value={formData.address} onChange={handleChange} placeholder="Street / Area / Locality" disabled={step !== 1} />
                    {errors.address && step === 1 && <span className="err-msg">{errors.address}</span>}
                  </div>
                  <div className={`mem-field${errors.city && step === 1 ? " err" : ""}`}>
                    <label>City <span className="req">*</span></label>
                    <input name="city" value={formData.city} onChange={handleChange} placeholder="City" disabled={step !== 1} />
                    {errors.city && step === 1 && <span className="err-msg">{errors.city}</span>}
                  </div>
                  <div className={`mem-field${errors.state && step === 1 ? " err" : ""}`}>
                    <label>State <span className="req">*</span></label>
                    <input name="state" value={formData.state} onChange={handleChange} placeholder="State" disabled={step !== 1} />
                    {errors.state && step === 1 && <span className="err-msg">{errors.state}</span>}
                  </div>
                  <div className={`mem-field${errors.pin && step === 1 ? " err" : ""}`}>
                    <label>PIN Code <span className="req">*</span></label>
                    <input name="pin" value={formData.pin} onChange={handleChange} placeholder="6-digit PIN" maxLength={6} disabled={step !== 1} />
                    {errors.pin && step === 1 && <span className="err-msg">{errors.pin}</span>}
                  </div>
                </div>
                {step === 1 && (
                  <div className="mem-card-nav">
                    <button type="button" className="mem-btn-back" onClick={handleBack}>← Back</button>
                    <button type="button" className="mem-btn-confirm lifetime-confirm-btn" onClick={handleNext}>
                      <span className="mem-btn-confirm-icon">✓</span><span>Confirm &amp; Continue</span>
                    </button>
                  </div>
                )}
              </div>
              {cs(1) !== "active" && (
                <div className={`mem-blur-overlay ${cs(1) === "done" ? "mem-blur-done" : "mem-blur-upcoming"}`} />
              )}
            </div>

            <div className={`mem-step-card mem-cs-${cs(2)}`}>
              <div className="mem-card-header">
                <div className="mem-card-badge">{step > 2 ? "✓" : "3"}</div>
                <div className="mem-card-title-group">
             
                  <span className="mem-card-title">Professional</span>
                  <span className="mem-card-desc">Qualifications &amp; role</span>
                </div>
                {cs(2) === "done" && (
                  <button type="button" className="mem-edit-btn lifetime-edit" onClick={() => { setStep(2); setErrors({}); }}>✎ Edit</button>
                )}
              </div>
              <div className="mem-card-body">
                <div className="mem-grid">
                  <div className={`mem-field${errors.qualification && step === 2 ? " err" : ""}`}>
                    <label>Highest Qualification <span className="req">*</span></label>
                    <select name="qualification" value={formData.qualification} onChange={handleChange} disabled={step !== 2}>
                      <option value="">Select</option>
                      <option>MBBS</option><option>MD</option><option>MS</option><option>PhD</option>
                      <option>BPharm</option><option>MPharm</option><option>BSc</option><option>MSc</option><option>Other</option>
                    </select>
                    {errors.qualification && step === 2 && <span className="err-msg">{errors.qualification}</span>}
                  </div>
                  <div className={`mem-field${errors.designation && step === 2 ? " err" : ""}`}>
                    <label>Designation <span className="req">*</span></label>
                    <input name="designation" value={formData.designation} onChange={handleChange} placeholder="e.g. Professor, Doctor" disabled={step !== 2} />
                    {errors.designation && step === 2 && <span className="err-msg">{errors.designation}</span>}
                  </div>
                  <div className={`mem-field${errors.department && step === 2 ? " err" : ""}`}>
                    <label>Department / Specialization <span className="req">*</span></label>
                    <input name="department" value={formData.department} onChange={handleChange} placeholder="e.g. Pharmacology" disabled={step !== 2} />
                    {errors.department && step === 2 && <span className="err-msg">{errors.department}</span>}
                  </div>
                  <div className={`mem-field full${errors.institution && step === 2 ? " err" : ""}`}>
                    <label>Institution / Hospital / University <span className="req">*</span></label>
                    <input name="institution" value={formData.institution} onChange={handleChange} placeholder="Full name of institution" disabled={step !== 2} />
                    {errors.institution && step === 2 && <span className="err-msg">{errors.institution}</span>}
                  </div>
                  <div className={`mem-field${errors.institutionCity && step === 2 ? " err" : ""}`}>
                    <label>City of Practice <span className="req">*</span></label>
                    <input name="institutionCity" value={formData.institutionCity} onChange={handleChange} placeholder="City where you work" disabled={step !== 2} />
                    {errors.institutionCity && step === 2 && <span className="err-msg">{errors.institutionCity}</span>}
                  </div>
                  <div className={`mem-field${errors.registrationNo && step === 2 ? " err" : ""}`}>
                    <label>{registrationLabel} <span className="req">*</span></label>
                    <input name="registrationNo" value={formData.registrationNo} onChange={handleChange} placeholder={registrationPlaceholder} disabled={step !== 2} />
                    {errors.registrationNo && step === 2 && <span className="err-msg">{errors.registrationNo}</span>}
                  </div>
                  <div className="mem-field">
                    <label>ORCID ID <span className="opt">(Optional)</span></label>
                    <input name="orcidId" value={formData.orcidId} onChange={handleChange} placeholder="0000-0000-0000-0000" disabled={step !== 2} />
                  </div>
                </div>
                {step === 2 && (
                  <div className="mem-card-nav">
                    <button type="button" className="mem-btn-back" onClick={handleBack}>← Back</button>
                    <button type="button" className="mem-btn-confirm lifetime-confirm-btn" onClick={handleNext}>
                      <span className="mem-btn-confirm-icon">✓</span><span>Confirm &amp; Continue</span>
                    </button>
                  </div>
                )}
              </div>
              {cs(2) !== "active" && (
                <div className={`mem-blur-overlay ${cs(2) === "done" ? "mem-blur-done" : "mem-blur-upcoming"}`} />
              )}
            </div>

            <div className={`mem-step-card mem-cs-${cs(3)}`}>
              <div className="mem-card-header">
                <div className="mem-card-badge">{step > 3 ? "✓" : "4"}</div>
                <div className="mem-card-title-group">
                    
                  <span className="mem-card-title">Documents</span>
                  <span className="mem-card-desc">Upload required files</span>
                </div>
              </div>
              <div className="mem-card-body">
                <p className="mem-section-note">Upload clear scans or photos. Accepted: PDF, JPG, PNG, DOCX (max 5MB each).</p>
                <div className="mem-upload-grid">
                  {[
                    { key: "govtId",            icon: "📄", label: "Government ID Proof",   hint: "Aadhaar / PAN / Driving Licence" },
                    { key: "qualificationProof", icon: "🎓", label: "Qualification Proof",   hint: "Degree Certificate / Marksheet" },
                    { key: "designationProof",   icon: "🏥", label: "Designation Proof",     hint: "Appointment Letter / Institution ID" },
                  ].map(({ key, icon, label, hint }) => (
                    <div className={`mem-upload-item${errors[key] && step === 3 ? " err" : ""}`} key={key}>
                      <label className="mem-upload-label">{label} <span className="req">*</span></label>
                      <p className="mem-upload-hint">{hint}</p>
                      <label className={`mem-upload-box${files[key] ? " selected" : ""}`}>
                        <input type="file" name={key} accept=".pdf,.jpg,.jpeg,.png,.docx" onChange={handleFileChange} hidden disabled={step !== 3} />
                        <span className="mem-up-icon">{icon}</span>
                        <span className="mem-up-text">{files[key] ? files[key].name : "Click to upload"}</span>
                        <span className="mem-up-sub">PDF, JPG, PNG, DOCX — max 5MB</span>
                      </label>
                      {errors[key] && step === 3 && <span className="err-msg">{errors[key]}</span>}
                    </div>
                  ))}
                </div>
                {step === 3 && (
                  <div className="mem-card-nav">
                    <button type="button" className="mem-btn-back" onClick={handleBack}>← Back</button>
                    <button type="submit" className="mem-btn-confirm lifetime-confirm-btn">
                      <span className="mem-btn-confirm-icon">✓</span><span>Review &amp; Submit</span>
                    </button>
                  </div>
                )}
              </div>
              {cs(3) !== "active" && (
                <div className={`mem-blur-overlay ${cs(3) === "done" ? "mem-blur-done" : "mem-blur-upcoming"}`} />
              )}
            </div>

          </div>
        </form>
      </div>

      {showDisclaimer && (
        <div className="mem-modal-overlay">
          <div className={`mem-modal${submitting ? " mem-submit-modal" : ""}`}>
            {submitting ? (
              <div className="mem-submit-state lifetime-submit-state">
                <div className="mem-submit-spinner" />
                <h2 className="mem-modal-title">Submitting Application</h2>
                <p className="mem-modal-sub">Please wait while we securely submit your membership details.</p>
                <p className="mem-submit-note">Do not close or refresh this page.</p>
              </div>
            ) : (
              <>
                <h2 className="mem-modal-title">Before You Submit</h2>
                <p className="mem-modal-sub">Please read and agree to the following before your application is submitted.</p>
                <div className="mem-modal-block">
                  <h4>📋 Terms &amp; Conditions – Membership</h4>
                  <ul>{TERMS.map((t, i) => <li key={i}>{t}</li>)}</ul>
                  <label className="mem-check-label">
                    <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} />
                    <span>I have read and agree to the <strong>Terms &amp; Conditions</strong></span>
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
                  {submitError && <p style={{ color:"red", fontSize:"13px", marginBottom:"10px", textAlign:"center" }}>⚠ {submitError}</p>}
                  <button className="mem-modal-back" onClick={() => setShowDisclaimer(false)}>← Go Back</button>
                  <button
                    className={`mem-modal-confirm lifetime-confirm${(!agreeTerms || !agreePrivacy) ? " disabled" : ""}`}
                    onClick={handleFinalSubmit}
                    disabled={!agreeTerms || !agreePrivacy}
                  >
                    Confirm & Submit
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LifetimeMembership;
