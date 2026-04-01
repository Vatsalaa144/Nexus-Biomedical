const mongoose = require("mongoose");

const membershipSchema = new mongoose.Schema(
  {
    // ── Plan ──────────────────────────────────────────────────────────────────
    membershipType: {
      type: String,
      enum: ["annual", "lifetime"],
      required: true,
    },

    // ── Personal Information ──────────────────────────────────────────────────
    fullName:    { type: String, required: true, trim: true },
    dob:         { type: String, required: true },
    gender:      { type: String, required: true },
    nationality: { type: String, required: true, trim: true },

    // ── Contact Details ───────────────────────────────────────────────────────
    email:    { type: String, required: true, trim: true, lowercase: true },
    phone:    { type: String, required: true },
    whatsapp: { type: String, required: true },
    address:  { type: String, required: true },
    city:     { type: String, required: true },
    state:    { type: String, required: true },
    pin:      { type: String, required: true },

    // ── Professional Details ──────────────────────────────────────────────────
    qualification:   { type: String, required: true },
    designation:     { type: String, required: true },
    department:      { type: String, required: true },
    institution:     { type: String, required: true },
    institutionCity: { type: String, required: true },
    registrationNo:  { type: String, required: true },
    orcidId:         { type: String, default: "" },

    // ── Document file paths ───────────────────────────────────────────────────
    documents: {
      govtId:             { type: String, required: true },
      qualificationProof: { type: String, required: true },
      designationProof:   { type: String, required: true },
    },

    // ── Application lifecycle ─────────────────────────────────────────────────
    status: {
      type: String,
      // payment_initiated = user clicked "Payment Done"
      // payment_confirmed = admin confirmed payment + issued membershipId
      enum: ["pending", "approved", "rejected", "payment_initiated", "payment_confirmed"],
      default: "pending",
    },

    approvedAt:  { type: Date, default: null },

    // Set when user clicks "Payment Done" in email
    paymentInitiatedAt: { type: Date, default: null },

    // Set when admin confirms payment
    paidAt:      { type: Date, default: null },

    // Issued by admin when confirming payment
    membershipId: { type: String, default: null },

    // Tracks annual renewal reminder
    renewalReminderSentAt: { type: Date, default: null },

    // ── Agreements ────────────────────────────────────────────────────────────
    agreedToTerms:   { type: Boolean, required: true },
    agreedToPrivacy: { type: Boolean, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Membership", membershipSchema);
