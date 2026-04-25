# Nexus Biomedical — Post-Fix Testing Guide

> Run through this checklist after applying all fixes from `NEXUS_BACKEND_ISSUES.md`.
> Test in order — each section depends on the previous.

---

## Prerequisites

- Server running locally: `npm run dev` inside `server/`
- `.env` file has all required variables (see Section 0)
- MongoDB connected (check console for `✅ MongoDB connected`)
- A REST client ready: Postman, Insomnia, or Thunder Client (VS Code)
- A real email address you can check (for email flow tests)

---

## Section 0 — Environment Check

### Test: All required env variables present

**What to check:**
Start the server. If any required variable is missing, the server should now exit immediately with a clear error message.

```
❌ Missing required env variable: SERVER_URL
```

**How to test:**
Temporarily remove `SERVER_URL` from `.env`, restart server, confirm it exits with the correct message. Restore the value.

**Expected result:** Server refuses to start and logs the missing variable name.

**Possible error:**
```
TypeError: Cannot read properties of undefined (reading 'split')
```
**Fix:** The env guard (`process.exit(1)`) must come *before* any code that uses `process.env.SERVER_URL`.

---

## Section 1 — Contact Form (Existing Feature)

### Test: Submit a valid contact form

```
POST http://localhost:5000/api/contact
Content-Type: application/json

{
  "name": "Test User",
  "email": "your-real-email@gmail.com",
  "phone": "9999999999",
  "message": "This is a test message from the form."
}
```

**Expected result:** `200 { success: true, message: "Message sent successfully!" }`
Check your inbox — both the admin notification and user auto-reply should arrive.

**Possible error:** `535 Authentication Failed`
**Fix:** Check `GMAIL_USER` and `GMAIL_APP_PASSWORD` in `.env`. The password must be a Gmail App Password (16 chars), not your regular Gmail password.

---

### Test: Rate limiter works

Submit the same request 6 times in quick succession.

**Expected result:** 6th request returns `429` with:
```json
{ "error": "Too many messages sent from this device. Please try again after 1 hour." }
```

---

## Section 2 — Membership Application (`/apply`)

### Test: Submit valid application with files

Use Postman — set body to `form-data`:

| Key | Type | Value |
|-----|------|-------|
| membershipType | Text | `annual` |
| fullName | Text | `Dr. Test Member` |
| dob | Text | `1990-05-15` |
| gender | Text | `Male` |
| nationality | Text | `Indian` |
| email | Text | `your-real-email@gmail.com` |
| phone | Text | `9876543210` |
| whatsapp | Text | `9876543210` |
| address | Text | `123 Test Street` |
| city | Text | `Lucknow` |
| state | Text | `Uttar Pradesh` |
| pin | Text | `226001` |
| qualification | Text | `MBBS` |
| designation | Text | `Resident Doctor` |
| department | Text | `General Medicine` |
| institution | Text | `KGMU` |
| institutionCity | Text | `Lucknow` |
| registrationNo | Text | `UP-12345` |
| agreedToTerms | Text | `true` |
| agreedToPrivacy | Text | `true` |
| govtId | File | any PDF or image |
| qualificationProof | File | any PDF or image |
| designationProof | File | any PDF or image |

**Expected result:** `201 { success: true, applicationId: "..." }`

**Check email:** Admin notification arrives with all details and Approve/Reject buttons.
**Check email:** Applicant receives a confirmation email.

**Possible error:** `400 Missing required documents`
**Fix:** Ensure all three file fields are attached in Postman and field names match exactly (`govtId`, `qualificationProof`, `designationProof`).

---

### Test: Invalid email rejected

Submit the form with `email: "notanemail"`.

**Expected result:** `400 { error: "Invalid email address." }`

---

### Test: Invalid PIN rejected

Submit with `pin: "12AB"`.

**Expected result:** `400 { error: "PIN must be a 6-digit number." }`

---

### Test: Duplicate application blocked

Submit the same email + membershipType twice.

**Expected result:** Second submission returns `409 { error: "An active application with this email already exists for this plan." }`

---

### Test: File too large rejected

Submit a file larger than 5MB.

**Expected result:** `400 { error: "Files must be under 5MB each." }`

---

## Section 3 — Admin Approval Flow

### Test: Approve with valid token

From the admin email, click the **✅ Approve Application** button.

**Expected result:**
- Browser shows green success page: *"Application Approved ✅"*
- Applicant receives payment instruction email with bank details and **"I Have Made the Payment"** button
- Member's status in DB changes to `approved`, `approvedAt` is set

**Possible error:** Browser shows *"Unauthorized — Invalid or missing token"*
**Fix:** The `generateToken` / `verifyToken` functions must use the same `ADMIN_TOKEN_SECRET` env variable. Confirm it is set in `.env` and the server was restarted after adding it.

---

### Test: Approve with tampered/missing token

Manually visit `http://localhost:5000/api/membership/approve/<real-id>` (no `?token=` param).

**Expected result:** Page shows *"Unauthorized"* — does **not** approve the member.

---

### Test: Double-approve is blocked

Click the Approve button a second time (or revisit the URL).

**Expected result:** Page shows *"Already Approved"* — status does not change again.

---

### Test: Reject with valid token

Use a fresh application. Click **❌ Reject Application** from the admin email.

**Expected result:**
- Browser shows *"Application Rejected"* page
- Applicant receives rejection email
- Member's status in DB is `rejected`

---

### Test: Cannot reject an already-approved application

Try clicking Reject on an already-approved member.

**Expected result:** Page shows *"Cannot Reject — application is already in progress"*.

---

## Section 4 — Payment Flow

### Test: Member clicks "I Have Made the Payment"

