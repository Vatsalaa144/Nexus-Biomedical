# Nexus Biomedical — Backend Issues & Fixes

> Feed this file to your AI to review and fix the issues listed below.
> All issues are from the `server/` folder. Frontend is unaffected.

---

## Context

The backend handles:
- Contact form emails (`routes/email.js`)
- Membership applications, approvals, payments (`routes/membership.js`)
- Annual renewal reminders via cron (`utils/renewalScheduler.js`)
- Email delivery (`services/membershipMailService.js`)

---

## 🔴 Critical Issues

### Issue 1 — Renewal Scheduler Queries Wrong Status

**File:** `server/utils/renewalScheduler.js`

**Problem:**
The scheduler filters for `status: "approved"` — but after a member completes payment, their status becomes `"payment_confirmed"`. Annual members who have paid will **never** receive a renewal reminder.

**Current code:**
```js
const dueMembers = await Membership.find({
  membershipType:        "annual",
  status:                "approved",   // ❌ wrong — paid members are "payment_confirmed"
  approvedAt:            { $gte: windowStart, $lte: windowEnd },
  renewalReminderSentAt: null,
});
```

**Fix:**
```js
const dueMembers = await Membership.find({
  membershipType:        "annual",
  status:                "payment_confirmed",  // ✅ only fully paid members
  paidAt:                { $gte: windowStart, $lte: windowEnd },
  renewalReminderSentAt: null,
});
```

---

### Issue 2 — `renewalReminderSentAt` Permanently Blocks Future Reminders

**File:** `server/utils/renewalScheduler.js`

**Problem:**
Once `renewalReminderSentAt` is set, it is never reset. If a member renews next year and is re-confirmed, they will **never** get another reminder because this field remains set from the previous year.

**Fix:**
When an admin confirms a new payment (i.e. status transitions to `payment_confirmed` again after renewal), reset this field:

In `routes/membership.js`, inside the `POST /confirm-payment/:id` handler, add:
```js
member.renewalReminderSentAt = null;  // ✅ reset so next year's reminder fires
```

---

### Issue 3 — Renewal Reminder Uses `approvedAt` Instead of `paidAt`

**File:** `server/utils/renewalScheduler.js`

**Problem:**
Membership validity logically starts when payment is confirmed (`paidAt`), not when the admin clicked approve (`approvedAt`). A member approved in January but paying in March would receive a renewal reminder in January next year — 2 months too early.

**Fix:**
Replace `approvedAt` with `paidAt` in the scheduler query window (already shown in Issue 1 fix above), and update the renewal reminder email template to use `paidAt` as the membership start date:

In `services/membershipMailService.js`, inside `sendRenewalReminderEmail`:
```js
// Change from:
const joinedDate = new Date(member.approvedAt)...
const expiryDate = new Date(new Date(member.approvedAt).setFullYear(...))...

// Change to:
const joinedDate = new Date(member.paidAt)...
const expiryDate = new Date(new Date(member.paidAt).setFullYear(...))...
```

---

## 🟡 Moderate Issues

### Issue 4 — No Authentication on Admin Action Routes

**File:** `server/routes/membership.js`

**Problem:**
The following routes perform destructive admin actions with no authentication — only a MongoDB ObjectId is required, which is guessable or interceptable from email links:

- `GET /api/membership/approve/:id`
- `GET /api/membership/reject/:id`
- `GET /api/membership/confirm-payment/:id`
- `POST /api/membership/confirm-payment/:id`

**Fix:**
Add a signed token to each admin email link and verify it server-side.

**Step 1** — Create a token utility:
```js
// server/utils/adminToken.js
const crypto = require("crypto");
const SECRET = process.env.ADMIN_TOKEN_SECRET || "change-this-secret";

const generateToken = (id) =>
  crypto.createHmac("sha256", SECRET).update(String(id)).digest("hex");

const verifyToken = (id, token) => generateToken(id) === token;

module.exports = { generateToken, verifyToken };
```

**Step 2** — In `membershipMailService.js`, append `?token=<generated>` to every admin URL:
```js
const { generateToken } = require("../utils/adminToken");
const token = generateToken(member._id);
const approveUrl = `${SERVER_URL}/api/membership/approve/${member._id}?token=${token}`;
```

**Step 3** — In each admin route, verify before acting:
```js
const { verifyToken } = require("../utils/adminToken");

router.get("/approve/:id", async (req, res) => {
  if (!verifyToken(req.params.id, req.query.token))
    return res.send(resultPage("Unauthorized", "Invalid or missing token.", "#dc2626"));
  // ... rest of handler
});
```

Add `ADMIN_TOKEN_SECRET=<random-long-string>` to your `.env`.

---

### Issue 5 — Membership Form Fields Are Not Sanitized

**File:** `server/routes/membership.js`, `server/middleware/sanitizer.js`

**Problem:**
The `sanitizer` middleware only cleans contact form fields (`name`, `email`, `phone`, `message`). The membership `/apply` route uses `multer` and bypasses this middleware entirely. Fields like `fullName`, `institution`, `address`, `city` go directly into MongoDB without any sanitization.

**Fix:**
Inside the `upload(req, res, async (uploadErr) => { ... })` callback in `/apply`, manually sanitize text fields before saving:

```js
const sanitize = (str, max = 500) =>
  str ? String(str).trim().replace(/</g, "&lt;").replace(/>/g, "&gt;").slice(0, max) : "";

const member = await Membership.create({
  fullName:    sanitize(body.fullName),
  institution: sanitize(body.institution),
  address:     sanitize(body.address),
  city:        sanitize(body.city),
  // ... apply sanitize() to all free-text string fields
});
```

