const express = require("express");
const router = express.Router();
const { sendHelpEmailContacts } = require("../utils/email");

// POST /api/v1/sos
router.post("/", async (req, res) => {
  const { lat, long, username, pincode, formatted_address } = req.body;

  try {
    const emergencyContacts = ["example1@gmail.com", "example2@gmail.com"]; // apke contacts
    for (const contact of emergencyContacts) {
      await sendHelpEmailContacts(contact, lat, long, username, pincode, formatted_address);
    }
    res.status(200).json({ message: "SOS emails sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending SOS emails" });
  }
});

module.exports = router;