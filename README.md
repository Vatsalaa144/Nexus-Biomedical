# Nexus Biomedical Research Foundation Trust

A full-stack web platform for the Nexus Biomedical Research Foundation Trust. The project provides a public-facing organizational website, membership application system, contact enquiry flow, research and resource pages, blog content, committee details, media updates, and an email-driven backend workflow for membership administration.

> Live Site: `<add-live-url-here>`<br>
> Repository: `<add-github-repository-url-here>`<br>
> Maintainer: `<add-maintainer-name-here>`

---

## Table of Contents

- [Project Overview](#project-overview)
- [How the Project Works](#how-the-project-works)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Environment Variables](#environment-variables)
- [Local Setup](#local-setup)
- [Available Scripts](#available-scripts)
- [API Overview](#api-overview)
- [Security and Validation](#security-and-validation)
- [Deployment Notes](#deployment-notes)
- [Future Improvements](#future-improvements)
- [Contact](#contact)

---

## Project Overview

Nexus Biomedical Research Foundation Trust is designed as a professional digital platform for a biomedical research organization. It presents the trust's identity, objectives, leadership, research focus, collaborations, media updates, resources, journal information, and blog content in a structured website.

The project also includes a functional membership system. Visitors can apply for annual or lifetime membership through a multi-step form, upload required documents, agree to terms and privacy declarations, and submit the application to the backend. The backend stores application data in MongoDB, stores uploaded documents in Cloudinary, and uses email notifications to coordinate the membership approval and payment process.

The application is split into two independent parts:

- `client/`: Vite + React frontend for the public website and forms.
- `server/`: Express + MongoDB backend for APIs, email delivery, document uploads, membership workflow, and renewal reminders.

---

## How the Project Works

### Visitor Website Flow

Users browse the React frontend through public pages such as Home, About, Committee, Blog, Research, Collaborations, JAIRAM Journal, Resources, Media, Contact, and Membership. Routing is handled on the client side using React Router.

### Contact Enquiry Flow

1. A visitor submits the contact form from the Contact page.
2. The frontend sends the enquiry to `POST /api/contact`.
3. The backend applies rate limiting, sanitization, validation, and a honeypot check.
4. Nodemailer sends the enquiry to the configured recipient email.
5. The visitor receives a success or error response in the UI.

### Membership Application Flow

1. A visitor chooses Annual Membership or Lifetime Membership.
2. The frontend collects personal, contact, professional, document, and consent details.
3. The frontend sends the form data and files to `POST /api/membership/apply`.
4. The backend validates fields, checks duplicate active applications, uploads documents to Cloudinary, and creates a MongoDB membership record.
5. Email notifications are sent to the administrator and applicant.

### Admin Approval and Payment Flow

Membership administration is handled through signed email links:

1. New applications start with status `pending`.
2. Admin can approve or reject using secure tokenized email links.
3. Approved applicants receive payment instructions.
4. Applicant clicks the payment done link after completing payment.
5. Admin receives a payment confirmation email link.
6. Admin confirms payment, assigns a Membership ID, and the applicant receives the final membership confirmation email.

### Membership Lifecycle

The backend tracks membership status using these values:

| Status | Meaning |
| --- | --- |
| `pending` | Application submitted and waiting for admin review. |
| `approved` | Admin approved the application and payment instructions were sent. |
| `rejected` | Admin rejected the application. |
| `payment_initiated` | Applicant clicked the payment done link. |
| `payment_confirmed` | Admin confirmed payment and issued a Membership ID. |

### Renewal Reminder Flow

The backend uses `node-cron` to run a daily renewal check at 09:00 AM IST. Annual members whose `paidAt` date matches the renewal window and who have not already received a reminder are sent a renewal reminder email.

---

## Features

### Frontend Pages

- Home page with hero visuals, important dates, and featured blog content.
- About page with organizational background, objectives, founders, and legal details.
- Committee page with executive committee and historical leadership information.
- Blog listing and individual blog post pages.
- Research page describing domains, methodology, ethics, facilities, and projects.
- Collaborations page for institutional partnerships, MoUs, and funding opportunities.
- JAIRAM Journal page for journal scope and focus areas.
- Resources page for reports, concept notes, policies, and SOPs.
- Media page for news, events, workshops, and gallery sections.
- Contact page with contact details and enquiry form.
- Membership landing page with annual and lifetime membership options.
- Multi-step annual and lifetime membership application forms.

### Backend Capabilities

- Contact form API with rate limiting, validation, sanitization, and email delivery.
- Membership application API with form validation and duplicate application checks.
- Cloudinary document upload support for membership documents.
- MongoDB persistence for membership records.
- Email-based admin workflow for approval, rejection, payment initiation, and payment confirmation.
- Signed admin links using HMAC tokens.
- Background membership email dispatch so request responses are not blocked by email delivery.
- Annual membership renewal reminder scheduler.
- Health check endpoint for server availability.

---

## Tech Stack

### Frontend

- React 19
- Vite 7
- React Router DOM 7
- Axios
- React Icons
- Material UI and MUI Icons
- CSS files for page and component styling

### Backend

- Node.js
- Express 5
- Mongoose
- MongoDB
- Multer
- Cloudinary
- Nodemailer
- node-cron
- CORS
- dotenv
- express-rate-limit

### Tooling

- npm
- ESLint
- Nodemon
- Vite build tooling
- Git

---

## Folder Structure

```text
Nexus-Biomedical/
├── README.md
├── client/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── vercel.json
│   ├── public/
│   └── src/
│       ├── api/
│       │   └── membershipApi.js
│       ├── assets/
│       │   ├── Blog/
│       │   ├── Committee/
│       │   └── images and logos
│       ├── components/
│       │   ├── BlogCard/
│       │   ├── Footer/
│       │   └── Navbar/
│       ├── data/
│       │   └── blogData.js
│       ├── pages/
│       │   ├── About/
│       │   ├── BlogPage/
│       │   ├── BlogPostPage/
│       │   ├── Collaborations/
│       │   ├── Committee/
│       │   ├── Contact/
│       │   ├── Home/
│       │   ├── JairamJournal/
│       │   ├── Media/
│       │   ├── Membership/
│       │   ├── Research/
│       │   └── Resources/
│       ├── App.jsx
│       ├── main.jsx
│       └── index.css
└── server/
    ├── index.js
    ├── package.json
    ├── middleware/
    │   ├── rateLimiter.js
    │   ├── sanitizer.js
    │   └── validator.js
    ├── models/
    │   └── Membership.js
    ├── routes/
    │   ├── email.js
    │   └── membership.js
    ├── services/
    │   ├── mailService.js
    │   └── membershipMailService.js
    ├── uploads/
    │   └── membership/
    └── utils/
        ├── adminToken.js
        └── renewalScheduler.js
```

---

## Environment Variables

Create separate `.env` files for the frontend and backend. Do not commit real secrets.

### Client `.env`

```env
VITE_API_URL=http://localhost:5000/api
```

### Server `.env`

```env
PORT=5000
NODE_ENV=development

MONGO_URI=mongodb+srv://<username>:<password>@<cluster>/<database>

GMAIL_USER=<gmail-address>
GMAIL_APP_PASSWORD=<gmail-app-password>
RECIPIENT_EMAIL=<admin-recipient-email>

CLOUDINARY_CLOUD_NAME=<cloudinary-cloud-name>
CLOUDINARY_API_KEY=<cloudinary-api-key>
CLOUDINARY_API_SECRET=<cloudinary-api-secret>

SERVER_URL=http://localhost:5000
ADMIN_TOKEN_SECRET=<long-random-secret>

BANK_ACCOUNT_NAME=Nexus Biomedical Research Foundation Trust
BANK_ACCOUNT_NO=<bank-account-number>
BANK_IFSC=<bank-ifsc-code>
UPI_ID=<upi-id>
```

Required server variables:

- `MONGO_URI`
- `GMAIL_USER`
- `GMAIL_APP_PASSWORD`
- `RECIPIENT_EMAIL`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Required in production:

- `SERVER_URL`
- `ADMIN_TOKEN_SECRET`

Optional payment variables:

- `BANK_ACCOUNT_NAME`
- `BANK_ACCOUNT_NO`
- `BANK_IFSC`
- `UPI_ID`

---

## Local Setup

### Prerequisites

- Node.js
- npm
- MongoDB database connection string
- Gmail app password for email delivery
- Cloudinary account for document uploads

### 1. Clone the Repository

```bash
git clone <add-github-repository-url-here>
cd Nexus-Biomedical
```

### 2. Install Frontend Dependencies

```bash
cd client
npm install
```

### 3. Install Backend Dependencies

```bash
cd ../server
npm install
```

### 4. Configure Environment Variables

Create:

- `client/.env`
- `server/.env`

Use the placeholder examples from the [Environment Variables](#environment-variables) section.

### 5. Start the Backend

```bash
cd server
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/health
```

### 6. Start the Frontend

Open a second terminal:

```bash
cd client
npm run dev
```

The frontend runs on the Vite development URL, usually:

```text
http://localhost:5173
```

---

## Available Scripts

### Client

```bash
npm run dev
```

Starts the Vite development server.

```bash
npm run build
```

Builds the frontend for production.

```bash
npm run preview
```

Previews the production build locally.

```bash
npm run lint
```

Runs ESLint checks for the frontend.

### Server

```bash
npm run dev
```

Starts the backend with Nodemon.

```bash
npm start
```

Starts the backend with Node.

---

## API Overview

### General

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/health` | Checks whether the backend is running. |

### Contact

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/contact` | Receives contact form enquiries and sends email notifications. |

### Membership

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/membership/apply` | Submits an annual or lifetime membership application with documents. |
| `GET` | `/api/membership/approve/:id` | Admin approval link from email. Requires signed token query parameter. |
| `GET` | `/api/membership/reject/:id` | Admin rejection link from email. Requires signed token query parameter. |
| `GET` | `/api/membership/payment-done/:id` | Applicant link to notify that payment has been completed. |
| `GET` | `/api/membership/confirm-payment/:id` | Admin page for confirming payment and assigning Membership ID. Requires signed token query parameter. |
| `POST` | `/api/membership/confirm-payment/:id` | Admin submission for final payment confirmation and Membership ID issue. Requires signed token query parameter. |

### Legacy Upload Access

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/uploads/membership/:filename` | Serves older local membership uploads with token validation. Current records use Cloudinary metadata. |

---

## Security and Validation

- Backend validates required membership fields before database insertion.
- Membership email addresses, phone numbers, WhatsApp numbers, and PIN codes are checked before submission is accepted.
- Membership application files are limited to 5 MB each.
- Accepted file types are `.pdf`, `.jpg`, `.jpeg`, `.png`, and `.docx`.
- Contact form requests use rate limiting, sanitization, validation, and a honeypot field.
- Admin approval, rejection, and payment confirmation links use HMAC-based signed tokens.
- Production requires `ADMIN_TOKEN_SECRET` to avoid insecure token generation.
- CORS is restricted to known frontend origins and configured server URL.
- Email sending failures are logged without blocking completed membership database actions.

---

## Deployment Notes

### Frontend

The frontend can be deployed to platforms such as Vercel, Netlify, or any static hosting provider that supports Vite builds.

Build command:

```bash
npm run build
```

Output directory:

```text
client/dist
```

Set `VITE_API_URL` to the deployed backend API base URL.

### Backend

The backend can be deployed to a Node.js hosting provider. Configure all required environment variables in the hosting dashboard.

Production notes:

- Set `NODE_ENV=production`.
- Set `SERVER_URL` to the deployed backend URL.
- Set a strong `ADMIN_TOKEN_SECRET`.
- Ensure MongoDB, Gmail app password, and Cloudinary credentials are valid.
- Confirm the deployed frontend origin is allowed by backend CORS settings.

---

## Future Improvements

- Add a dedicated admin dashboard instead of email-only membership administration.
- Add authentication and role-based access control for admin actions.
- Add automated tests for membership lifecycle and contact form workflows.
- Add payment gateway integration for direct online payments.
- Add CMS support for blogs, resources, media updates, and journal content.
- Add richer audit logs for membership status changes.
- Add email retry queue for failed email delivery.

---

## Contact

Organization: Nexus Biomedical Research Foundation Trust<br>
Website: `<add-website-url-here>`<br>
Email: `<add-public-contact-email-here>`<br>
Phone: `<add-phone-number-here>`<br>
Address: `<add-office-address-here>`

Project Maintainer: `<add-maintainer-name-here>`<br>
GitHub: `<add-github-profile-or-repo-url-here>`<br>
LinkedIn: `<add-linkedin-url-here>`

---

## Project Status

The project currently includes a working public frontend, contact form API, membership application API, Cloudinary document upload flow, email-based membership administration, and annual renewal reminder scheduling.
