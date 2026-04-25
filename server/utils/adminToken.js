const crypto = require("crypto");

const DEV_FALLBACK_SECRET = "local-development-admin-token-secret";

const getAdminTokenSecret = () => {
  const secret = process.env.ADMIN_TOKEN_SECRET;
  if (secret) return secret;

  if (process.env.NODE_ENV === "production") {
    throw new Error("ADMIN_TOKEN_SECRET is required in production.");
  }

  return DEV_FALLBACK_SECRET;
};

const generateToken = (id) =>
  crypto
    .createHmac("sha256", getAdminTokenSecret())
    .update(String(id))
    .digest("hex");

const verifyToken = (id, token) => {
  if (!id || !token) return false;

  const expected = generateToken(id);
  const received = String(token);

  if (received.length !== expected.length) return false;

  return crypto.timingSafeEqual(
    Buffer.from(received, "utf8"),
    Buffer.from(expected, "utf8"),
  );
};

module.exports = { generateToken, verifyToken };