---

### Issue 6 — `SERVER_URL` Has No Fallback and No Startup Validation

**File:** `server/services/membershipMailService.js`, `server/index.js`

**Problem:**
Every admin action URL in emails is built using `process.env.SERVER_URL`. If this env var is missing or misconfigured, all links in approval/payment emails silently become `undefined/api/membership/...` — making the entire admin workflow broken with no visible error.

**Fix — Option A:** Add a startup guard in `server/index.js`:
```js
const REQUIRED_ENV = [
  "MONGO_URI", "GMAIL_USER", "GMAIL_APP_PASSWORD",
  "RECIPIENT_EMAIL", "SERVER_URL"
];
REQUIRED_ENV.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Missing required env variable: ${key}`);
    process.exit(1);
  }
});
```

**Fix — Option B:** Add a safe fallback in the mail service (less ideal, but defensive):
```js
const SERVER_URL = process.env.SERVER_URL || "http://localhost:5000";
```

---

### Issue 7 — No Input Validation on Membership `/apply` Route

**File:** `server/routes/membership.js`

**Problem:**
The contact form has full validator middleware, but `/apply` only checks for file presence and membership type. Fields like `email`, `phone`, `pin`, `dob` are stored raw with no format checks. An invalid email means all subsequent emails (approval, payment, membership ID) are silently undeliverable.

**Fix:**
Add basic validation inside the upload callback before the `Membership.create()` call:

```js
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const pinRegex   = /^\d{6}$/;
const phoneRegex = /^[+\d\s\-(). ]{7,20}$/;

if (!body.fullName || body.fullName.trim().length < 2)
  return res.status(400).json({ error: "Full name is required (min 2 chars)." });

if (!emailRegex.test(body.email))
  return res.status(400).json({ error: "Invalid email address." });

if (!phoneRegex.test(body.phone))
  return res.status(400).json({ error: "Invalid phone number." });

if (!pinRegex.test(body.pin))
  return res.status(400).json({ error: "PIN must be a 6-digit number." });

if (body.agreedToTerms !== "true" || body.agreedToPrivacy !== "true")
  return res.status(400).json({ error: "You must agree to terms and privacy policy." });
```

---

## 🟢 Minor Issues

### Issue 8 — Membership ID Whitespace-Only Bypass

**File:** `server/routes/membership.js` — `POST /confirm-payment/:id`

**Problem:**
`req.body.membershipId?.trim()` correctly trims whitespace, but the existence check `if (!membershipId)` passes for a string like `"   "` before trim is applied — depending on JS evaluation order. A whitespace-only submission could store an empty membership ID.

**Fix:**
```js
const membershipId = req.body.membershipId?.trim();
if (!membershipId || membershipId.length < 3)
  return res.send(resultPage("Missing ID", "Please enter a valid Membership ID (min 3 characters).", "#d97706"));
```

---

### Issue 9 — Uploaded Documents Are Publicly Accessible

**File:** `server/index.js`

**Problem:**
```js
app.use("/uploads", express.static("uploads"));
```
Government IDs, qualification certificates, and designation proofs are served as static files — anyone with the URL can access them. These are sensitive personal documents.

**Fix (short-term):**
Replace the static route with a protected one that checks a token or restricts by IP. At minimum, add the admin token check:

```js
// Remove: app.use("/uploads", express.static("uploads"));

// Add:
const { verifyToken } = require("./utils/adminToken");
app.get("/uploads/membership/:filename", (req, res) => {
  if (!verifyToken(req.query.id, req.query.token))
    return res.status(403).json({ error: "Unauthorized" });
  res.sendFile(path.join(__dirname, "uploads/membership", req.params.filename));
});
```

**Fix (long-term):** Move file storage to AWS S3 or Cloudinary with signed/expiring URLs.

---

### Issue 10 — Cron Job Has No Timezone Set

**File:** `server/utils/renewalScheduler.js`

**Problem:**
`node-cron` defaults to the server's local timezone. On cloud platforms (Render, Railway, Heroku), this is almost always UTC. The scheduler set to `0 9 * * *` fires at 9:00 AM UTC = 2:30 PM IST — not 9:00 AM IST as likely intended.

**Fix:**
```js
cron.schedule("0 9 * * *", async () => {
  // ... handler
}, {
  timezone: "Asia/Kolkata"  // ✅ explicit IST
});
```

---

## Summary Table

| # | Severity | File | Issue |
|---|----------|------|-------|
| 1 | 🔴 Critical | `renewalScheduler.js` | Wrong status filter — paid members never reminded |
| 2 | 🔴 Critical | `renewalScheduler.js` + `membership.js` | `renewalReminderSentAt` never reset |
| 3 | 🔴 Critical | `renewalScheduler.js` + `membershipMailService.js` | Uses `approvedAt` instead of `paidAt` |
| 4 | 🟡 Moderate | `membership.js` | No auth on admin routes |
| 5 | 🟡 Moderate | `membership.js` | Membership fields not sanitized |
| 6 | 🟡 Moderate | `membershipMailService.js` + `index.js` | `SERVER_URL` missing = silent broken links |
| 7 | 🟡 Moderate | `membership.js` | No input validation on `/apply` |
| 8 | 🟢 Minor | `membership.js` | Membership ID whitespace bypass |
| 9 | 🟢 Minor | `index.js` | Sensitive uploads publicly accessible |
| 10 | 🟢 Minor | `renewalScheduler.js` | Cron timezone not set — fires at wrong time |

---

*Generated for Nexus Biomedical Research Foundation Trust — Backend Review*