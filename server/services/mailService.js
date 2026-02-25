const nodemailer = require("nodemailer");

// Creates the Gmail transporter using your credentials
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// ── Email 1: Notification email to YOUR inbox ─────────────────────────────────
// This is what YOU see when someone submits the form
const sendNotificationEmail = async (
  transporter,
  { name, email, phone, message },
) => {
  const mailOptions = {
    from: `"Nexus Biomedical Website" <${process.env.GMAIL_USER}>`,
    to: process.env.RECIPIENT_EMAIL,
    replyTo: email, // when you hit Reply it goes back to the user
    subject: `New Enquiry from ${name} — Nexus Biomedical`,
    html: `
      <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;
                  margin:0 auto;border:1px solid #e0e0e0;border-radius:8px;
                  overflow:hidden;">

        <!-- Header -->
        <div style="background:linear-gradient(135deg,#1a365d 0%,#2d3748 100%);
                    padding:24px;text-align:center;">
          <h2 style="color:#fff;margin:0;font-size:1.3rem;">
            New Contact Form Submission
          </h2>
          <p style="color:#a0c4e0;margin:6px 0 0;font-size:0.9rem;">
            Nexus Biomedical Research Foundation Trust
          </p>
        </div>

        <!-- Body -->
        <div style="padding:24px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:10px 12px;font-weight:700;color:#1a365d;
                          width:110px;border-bottom:1px solid #f0f0f0;">Name</td>
              <td style="padding:10px 12px;color:#333;
                          border-bottom:1px solid #f0f0f0;">${name}</td>
            </tr>
            <tr style="background:#f8f9fa;">
              <td style="padding:10px 12px;font-weight:700;color:#1a365d;
                          border-bottom:1px solid #f0f0f0;">Email</td>
              <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;">
                <a href="mailto:${email}" style="color:#2c5f8d;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:10px 12px;font-weight:700;color:#1a365d;
                          border-bottom:1px solid #f0f0f0;">Phone</td>
              <td style="padding:10px 12px;color:#333;
                          border-bottom:1px solid #f0f0f0;">
                ${phone || '<em style="color:#999;">Not provided</em>'}
              </td>
            </tr>
            <tr style="background:#f8f9fa;">
              <td style="padding:10px 12px;font-weight:700;color:#1a365d;
                          vertical-align:top;">Message</td>
              <td style="padding:10px 12px;color:#333;line-height:1.6;">
                ${message.replace(/\n/g, "<br/>")}
              </td>
            </tr>
          </table>
        </div>

        <!-- Footer -->
        <div style="background:#f8f9fa;padding:14px;text-align:center;
                    border-top:1px solid #e0e0e0;">
          <p style="color:#888;font-size:0.8rem;margin:0;">
            Submitted via Nexus Biomedical website &nbsp;|&nbsp;
            Hit <strong>Reply</strong> to respond directly to ${name}
          </p>
        </div>

      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

// ── Email 2: Auto-reply to the user who submitted the form ────────────────────
// This is what THE USER sees in their inbox after submitting
const sendAutoReply = async (transporter, { name, email }) => {
  const mailOptions = {
    from: `"Nexus Biomedical Research Foundation Trust" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: `We received your enquiry — Nexus Biomedical`,
    html: `
      <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;
                  margin:0 auto;border:1px solid #e0e0e0;border-radius:8px;
                  overflow:hidden;">

        <!-- Header -->
        <div style="background:linear-gradient(135deg,#1a365d 0%,#2d3748 100%);
                    padding:24px;text-align:center;">
          <h2 style="color:#fff;margin:0;font-size:1.3rem;">
            Thank You for Contacting Us
          </h2>
          <p style="color:#a0c4e0;margin:6px 0 0;font-size:0.9rem;">
            Nexus Biomedical Research Foundation Trust
          </p>
        </div>

        <!-- Body -->
        <div style="padding:28px;">
          <p style="color:#333;line-height:1.7;margin:0 0 16px;">
            Dear <strong>${name}</strong>,
          </p>
          <p style="color:#333;line-height:1.7;margin:0 0 16px;">
            Thank you for reaching out to the Nexus Biomedical Research 
            Foundation Trust. We have received your enquiry and will get 
            back to you within <strong>2–3 business days</strong>.
          </p>
          <p style="color:#333;line-height:1.7;margin:0 0 16px;">
            For urgent matters, you can reach us directly at:
          </p>
          <div style="background:#f0f7ff;border-left:4px solid #2c5f8d;
                      padding:14px 18px;border-radius:4px;margin-bottom:20px;">
           
            <p style="margin:0;color:#333;">
              📧 <a href="mailto:nexusbiomedicalresearch@gmail.com" 
                   style="color:#2c5f8d;text-decoration:none;">
                   nexusbiomedicalresearch@gmail.com
              </a>
            </p>
          </div>
          <p style="color:#333;line-height:1.7;margin:0;">
            Warm regards,<br/>
            <strong>Nexus Biomedical Research Foundation Trust</strong><br/>
           </p>
        </div>

        <!-- Footer -->
        <div style="background:#f8f9fa;padding:14px;text-align:center;
                    border-top:1px solid #e0e0e0;">
          <p style="color:#888;font-size:0.8rem;margin:0;">
            This is an automated confirmation. Please do not reply to this email.
          </p>
        </div>

      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

// ── Main function called by the route ─────────────────────────────────────────
const sendEnquiryEmail = async ({ name, email, phone, message }) => {
  const transporter = createTransporter();

  // Send notification to organization inbox
  await sendNotificationEmail(transporter, { name, email, phone, message });

  // Send auto-reply to user (non-critical — don't fail if this errors)
  try {
    await sendAutoReply(transporter, { name, email });
  } catch (err) {
    // Auto-reply failed but notification was sent — log and continue
    console.warn("Auto-reply failed (non-critical):", err.message);
  }
};

module.exports = { sendEnquiryEmail };
