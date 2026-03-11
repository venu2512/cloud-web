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
        "api-key": "xsmtpsib-bae60318703930f2c5bcb56861af96640cb2a5e9e9dab0dc5e794c441f870303-LonuFiqpQAGhdi4L",
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

// Match nodemailer interface so auth.js doesn't need changes
const transporter = {
  sendMail: ({ from, to, subject, html }) => sendMail({ to, subject, html }),
};

module.exports = transporter;