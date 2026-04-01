import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const submitMembershipApplication = async (
  membershipType,
  formData,
  files,
  agreeTerms,
  agreePrivacy
) => {
  try {
    const payload = new FormData();

    payload.append("membershipType", membershipType);

    Object.entries(formData).forEach(([key, value]) => {
      payload.append(key, value ?? "");
    });

    payload.append("agreedToTerms", String(agreeTerms));
    payload.append("agreedToPrivacy", String(agreePrivacy));

    if (files.govtId)             payload.append("govtId", files.govtId);
    if (files.qualificationProof) payload.append("qualificationProof", files.qualificationProof);
    if (files.designationProof)   payload.append("designationProof", files.designationProof);

    const res = await axios.post(
      `${API_BASE}/membership/apply`,
      payload,
      {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 30000,
      }
    );

    return res.data;

  } catch (err) {
    // 👇 IMPORTANT
    if (err.response?.status === 409) {
      return {
        success: false,
        message: "You have already applied for membership"
      };
    }

    console.error("Membership error:", err.response || err.message);

    return {
      success: false,
      message: "Something went wrong. Please try again."
    };
  }
};