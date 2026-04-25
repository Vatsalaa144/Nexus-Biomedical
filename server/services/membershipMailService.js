const nodemailer = require("nodemailer");
const { generateToken } = require("../utils/adminToken");

const getServerUrl = () =>
  (process.env.SERVER_URL || "http://localhost:5000").replace(/\/+$/, "");

// ── Transporter ───────────────────────────────────────────────────────────────
const createTransporter = () =>
  nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
    tls: { rejectUnauthorized: false },
  });

// ── Shared helpers ────────────────────────────────────────────────────────────
const HEADER_GRADIENT =
  "background:linear-gradient(135deg,#1a365d 0%,#2d3748 100%)";
const planLabel = (t) =>
  t === "lifetime" ? "Lifetime Membership" : "Annual Membership";
const planFee = (t) =>
  t === "lifetime" ? "₹10,000 (One-Time)" : "₹5,000 / Year";
const planColor = (t) => (t === "lifetime" ? "#7c3aed" : "#2c5f8d");

const tableRow = (label, value, shaded = false) => `
  <tr style="${shaded ? "background:#f8f9fa;" : ""}">
    <td style="padding:10px 12px;font-weight:700;color:#1a365d;width:160px;border-bottom:1px solid #f0f0f0;">${label}</td>
    <td style="padding:10px 12px;color:#333;border-bottom:1px solid #f0f0f0;">${value || "—"}</td>
  </tr>`;

const emailWrapper = (headerTitle, headerSub, bodyHtml) => `
  <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:620px;margin:0 auto;
              border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;">
    <div style="${HEADER_GRADIENT};padding:24px;text-align:center;">
      <h2 style="color:#fff;margin:0;font-size:1.3rem;">${headerTitle}</h2>
      <p style="color:#a0c4e0;margin:6px 0 0;font-size:0.9rem;">${headerSub}</p>
    </div>
    <div style="padding:28px;">${bodyHtml}</div>
    <div style="background:#f8f9fa;padding:14px;text-align:center;border-top:1px solid #e0e0e0;">
      <p style="color:#888;font-size:0.8rem;margin:0;">
        Nexus Biomedical Research Foundation Trust &nbsp;|&nbsp;
        <a href="mailto:nexusbiomedicalresearch@gmail.com" style="color:#2c5f8d;text-decoration:none;">
          nexusbiomedicalresearch@gmail.com
        </a>
      </p>
    </div>
  </div>`;

