const API_KEY_ENV_KEYS = ["RESEND_API_KEY", "RESEND_KEY", "RESEND_TOKEN"];
const FROM_ENV_KEYS = ["EMAIL_FROM", "RESEND_FROM", "FROM_EMAIL", "RESEND_EMAIL_FROM"];

const normalizeEnvValue = (value) => {
  if (typeof value !== "string") {
    return "";
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  // Supports values saved as "value" or 'value' in environment settings.
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }

  return trimmed;
};

const readFirstEnv = (keys) => {
  for (const key of keys) {
    const value = normalizeEnvValue(process.env[key]);
    if (value) {
      return { key, value };
    }
  }

  return { key: null, value: "" };
};

const getMailConfig = () => {
  const api = readFirstEnv(API_KEY_ENV_KEYS);
  const from = readFirstEnv(FROM_ENV_KEYS);

  return {
    apiKey: api.value,
    from: from.value,
    apiKeyEnv: api.key,
    fromEnv: from.key
  };
};

const sendOtpEmail = async ({ to, otp }) => {
  const { apiKey, from } = getMailConfig();

  if (!apiKey) {
    const error = new Error(
      `Missing Resend API key. Set one of: ${API_KEY_ENV_KEYS.join(", ")}`
    );
    error.code = "OTP_MAIL_CONFIG_MISSING_API_KEY";
    throw error;
  }

  if (!from) {
    const error = new Error(
      `Missing sender email. Set one of: ${FROM_ENV_KEYS.join(", ")}`
    );
    error.code = "OTP_MAIL_CONFIG_MISSING_FROM";
    throw error;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  let response;
  try {
    response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from,
        to,
        subject: "Your OTP Code",
        html: `
          <h2>Your OTP Code</h2>
          <p>Your verification code is:</p>
          <h1>${otp}</h1>
          <p>This code expires in 5 minutes.</p>
        `
      }),
      signal: controller.signal
    });
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Resend API timeout after 10 seconds");
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(`Resend API error: ${response.status} ${responseText}`);
  }
};

module.exports = { sendOtpEmail, getMailConfig };