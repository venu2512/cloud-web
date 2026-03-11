const https = require("https");

const sendMail = ({ to, subject, html }) => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      sender: { name: "CloudNova", email: "venu25122005@gmail.com" },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    });

    const options = {
      hostname: "api.brevo.com",
      path: "/v3/smtp/email",
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data),
        "api-key": process.env.BREVO_API_KEY,  // ← moved to .env
      },
    };

    const req = https.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => body += chunk);
      res.on("end", () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(body);
        } else {
          reject(new Error(`Brevo API error: ${res.statusCode} ${body}`));
        }
      });
    });

    req.on("error", reject);
    req.write(data);
    req.end();
  });
};

const transporter = {
  sendMail: ({ from, to, subject, html }) => sendMail({ to, subject, html }),
};

module.exports = transporter;