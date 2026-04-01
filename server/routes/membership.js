const express = require("express");
const router  = express.Router();
const multer  = require("multer");
const path    = require("path");
const fs      = require("fs");

const Membership = require("../models/Membership");
const {
  sendMembershipApplicationEmails,
  sendApprovalAndPaymentEmail,
  sendPaymentInitiatedEmails,
  sendPaymentConfirmedEmails,
  sendRejectionEmail,
} = require("../services/membershipMailService");

// ── File upload setup ─────────────────────────────────────────────────────────
const uploadDir = path.join(__dirname, "../uploads/membership");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${unique}${path.extname(file.originalname).toLowerCase()}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowed = [".pdf", ".jpg", ".jpeg", ".png"];
  const ext = path.extname(file.originalname).toLowerCase();
  allowed.includes(ext) ? cb(null, true) : cb(new Error(`File type not allowed: ${ext}`), false);
};

const upload = multer({
  storage, fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).fields([
  { name: "govtId",             maxCount: 1 },
  { name: "qualificationProof", maxCount: 1 },
  { name: "designationProof",   maxCount: 1 },
]);

// ── HTML result page helper ───────────────────────────────────────────────────
const resultPage = (title, message, color) => `
<!DOCTYPE html><html>
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>${title}</title>
  <style>
    body{font-family:'Segoe UI',Arial,sans-serif;display:flex;justify-content:center;
         align-items:center;min-height:100vh;margin:0;background:#f3f4f6;}
    .card{background:#fff;border-radius:12px;padding:40px 48px;text-align:center;
          max-width:500px;width:90%;box-shadow:0 4px 24px rgba(0,0,0,0.08);}
    h1{color:${color};font-size:22px;margin:0 0 12px;}
    p{color:#6b7280;line-height:1.7;margin:0;font-size:15px;}
    .brand{margin-top:28px;font-size:12px;color:#9ca3af;
           border-top:1px solid #f0f0f0;padding-top:16px;}
  </style>
</head>
<body>
  <div class="card">
    <h1>${title}</h1>
    <p>${message}</p>
    <div class="brand">Nexus Biomedical Research Foundation Trust</div>
  </div>
</body></html>`;

// ── Confirm payment page (admin enters Membership ID) ─────────────────────────
const confirmPaymentPage = (memberId, memberName, planLabel) => `
<!DOCTYPE html><html>
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Confirm Payment — Nexus Biomedical</title>
  <style>
    *{box-sizing:border-box;}
    body{font-family:'Segoe UI',Arial,sans-serif;display:flex;justify-content:center;
         align-items:center;min-height:100vh;margin:0;background:#f3f4f6;}
    .card{background:#fff;border-radius:12px;padding:40px 48px;
          max-width:480px;width:90%;box-shadow:0 4px 24px rgba(0,0,0,0.08);}
    h1{color:#1a365d;font-size:20px;margin:0 0 6px;}
    .sub{color:#6b7280;font-size:14px;margin:0 0 24px;}
    .info{background:#f0f7ff;border-radius:8px;padding:14px 18px;margin-bottom:24px;font-size:14px;color:#1a365d;}
    label{display:block;font-weight:700;color:#374151;margin-bottom:6px;font-size:14px;}
    input{width:100%;padding:12px 14px;border:1px solid #d1d5db;border-radius:6px;
          font-size:15px;outline:none;letter-spacing:1px;}
    input:focus{border-color:#2c5f8d;}
    button{width:100%;margin-top:16px;padding:14px;background:#16a34a;color:#fff;
           border:none;border-radius:6px;font-size:15px;font-weight:700;cursor:pointer;}
    button:hover{background:#15803d;}
    .hint{font-size:12px;color:#9ca3af;margin-top:8px;}
    .brand{margin-top:24px;font-size:12px;color:#9ca3af;text-align:center;
           border-top:1px solid #f0f0f0;padding-top:16px;}
  </style>
</head>
<body>
  <div class="card">
    <h1>Confirm Payment & Issue Membership ID</h1>
    <p class="sub">Enter the Membership ID to assign to this member.</p>
    <div class="info">
      <strong>Member:</strong> ${memberName}<br/>
      <strong>Plan:</strong> ${planLabel}
    </div>
    <form method="POST" action="/api/membership/confirm-payment/${memberId}">
      <label for="membershipId">Membership ID</label>
      <input type="text" id="membershipId" name="membershipId"
             placeholder="e.g. NB-2025-00123" required autocomplete="off"/>
      <p class="hint">This ID will be sent to the member in their confirmation email.</p>
      <button type="submit">✅ Confirm Payment & Send Membership ID</button>
    </form>
    <div class="brand">Nexus Biomedical Research Foundation Trust</div>
  </div>
</body></html>`;

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/membership/apply
// ─────────────────────────────────────────────────────────────────────────────
router.post("/apply", (req, res) => {
  upload(req, res, async (uploadErr) => {
    if (uploadErr) {
      if (uploadErr.code === "LIMIT_FILE_SIZE")
        return res.status(400).json({ error: "Files must be under 5MB each." });
      return res.status(400).json({ error: uploadErr.message });
    }

    const body  = req.body;
    const files = req.files || {};

    const missingFiles = [];
    if (!files.govtId?.[0])             missingFiles.push("govtId");
    if (!files.qualificationProof?.[0]) missingFiles.push("qualificationProof");
    if (!files.designationProof?.[0])   missingFiles.push("designationProof");
    if (missingFiles.length)
      return res.status(400).json({ error: "Missing required documents.", missing: missingFiles });

    if (!["annual", "lifetime"].includes(body.membershipType))
      return res.status(400).json({ error: "Invalid membership type." });

    try {
      const existing = await Membership.findOne({
        email: body.email?.toLowerCase().trim(),
        membershipType: body.membershipType,
        status: { $in: ["pending", "approved", "payment_initiated", "payment_confirmed"] },
      });

      if (existing)
        return res.status(409).json({
          error: "An active application with this email already exists for this plan.",
        });

      const member = await Membership.create({
        membershipType: body.membershipType,
        fullName:    body.fullName?.trim(),
        dob:         body.dob,
        gender:      body.gender,
        nationality: body.nationality?.trim(),
        email:    body.email?.trim().toLowerCase(),
        phone:    body.phone?.trim(),
        whatsapp: body.whatsapp?.trim(),
        address:  body.address?.trim(),
        city:     body.city?.trim(),
        state:    body.state?.trim(),
        pin:      body.pin?.trim(),
        qualification:   body.qualification,
        designation:     body.designation?.trim(),
        department:      body.department?.trim(),
        institution:     body.institution?.trim(),
        institutionCity: body.institutionCity?.trim(),
        registrationNo:  body.registrationNo?.trim(),
        orcidId:         body.orcidId?.trim() || "",
        documents: {
          govtId:             files.govtId[0].filename,
          qualificationProof: files.qualificationProof[0].filename,
          designationProof:   files.designationProof[0].filename,
        },
        agreedToTerms:   body.agreedToTerms === "true",
        agreedToPrivacy: body.agreedToPrivacy === "true",
      });

      try { await sendMembershipApplicationEmails(member); }
      catch (e) { console.warn("Membership emails failed:", e.message); }

      return res.status(201).json({
        success: true,
        message: "Application submitted successfully. A confirmation email has been sent.",
        applicationId: member._id,
      });

    } catch (err) {
      console.error("Apply error:", err);
      return res.status(500).json({ error: "Internal server error." });
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/membership/approve/:id  — Admin approves from email link
// ─────────────────────────────────────────────────────────────────────────────
router.get("/approve/:id", async (req, res) => {
  try {
    const member = await Membership.findById(req.params.id);
    if (!member)
      return res.send(resultPage("Not Found", "Application not found.", "#dc2626"));
    if (member.status === "approved" || member.status === "payment_initiated" || member.status === "payment_confirmed")
      return res.send(resultPage("Already Approved", `${member.fullName}'s application was already approved.`, "#16a34a"));
    if (member.status === "rejected")
      return res.send(resultPage("Already Rejected", `${member.fullName}'s application was rejected. Cannot approve.`, "#d97706"));

    member.status     = "approved";
    member.approvedAt = new Date();
    await member.save();

    try { await sendApprovalAndPaymentEmail(member); }
    catch (e) { console.warn("Payment email failed:", e.message); }

    return res.send(resultPage(
      "Application Approved ✅",
      `${member.fullName}'s application has been approved.<br/>
       A payment instruction email has been sent to <strong>${member.email}</strong>.`,"#16a34a"
    ));
  } catch (err) {
    console.error("Approve error:", err);
    return res.send(resultPage("Error", "Something went wrong. Please try again.", "#dc2626"));
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/membership/reject/:id  — Admin rejects from email link
// ─────────────────────────────────────────────────────────────────────────────
router.get("/reject/:id", async (req, res) => {
  try {
    const member = await Membership.findById(req.params.id);
    if (!member)
      return res.send(resultPage("Not Found", "Application not found.", "#dc2626"));
    if (member.status === "rejected")
      return res.send(resultPage("Already Rejected", `${member.fullName}'s application was already rejected.`, "#d97706"));
    if (member.status !== "pending")
      return res.send(resultPage("Cannot Reject", `${member.fullName}'s application is already in progress.`, "#d97706"));

    member.status = "rejected";
    await member.save();

    try { await sendRejectionEmail(member); }
    catch (e) { console.warn("Rejection email failed:", e.message); }

    return res.send(resultPage(
      "Application Rejected",
      `${member.fullName}'s application has been rejected.<br/>
       A notification email has been sent to <strong>${member.email}</strong>.`,
      "#6b7280"
    ));
  } catch (err) {
    console.error("Reject error:", err);
    return res.send(resultPage("Error", "Something went wrong. Please try again.", "#dc2626"));
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/membership/payment-done/:id  — User clicks "I Have Made the Payment"
// ─────────────────────────────────────────────────────────────────────────────
router.get("/payment-done/:id", async (req, res) => {
  try {
    const member = await Membership.findById(req.params.id);
    if (!member)
      return res.send(resultPage("Not Found", "Application not found.", "#dc2626"));
    if (member.status === "payment_confirmed")
      return res.send(resultPage("Already Confirmed", "Your payment has already been confirmed. Check your email for your Membership ID.", "#16a34a"));
    if (member.status === "payment_initiated")
      return res.send(resultPage("Payment Noted ✅", "We have already received your payment notification. Our team will verify and confirm shortly.", "#2c5f8d"));
    if (member.status !== "approved")
      return res.send(resultPage("Not Eligible", "This action is not available for your current application status.", "#d97706"));

    member.status             = "payment_initiated";
    member.paymentInitiatedAt = new Date();
    await member.save();

    try { await sendPaymentInitiatedEmails(member); }
    catch (e) { console.warn("Payment initiated email failed:", e.message); }

    return res.send(resultPage(
      "Payment Notification Sent ✅",
      `Thank you, <strong>${member.fullName}</strong>!<br/><br/>
       We have received your payment notification. Our team will verify your payment
       and send your <strong>Membership ID</strong> to <strong>${member.email}</strong>
       within 1–2 business days.`,
      "#16a34a"
    ));
  } catch (err) {
    console.error("Payment done error:", err);
    return res.send(resultPage("Error", "Something went wrong. Please try again.", "#dc2626"));
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/membership/confirm-payment/:id  — Admin opens confirm payment page
// ─────────────────────────────────────────────────────────────────────────────
router.get("/confirm-payment/:id", async (req, res) => {
  try {
    const member = await Membership.findById(req.params.id);
    if (!member)
      return res.send(resultPage("Not Found", "Application not found.", "#dc2626"));
    if (member.status === "payment_confirmed")
      return res.send(resultPage("Already Confirmed", `${member.fullName}'s payment was already confirmed. Membership ID: <strong>${member.membershipId}</strong>`, "#16a34a"));
    if (member.status !== "payment_initiated")
      return res.send(resultPage("Not Ready", "This member has not initiated payment yet.", "#d97706"));

    const planLabel = member.membershipType === "lifetime" ? "Lifetime Membership" : "Annual Membership";
    return res.send(confirmPaymentPage(member._id, member.fullName, planLabel));
  } catch (err) {
    console.error("Confirm payment GET error:", err);
    return res.send(resultPage("Error", "Something went wrong. Please try again.", "#dc2626"));
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/membership/confirm-payment/:id  — Admin submits Membership ID
// ─────────────────────────────────────────────────────────────────────────────
router.post("/confirm-payment/:id", async (req, res) => {
  try {
    const member     = await Membership.findById(req.params.id);
    const membershipId = req.body.membershipId?.trim();

    if (!member)
      return res.send(resultPage("Not Found", "Application not found.", "#dc2626"));
    if (!membershipId)
      return res.send(resultPage("Missing ID", "Please enter a Membership ID.", "#d97706"));
    if (member.status === "payment_confirmed")
      return res.send(resultPage("Already Confirmed", `Payment already confirmed. Membership ID: <strong>${member.membershipId}</strong>`, "#16a34a"));

    member.status       = "payment_confirmed";
    member.paidAt       = new Date();
    member.membershipId = membershipId;
    await member.save();

    try { await sendPaymentConfirmedEmails(member); }
    catch (e) { console.warn("Payment confirmed email failed:", e.message); }

    return res.send(resultPage(
      "Payment Confirmed ✅",
      `${member.fullName}'s payment has been confirmed.<br/>
       Membership ID <strong>${membershipId}</strong> has been sent to
       <strong>${member.email}</strong>.`,
      "#16a34a"
    ));
  } catch (err) {
    console.error("Confirm payment POST error:", err);
    return res.send(resultPage("Error", "Something went wrong. Please try again.", "#dc2626"));
  }
});

module.exports = router;
