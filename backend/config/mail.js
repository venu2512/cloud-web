const RESEND_API_KEY_ENV_KEYS = ["RESEND_API_KEY", "RESEND_KEY", "RESEND_TOKEN"];
const BREVO_API_KEY_ENV_KEYS = ["BREVO_API_KEY", "SENDINBLUE_API_KEY", "SIB_API_KEY"];
const FROM_ENV_KEYS = ["EMAIL_FROM", "RESEND_FROM", "FROM_EMAIL", "RESEND_EMAIL_FROM", "BREVO_FROM"];

const normalizeEnvValue = (value, envKey) => {
  if (typeof value !== "string") {
    return "";
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  let normalized = trimmed;

  if (
    (normalized.startsWith('"') && normalized.endsWith('"')) ||
    (normalized.startsWith("'") && normalized.endsWith("'"))
  ) {
    normalized = normalized.slice(1, -1).trim();
  }

  if (/\r|\n/.test(normalized)) {
    const lines = normalized
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    const ownKeyLine = envKey
      ? lines.find((line) => line.startsWith(`${envKey}=`))
      : null;

    if (ownKeyLine) {
      normalized = ownKeyLine.slice(ownKeyLine.indexOf("=") + 1).trim();
    } else {
      normalized = lines[lines.length - 1] || "";
      if (normalized.includes("=") && !normalized.includes(" ")) {
        normalized = normalized.slice(normalized.indexOf("=") + 1).trim();
      }
    }
  }

  return normalized;
};

const readFirstEnv = (keys) => {
  for (const key of keys) {
    const value = normalizeEnvValue(process.env[key], key);
    if (value) {
      return { key, value };
    }
  }

  return { key: null, value: "" };
};

const getMailConfig = () => {
  const provider = normalizeEnvValue(process.env.OTP_MAIL_PROVIDER).toLowerCase() || "auto";
  const from = readFirstEnv(FROM_ENV_KEYS);
  const resend = readFirstEnv(RESEND_API_KEY_ENV_KEYS);
  const brevo = readFirstEnv(BREVO_API_KEY_ENV_KEYS);

  const selectedProvider =
    provider === "brevo" || provider === "resend"
      ? provider
      : brevo.value
      ? "brevo"
      : "resend";

  const api = selectedProvider === "brevo" ? brevo : resend;

  return {
    provider: selectedProvider,
    providerSource: provider,
    apiKey: api.value,
    from: from.value,
    apiKeyEnv: api.key,
    fromEnv: from.key,
    resendApiKeyEnv: resend.key,
    brevoApiKeyEnv: brevo.key
  };
};

const sanitizeHeaderValue = (value, label) => {
  const normalized = normalizeEnvValue(value);

  if (!normalized) {
    return "";
  }

  if (/[^\t\x20-\x7e]/.test(normalized)) {
    const error = new Error(
      `${label} contains invalid characters. Re-enter the environment variable in Render as a single-line value.`
    );
    error.code = "OTP_MAIL_CONFIG_INVALID_HEADER";
    throw error;
  }

  return normalized;
};

const sendViaResend = async ({ apiKey, from, to, otp, signal }) => {
  const response = await fetch("https://api.resend.com/emails", {
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
    signal
  });

  if (response.ok) {
    return;
  }

  const responseText = await response.text();
  const resendMessage = (() => {
    try {
      const parsed = JSON.parse(responseText);
      return parsed.message || parsed.error || "";
    } catch (_error) {
      return "";
    }
  })();

  const combinedMessage = `${resendMessage} ${responseText}`.toLowerCase();

  if (
    response.status === 403 &&
    combinedMessage.includes("you can only send testing emails to your own email address")
  ) {
    const error = new Error(
      "Resend account is in testing mode. Verify a domain in Resend and set EMAIL_FROM to an address on that verified domain."
    );
    error.code = "OTP_MAIL_RESEND_TEST_MODE";
    throw error;
  }

  if (response.status === 403 && combinedMessage.includes("verify a domain")) {
    const error = new Error(
      "Resend sender is not verified. Verify your sending domain and use a matching EMAIL_FROM address."
    );
    error.code = "OTP_MAIL_RESEND_DOMAIN_UNVERIFIED";
    throw error;
  }

  const error = new Error(`Resend API error: ${response.status} ${responseText}`);
  error.code = "OTP_MAIL_RESEND_API_ERROR";
  throw error;
};

const sendViaBrevo = async ({ apiKey, from, to, otp, signal }) => {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      sender: { email: from },
      to: [{ email: to }],
      subject: "Your OTP Code",
      htmlContent: `
        <h2>Your OTP Code</h2>
        <p>Your verification code is:</p>
        <h1>${otp}</h1>
        <p>This code expires in 5 minutes.</p>
      `
    }),
    signal
  });

  if (response.ok) {
    return;
  }

  const responseText = await response.text();
  const error = new Error(`Brevo API error: ${response.status} ${responseText}`);
  error.code = "OTP_MAIL_BREVO_API_ERROR";
  throw error;
};

const sendOtpEmail = async ({ to, otp }) => {
  const { provider, apiKey, from } = getMailConfig();

  if (!apiKey) {
    const expectedKeys =
      provider === "brevo" ? BREVO_API_KEY_ENV_KEYS : RESEND_API_KEY_ENV_KEYS;

    const error = new Error(
      `Missing ${provider} API key. Set one of: ${expectedKeys.join(", ")}`
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

  const safeApiKey = sanitizeHeaderValue(apiKey, `${provider.toUpperCase()} API key`);
  const safeFrom = sanitizeHeaderValue(from, "EMAIL_FROM");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    if (provider === "brevo") {
      return await sendViaBrevo({ apiKey: safeApiKey, from: safeFrom, to, otp, signal: controller.signal });
    }

    return await sendViaResend({ apiKey: safeApiKey, from: safeFrom, to, otp, signal: controller.signal });
  } catch (error) {
    if (error.name === "AbortError") {
      const timeoutError = new Error(`${provider} API timeout after 10 seconds`);
      timeoutError.code = "OTP_MAIL_PROVIDER_TIMEOUT";
      throw timeoutError;
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
};

module.exports = { sendOtpEmail, getMailConfig };