const nodemailer = require("nodemailer");
const crypto = require("crypto");

const {
  gmailContent,
  mapLocation,
  mapLocationNearby,
} = require("./emailTemplate");

// ✅ SIMPLE RANDOM TOKEN (NO CHANGE)
const generateverificationToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

// ===============================
// ✅ ETHEREAL TRANSPORTER (NO ACCOUNT)
// ===============================
const createTestTransporter = async () => {
  const testAccount = await nodemailer.createTestAccount();

  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

// ===============================
// ✅ VERIFICATION EMAIL (TEST MODE)
// ===============================
const sendVerificationEmail = async (recipientEmail, verificationToken) => {
  try {
    const transporter = await createTestTransporter();

    const emailcontent = gmailContent(verificationToken);

    const info = await transporter.sendMail({
      from: '"SafeHer" <verify@safeher.com>',
      to: recipientEmail || "test@ethereal.email",
      subject: "Email Verification",
      html: emailcontent,
    });

    console.log("✅ Verification email sent");
    console.log("📩 Preview URL:", nodemailer.getTestMessageUrl(info));

  } catch (error) {
    console.error("❌ Email error:", error);
  }
};

// ===============================
// 🚨 HELP EMAIL (SOS MAIN)
// ===============================
const sendHelpEmail = async (
  recipientEmail,
  lat,
  long,
  username,
  pincode,
  formatted_address
) => {
  try {
    const transporter = await createTestTransporter();

    const emailcontent = mapLocation(
      lat,
      long,
      username,
      pincode,
      formatted_address
    );

    const info = await transporter.sendMail({
      from: '"SafeHer SOS" <sos@safeher.com>',
      to: recipientEmail || "help@ethereal.email",
      subject: `${username} NEEDS HELP!!!`,
      html: emailcontent,
    });

    console.log("🚨 SOS Email sent");
    console.log("📩 Preview URL:", nodemailer.getTestMessageUrl(info));

  } catch (error) {
    console.error("❌ SOS Email error:", error);
  }
};

// ===============================
// 🚨 HELP EMAIL (NEARBY CONTACTS)
// ===============================
const sendHelpEmailContacts = async (
  recipientEmail,
  lat,
  long,
  username,
  pincode,
  formatted_address
) => {
  try {
    const transporter = await createTestTransporter();

    const emailcontent = mapLocationNearby(
      lat,
      long,
      username,
      pincode,
      formatted_address
    );

    const info = await transporter.sendMail({
      from: '"SafeHer SOS" <alert@safeher.com>',
      to: recipientEmail || "contact@ethereal.email",
      subject: `${username} NEEDS HELP!!!`,
      html: emailcontent,
    });

    console.log("🚨 SOS Contact Email sent");
    console.log("📩 Preview URL:", nodemailer.getTestMessageUrl(info));

  } catch (error) {
    console.error("❌ Contact Email error:", error);
  }
};

// ===============================
module.exports = {
  generateverificationToken,
  sendVerificationEmail,
  sendHelpEmail,
  sendHelpEmailContacts,
};