// ─────────────────────────────────────────────────────────────────────────────
// EMAIL 1 — Admin: new application alert with Approve / Reject buttons
// ─────────────────────────────────────────────────────────────────────────────
const sendAdminApplicationAlert = async (transporter, member) => {
  const SERVER_URL = getServerUrl();
  const token = generateToken(member._id);

  const govtIdUrl = `${SERVER_URL}/uploads/membership/${member.documents.govtId}?id=${member._id}&token=${token}`;
  const qualificationUrl = `${SERVER_URL}/uploads/membership/${member.documents.qualificationProof}?id=${member._id}&token=${token}`;
  const designationUrl = `${SERVER_URL}/uploads/membership/${member.documents.designationProof}?id=${member._id}&token=${token}`;
  const approveUrl = `${SERVER_URL}/api/membership/approve/${member._id}?token=${token}`;
  const rejectUrl = `${SERVER_URL}/api/membership/reject/${member._id}?token=${token}`;

  const body = `
    <p style="color:#333;margin:0 0 16px;">
      A new <strong>${planLabel(member.membershipType)}</strong> application has been submitted.
    </p>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      ${tableRow("Name", member.fullName)}
      ${tableRow("Email", `<a href="mailto:${member.email}" style="color:#2c5f8d;">${member.email}</a>`, true)}
      ${tableRow("Phone", member.phone)}
      ${tableRow("WhatsApp", member.whatsapp, true)}
      ${tableRow("Plan", `${planLabel(member.membershipType)} — ${planFee(member.membershipType)}`)}
      ${tableRow("Qualification", member.qualification, true)}
      ${tableRow("Designation", member.designation)}
      ${tableRow("Department", member.department, true)}
      ${tableRow("Institution", member.institution)}
      ${tableRow("City of Practice", member.institutionCity, true)}
      ${tableRow("Reg. / Roll No.", member.registrationNo)}
      ${tableRow("ORCID ID", member.orcidId || "Not provided", true)}
      ${tableRow("Address", `${member.address}, ${member.city}, ${member.state} – ${member.pin}`)}
      ${tableRow("Govt ID", `<a href="${govtIdUrl}" target="_blank">View Document</a>`, true)}
${tableRow("Qualification Proof", `<a href="${qualificationUrl}" target="_blank">View Document</a>`)}
${tableRow("Designation Proof", `<a href="${designationUrl}" target="_blank">View Document</a>`, true)}
    </table>
    <div style="margin-top:28px;text-align:center;">
      <p style="color:#374151;font-size:14px;margin-bottom:16px;">
        Review the application and documents, then take action:
      </p>
      <a href="${approveUrl}"
         style="display:inline-block;background:#16a34a;color:#fff;text-decoration:none;
                padding:14px 32px;border-radius:6px;font-size:15px;font-weight:700;margin-right:12px;">
        ✅ Approve Application
      </a>
      <a href="${rejectUrl}"
         style="display:inline-block;background:#dc2626;color:#fff;text-decoration:none;
                padding:14px 32px;border-radius:6px;font-size:15px;font-weight:700;">
        ❌ Reject Application
      </a>
    </div>
    <p style="margin-top:16px;text-align:center;font-size:12px;color:#9ca3af;">
      Clicking a button instantly updates the status and notifies the applicant.
    </p>`;

  return transporter.sendMail({
    from: `"Nexus Biomedical Website" <${process.env.GMAIL_USER}>`,
    to: process.env.RECIPIENT_EMAIL,
    replyTo: member.email,
    subject: `[New Application] ${member.fullName} — ${planLabel(member.membershipType)}`,
    html: emailWrapper(
      "New Membership Application 🔔",
      "Nexus Biomedical Research Foundation Trust",
      body,
    ),
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// EMAIL 2 — Applicant: application received confirmation
// ─────────────────────────────────────────────────────────────────────────────
const sendApplicantConfirmation = async (transporter, member) => {
  const body = `
    <p style="color:#333;line-height:1.7;margin:0 0 16px;">Dear <strong>${member.fullName}</strong>,</p>
    <p style="color:#333;line-height:1.7;margin:0 0 16px;">
      Thank you for applying for the <strong>${planLabel(member.membershipType)}</strong> of the
      Nexus Biomedical Research Foundation Trust. We have successfully received your application.
    </p>
    <div style="background:#f0f7ff;border-left:4px solid ${planColor(member.membershipType)};
                padding:14px 18px;border-radius:4px;margin-bottom:20px;">
      <p style="margin:0 0 8px;font-weight:700;color:#1a365d;">What happens next?</p>
      <ol style="margin:0;padding-left:18px;color:#555;line-height:1.9;">
        <li>Our team will review your application and submitted documents.</li>
        <li>Upon approval, you will receive a <strong>payment instruction email</strong>.</li>
        <li>After payment, your membership will be activated and you will receive your <strong>Membership ID</strong>.</li>
      </ol>
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      ${tableRow("Plan Applied", `${planLabel(member.membershipType)} — ${planFee(member.membershipType)}`)}
      ${tableRow("Name", member.fullName, true)}
      ${tableRow("Email", member.email)}
      ${tableRow("Institution", member.institution, true)}
    </table>
    <p style="color:#333;margin-top:20px;">
      Warm regards,<br/><strong>Nexus Biomedical Research Foundation Trust</strong>
    </p>`;

  return transporter.sendMail({
    from: `"Nexus Biomedical Research Foundation Trust" <${process.env.GMAIL_USER}>`,
    to: member.email,
    subject: `Application Received — ${planLabel(member.membershipType)}`,
    html: emailWrapper(
      "Application Received ✅",
      "Nexus Biomedical Research Foundation Trust",
      body,
    ),
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// EMAIL 3 — Applicant: approved + payment instructions with "Payment Done" button
// ─────────────────────────────────────────────────────────────────────────────
const sendPaymentInstructionEmail = async (transporter, member) => {
  const SERVER_URL = getServerUrl();
  const paymentDoneUrl = `${SERVER_URL}/api/membership/payment-done/${member._id}`;

  const body = `
    <p style="color:#333;line-height:1.7;margin:0 0 16px;">Dear <strong>${member.fullName}</strong>,</p>
    <p style="color:#333;line-height:1.7;margin:0 0 16px;">
      Your <strong>${planLabel(member.membershipType)}</strong> application has been
      <strong style="color:#16a34a;">approved</strong>! 🎉
      Please complete your payment using the details below.
    </p>
    <div style="background:#f0f7ff;border:1px solid #bfdbfe;border-radius:8px;padding:20px 24px;margin-bottom:20px;">
      <p style="margin:0 0 12px;font-weight:700;color:#1a365d;font-size:15px;">💳 Payment Details</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        ${tableRow("Amount Due", `<strong style="font-size:16px;color:${planColor(member.membershipType)};">${planFee(member.membershipType)}</strong>`)}
        ${tableRow("Plan", planLabel(member.membershipType), true)}
        ${tableRow("Account Name", process.env.BANK_ACCOUNT_NAME || "Nexus Biomedical Research Foundation Trust")}
        ${tableRow("Account No.", process.env.BANK_ACCOUNT_NO || "Please contact us", true)}
        ${tableRow("IFSC Code", process.env.BANK_IFSC || "Please contact us")}
        ${tableRow("UPI ID", process.env.UPI_ID || "Please contact us", true)}
      </table>
    </div>
    <div style="background:#fefce8;border-left:4px solid #eab308;padding:14px 18px;border-radius:4px;margin-bottom:24px;">
      <p style="margin:0;color:#713f12;font-size:13px;line-height:1.6;">
        After making the payment, click the button below to notify us.
        Keep your <strong>transaction ID / UTR number</strong> handy — our team will verify and activate your membership within 1–2 business days.
      </p>
    </div>

    <!-- Payment Done Button -->
    <div style="text-align:center;margin-bottom:20px;">
      <a href="${paymentDoneUrl}"
         style="display:inline-block;background:#2c5f8d;color:#fff;text-decoration:none;
                padding:16px 40px;border-radius:8px;font-size:16px;font-weight:700;
                letter-spacing:0.3px;">
        ✅ I Have Made the Payment
      </a>
      <p style="margin-top:10px;font-size:12px;color:#9ca3af;">
        Click this button only after completing your payment.
      </p>
    </div>

    <p style="color:#333;margin-top:20px;">
      Warm regards,<br/><strong>Nexus Biomedical Research Foundation Trust</strong>
    </p>`;

  return transporter.sendMail({
    from: `"Nexus Biomedical Research Foundation Trust" <${process.env.GMAIL_USER}>`,
    to: member.email,
    replyTo: process.env.RECIPIENT_EMAIL,
    subject: `Application Approved — Complete Your ${planLabel(member.membershipType)} Payment`,
    html: emailWrapper(
      "Application Approved 🎉",
      "Complete your payment to activate membership",
      body,
    ),
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// EMAIL 4 — Admin: payment initiated alert with "Confirm Payment" link
// ─────────────────────────────────────────────────────────────────────────────
const sendAdminPaymentInitiatedAlert = async (transporter, member) => {
  const SERVER_URL = getServerUrl();
  const token = generateToken(member._id);
  const confirmUrl = `${SERVER_URL}/api/membership/confirm-payment/${member._id}?token=${token}`;

  const body = `
    <p style="color:#333;margin:0 0 16px;">
      <strong>${member.fullName}</strong> has indicated that they have completed their
      <strong>${planLabel(member.membershipType)}</strong> payment of
      <strong>${planFee(member.membershipType)}</strong>.
    </p>
    <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:24px;">
      ${tableRow("Name", member.fullName)}
      ${tableRow("Email", member.email, true)}
      ${tableRow("Phone", member.phone)}
      ${tableRow("WhatsApp", member.whatsapp, true)}
      ${tableRow("Plan", `${planLabel(member.membershipType)} — ${planFee(member.membershipType)}`)}
    </table>
    <div style="background:#fefce8;border-left:4px solid #eab308;padding:14px 18px;border-radius:4px;margin-bottom:24px;">
      <p style="margin:0;color:#713f12;font-size:13px;line-height:1.6;">
        Please verify the payment in your bank account / UPI app before confirming.
        Once confirmed, you will be asked to enter a <strong>Membership ID</strong>
        which will be sent to the member automatically.
      </p>
    </div>
    <div style="text-align:center;">
      <a href="${confirmUrl}"
         style="display:inline-block;background:#16a34a;color:#fff;text-decoration:none;
                padding:14px 36px;border-radius:6px;font-size:15px;font-weight:700;">
        ✅ Verify & Confirm Payment
      </a>
    </div>
    <p style="margin-top:16px;text-align:center;font-size:12px;color:#9ca3af;">
      Clicking this will open a page where you can enter the Membership ID for this member.
    </p>`;

  return transporter.sendMail({
    from: `"Nexus Biomedical Website" <${process.env.GMAIL_USER}>`,
    to: process.env.RECIPIENT_EMAIL,
    replyTo: member.email,
    subject: `[Payment Initiated] ${member.fullName} — ${planLabel(member.membershipType)}`,
    html: emailWrapper(
      "Payment Initiated 💰",
      "Please verify and confirm the payment",
      body,
    ),
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// EMAIL 5 — Applicant: payment confirmed + Membership ID
// ─────────────────────────────────────────────────────────────────────────────
const sendPaymentConfirmedEmail = async (transporter, member) => {
  const validityLine =
    member.membershipType === "annual"
      ? `Your membership is valid for <strong>1 year</strong> from the date of activation.`
      : `Your membership is valid for <strong>lifetime</strong>.`;

  const body = `
    <p style="color:#333;line-height:1.7;margin:0 0 16px;">Dear <strong>${member.fullName}</strong>,</p>
    <p style="color:#333;line-height:1.7;margin:0 0 16px;">
      We are delighted to confirm that your payment has been received and your
      <strong>${planLabel(member.membershipType)}</strong> is now <strong style="color:#16a34a;">active</strong>! 🎉
    </p>

    <!-- Membership ID highlight box -->
    <div style="background:linear-gradient(135deg,#1a365d,#2d3748);border-radius:10px;
                padding:24px;text-align:center;margin-bottom:24px;">
      <p style="color:#a0c4e0;margin:0 0 8px;font-size:13px;letter-spacing:1px;text-transform:uppercase;">
        Your Membership ID
      </p>
      <p style="color:#fff;font-size:28px;font-weight:700;margin:0;letter-spacing:3px;">
        ${member.membershipId}
      </p>
      <p style="color:#a0c4e0;margin:8px 0 0;font-size:12px;">
        Please save this ID — you will need it for future reference.
      </p>
    </div>

    <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:20px;">
      ${tableRow("Member Name", member.fullName)}
      ${tableRow("Membership", planLabel(member.membershipType), true)}
      ${tableRow("Membership ID", `<strong>${member.membershipId}</strong>`)}
      ${tableRow("Activated On", new Date(member.paidAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }), true)}
    </table>

    <p style="color:#333;line-height:1.7;margin:0 0 12px;">${validityLine}</p>

    <div style="background:#f0fdf4;border-left:4px solid #16a34a;padding:14px 18px;border-radius:4px;margin-bottom:20px;">
      <p style="margin:0;color:#14532d;font-size:13px;line-height:1.6;">
        As a member you now have access to all programs, research collaborations, workshops,
        and updates from the Nexus Biomedical Research Foundation Trust.
        We look forward to your valuable contributions.
      </p>
    </div>

    <p style="color:#333;margin-top:20px;">
      Warm regards,<br/><strong>Nexus Biomedical Research Foundation Trust</strong>
    </p>`;

  return transporter.sendMail({
    from: `"Nexus Biomedical Research Foundation Trust" <${process.env.GMAIL_USER}>`,
    to: member.email,
    replyTo: process.env.RECIPIENT_EMAIL,
    subject: `Welcome to Nexus Biomedical! Your Membership ID: ${member.membershipId}`,
    html: emailWrapper(
      "Membership Activated 🎉",
      "Welcome to Nexus Biomedical Research Foundation Trust",
      body,
    ),
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// EMAIL 6 — Applicant: rejection notification
// ─────────────────────────────────────────────────────────────────────────────
const sendRejectionEmailTemplate = async (transporter, member) => {
  const body = `
    <p style="color:#333;line-height:1.7;margin:0 0 16px;">Dear <strong>${member.fullName}</strong>,</p>
    <p style="color:#333;line-height:1.7;margin:0 0 16px;">
      Thank you for your interest in the <strong>${planLabel(member.membershipType)}</strong>
      of the Nexus Biomedical Research Foundation Trust.
    </p>
    <p style="color:#333;line-height:1.7;margin:0 0 16px;">
      After careful review, we regret to inform you that we are unable to approve your
      membership application at this time.
    </p>
    <div style="background:#fef2f2;border-left:4px solid #dc2626;padding:14px 18px;border-radius:4px;margin-bottom:20px;">
      <p style="margin:0;color:#7f1d1d;font-size:13px;line-height:1.6;">
        If you believe this was an error or would like to understand the reason, contact us at
        <a href="mailto:nexusbiomedicalresearch@gmail.com" style="color:#dc2626;">
          nexusbiomedicalresearch@gmail.com
        </a>.
        You are welcome to reapply in the future with updated documentation.
      </p>
    </div>
    <p style="color:#333;margin-top:20px;">
      Warm regards,<br/><strong>Nexus Biomedical Research Foundation Trust</strong>
    </p>`;

  return transporter.sendMail({
    from: `"Nexus Biomedical Research Foundation Trust" <${process.env.GMAIL_USER}>`,
    to: member.email,
    replyTo: process.env.RECIPIENT_EMAIL,
    subject: `Membership Application Update — Nexus Biomedical`,
    html: emailWrapper(
      "Membership Application Update",
      "Nexus Biomedical Research Foundation Trust",
      body,
    ),
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// EMAIL 7 — Annual renewal reminder
// ─────────────────────────────────────────────────────────────────────────────
const sendRenewalReminderEmail = async (transporter, member) => {
  const membershipStartDate = member.paidAt || member.approvedAt;
  const joinedDate = new Date(membershipStartDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const expiryDate = new Date(
    new Date(membershipStartDate).setFullYear(
      new Date(membershipStartDate).getFullYear() + 1,
    ),
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const body = `
    <p style="color:#333;line-height:1.7;margin:0 0 16px;">Dear <strong>${member.fullName}</strong>,</p>
    <p style="color:#333;line-height:1.7;margin:0 0 16px;">
      Your <strong>Annual Membership</strong> (ID: <strong>${member.membershipId || "N/A"}</strong>)
      with Nexus Biomedical Research Foundation Trust is due for renewal.
    </p>
    <div style="background:#f0f7ff;border:1px solid #bfdbfe;border-radius:8px;padding:20px 24px;margin-bottom:20px;">
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        ${tableRow("Member Name", member.fullName)}
        ${tableRow("Membership ID", member.membershipId || "N/A", true)}
        ${tableRow("Member Since", joinedDate)}
        ${tableRow("Renewal Due", `<strong style="color:#dc2626;">${expiryDate}</strong>`, true)}
        ${tableRow("Renewal Fee", "<strong>₹5,000</strong>")}
      </table>
    </div>
    <div style="background:#f8f9fa;border:1px solid #e0e0e0;border-radius:8px;padding:16px 20px;margin-bottom:20px;">
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        ${tableRow("Account Name", process.env.BANK_ACCOUNT_NAME || "Nexus Biomedical Research Foundation Trust")}
        ${tableRow("Account No.", process.env.BANK_ACCOUNT_NO || "Please contact us", true)}
        ${tableRow("IFSC Code", process.env.BANK_IFSC || "Please contact us")}
        ${tableRow("UPI ID", process.env.UPI_ID || "Please contact us", true)}
      </table>
    </div>
    <p style="color:#333;margin-top:20px;">
      Warm regards,<br/><strong>Nexus Biomedical Research Foundation Trust</strong>
    </p>`;

  return transporter.sendMail({
    from: `"Nexus Biomedical Research Foundation Trust" <${process.env.GMAIL_USER}>`,
    to: member.email,
    replyTo: process.env.RECIPIENT_EMAIL,
    subject: `Annual Membership Renewal Due — Nexus Biomedical`,
    html: emailWrapper(
      "Time to Renew Your Membership 🔄",
      "Annual Membership — Nexus Biomedical Research Foundation Trust",
      body,
    ),
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// Exported functions
// ─────────────────────────────────────────────────────────────────────────────
const sendMembershipApplicationEmails = async (member) => {
  const t = createTransporter();
  await sendAdminApplicationAlert(t, member);
  try {
    await sendApplicantConfirmation(t, member);
  } catch (e) {
    console.warn("Applicant confirmation failed (non-critical):", e.message);
  }
};

const sendApprovalAndPaymentEmail = async (member) => {
  const t = createTransporter();
  await sendPaymentInstructionEmail(t, member);
};

const sendPaymentInitiatedEmails = async (member) => {
  const t = createTransporter();
  await sendAdminPaymentInitiatedAlert(t, member);
};

const sendPaymentConfirmedEmails = async (member) => {
  const t = createTransporter();
  await sendPaymentConfirmedEmail(t, member);
};

const sendRejectionEmail = async (member) => {
  const t = createTransporter();
  await sendRejectionEmailTemplate(t, member);
};

const sendRenewalReminder = async (member) => {
  const t = createTransporter();
  await sendRenewalReminderEmail(t, member);
};

module.exports = {
  sendMembershipApplicationEmails,
  sendApprovalAndPaymentEmail,
  sendPaymentInitiatedEmails,
  sendPaymentConfirmedEmails,
  sendRejectionEmail,
  sendRenewalReminder,
};