From the payment instruction email, click **✅ I Have Made the Payment**.

**Expected result:**
- Browser shows *"Payment Notification Sent ✅"* page
- Admin receives a *"Payment Initiated 💰"* email with a **Verify & Confirm Payment** button
- Member's status changes to `payment_initiated`

---

### Test: Clicking payment button twice is blocked

Click the payment button a second time.

**Expected result:** Page shows *"Payment Noted ✅ — We have already received your payment notification."* Status does not change.

---

### Test: Admin confirms payment and issues Membership ID

Click **Verify & Confirm Payment** from the admin email.

**Expected result:** A form page opens asking for a Membership ID.

Enter a valid ID (e.g. `NB-2025-00001`) and submit.

**Expected result:**
- Browser shows *"Payment Confirmed ✅"* page
- Applicant receives welcome email with their Membership ID displayed prominently
- Member's status is `payment_confirmed`, `paidAt` is set
- `renewalReminderSentAt` is `null` (confirm in DB)

---

### Test: Whitespace-only Membership ID is rejected

On the confirm payment form, enter only spaces and submit.

**Expected result:** Page shows *"Please enter a valid Membership ID (min 3 characters)."* — does not save.

---

## Section 5 — Protected File Access (Issue 9 fix)

### Test: Direct file URL is blocked without token

Find a filename from the DB (e.g. `documents.govtId`). Visit:
```
http://localhost:5000/uploads/membership/<filename>
```

**Expected result:** `403 { error: "Unauthorized" }` — file is NOT served.

---

### Test: File accessible with valid token and ID

```
http://localhost:5000/uploads/membership/<filename>?id=<memberId>&token=<validToken>
```

**Expected result:** File is served correctly (PDF or image opens in browser).

---

## Section 6 — Renewal Scheduler

### Test: Cron runs at correct time (IST)

Check server console at 9:00 AM IST. You should see:
```
🔄 Running annual membership renewal check...
✅ No renewal reminders due today.
```
(or a list of members if any are due)

**If running on a cloud server in UTC:** Confirm the log appears at 9:00 AM IST (= 03:30 UTC), not 9:00 AM UTC.

---

### Test: Renewal reminder fires correctly (manual simulation)

To test without waiting a year, temporarily insert a test member directly into MongoDB:

```js
// In MongoDB shell or Compass:
db.memberships.insertOne({
  membershipType: "annual",
  status: "payment_confirmed",
  fullName: "Test Renewal Member",
  email: "your-real-email@gmail.com",
  membershipId: "NB-TEST-001",
  paidAt: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
  renewalReminderSentAt: null
})
```

Then temporarily change the cron schedule to fire in 1 minute:
```js
cron.schedule("* * * * *", ...)  // every minute — revert after testing
```

Restart server. After 1 minute:

**Expected result:**
- Console shows: `📧 Sending renewal reminders to 1 member(s)...` and `✅ Renewal reminder sent to your-email`
- You receive a renewal reminder email with correct member name, plan, and expiry date
- `renewalReminderSentAt` is now set on the document (not null)

---

### Test: Reminder does not fire twice

Run the scheduler again (wait another minute if still on `* * * * *`).

**Expected result:** Console shows `✅ No renewal reminders due today.` — the already-reminded member is skipped.

---

### Test: `renewalReminderSentAt` resets on new payment confirmation

Take the test member above (who now has `renewalReminderSentAt` set). Simulate a new payment confirmation via:
```
POST /api/membership/confirm-payment/<id>
body: membershipId=NB-TEST-002
```

**Expected result:** `renewalReminderSentAt` is `null` again in the DB — next year's reminder will fire.

---

## Section 7 — Input Sanitization

### Test: XSS attempt in membership form

Submit `/apply` with `fullName: "<script>alert('xss')</script>"`.

**Expected result:** The value is stored as `&lt;script&gt;alert('xss')&lt;/script&gt;` — not raw HTML. Confirm in DB.

---

## Common Errors & Fixes Reference

| Error | Likely Cause | Fix |
|-------|-------------|-----|
| `❌ MongoDB connection failed` | Wrong `MONGO_URI` or IP not whitelisted | Check Atlas network access — whitelist your IP or `0.0.0.0/0` |
| `535 Authentication Failed` (email) | Wrong Gmail App Password | Generate a new App Password in Google Account → Security → 2FA → App Passwords |
| `CORS blocked: ... is not allowed` | Frontend URL not in `allowedOrigins` | Add your Vercel URL to `allowedOrigins` array in `index.js` |
| `Unauthorized — Invalid or missing token` on admin page | `ADMIN_TOKEN_SECRET` mismatch or missing | Ensure same secret in `.env` as when token was generated; restart server |
| `400 Missing required documents` | File field name mismatch in form | Frontend `FormData` key must exactly match: `govtId`, `qualificationProof`, `designationProof` |
| `TypeError: Cannot read properties of undefined` on `SERVER_URL` | Env var missing | Add `SERVER_URL=https://your-backend.com` to `.env` (no trailing slash) |
| Renewal email not arriving | Scheduler timezone or status filter issue | Check console logs at 9am IST; verify member has `status: "payment_confirmed"` and `renewalReminderSentAt: null` |
| Admin email links say `undefined/api/...` | `SERVER_URL` not set | Set `SERVER_URL` in `.env` and restart |
| File upload returns `500` | `uploads/membership/` folder missing | It auto-creates on startup — check folder permissions on host |
| Cron fires at wrong hour on production | No timezone set | Confirm `timezone: "Asia/Kolkata"` is passed to `cron.schedule()` |

---

*Nexus Biomedical Research Foundation Trust — Backend Testing Guide*