import sgMail from "@sendgrid/mail";

const sendEmail = async ({ to, subject, html }) => {
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    await sgMail.send({
      to,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject,
      html,
    });
  } catch (error) {
    console.error("Email sending failed:", error.message);
  }
};

export default sendEmail;