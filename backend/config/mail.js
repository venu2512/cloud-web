const { Resend } = require("resend");


const resend = new Resend(process.env.re_DjqCNHJa_8gpmpfpzDqBrs7JTaNedSksZ);

const sendOTP = async (email, otp) => {
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Your OTP Code",
      html: `
        <h2>Your OTP Code</h2>
        <p>Your verification code is:</p>
        <h1>${otp}</h1>
        <p>This code expires in 5 minutes.</p>
      `,
    });

    console.log("OTP email sent");
  } catch (error) {
    console.error("Email send error:", error);
    throw error;
  }
};

module.exports = sendOTP;