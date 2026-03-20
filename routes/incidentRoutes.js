// backend/routes/incidentRoutes.js
const express = require("express");
const router = express.Router();

// Middlewares
const validateToken = require("../middlewares/validateToken");
const upload = require("../middlewares/upload");

// Controller functions
const {
  addIncident,
  getAllIncidents,
  acknowledgeInc,
  updateIncidentStatus,
} = require("../controllers/incidentCntrl");

// ================= MAIN ROUTES =================
router
  .route("/")
  .post(
    validateToken,
    upload.array("notes", 5),
    addIncident
  )
  .get(validateToken, getAllIncidents);

router.route("/:id").patch(validateToken, acknowledgeInc);
router.patch("/:id/status", validateToken, updateIncidentStatus);

// ================= TEST UPLOAD ROUTE =================
// ⚠️ SIRF TEST KE LIYE – PRODUCTION ME HATA DENA
router.post(
  "/test-upload",
  upload.array("notes", 5),
  (req, res) => {
    console.log("FILES 👉", req.files);
    console.log("BODY 👉", req.body);

    res.json({
      success: true,
      filesCount: req.files?.length || 0,
      files: req.files,
    });
  }
);

module.exports = router;