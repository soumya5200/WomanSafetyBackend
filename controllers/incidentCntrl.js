const asyncHandler = require("express-async-handler");
const { Incident } = require("../models/incidentRptModel");

/* ================= ADD INCIDENT ================= */
const addIncident = asyncHandler(async (req, res) => {
  const { report, pincodeOfIncident, address } = req.body;
  console.log("REQ.BODY:", req.body);
  console.log("REQ.FILES:", req.files);

  if (!report || !pincodeOfIncident || !address) {
    res.status(400);
    throw new Error("All fields are required");
  }

  let mediaUrls = [];

  // ✅ MULTIPLE FILES (LOCAL STORAGE)
  if (req.files && req.files.length > 0) {
    mediaUrls = req.files.map((file) => `/uploads/${file.filename}`);
  }

  await Incident.create({
    user: req.user.id,
    report,
    pincodeOfIncident,
    address,
    mediaSt: mediaUrls, // ✅ array
  });

  res.status(201).json({
    message: "Incident reported successfully",
  });
});

/* ================= GET ALL INCIDENTS ================= */
const getAllIncidents = asyncHandler(async (req, res) => {
  const incidents = await Incident.find({})
    .populate("user", "uname")
    .sort({ createdAt: -1 });

  const data = incidents.map((x) => ({
    id: x._id,
    uname: x.user?.uname || "Unknown",
    report: x.report,
    address: x.address,
    pincode: x.pincodeOfIncident,
    images: x.mediaSt || [], // ✅ frontend yahin se lega
    isSeen: x.isSeen,
    status: x.status,
    createdAt: x.createdAt,
  }));

  res.status(200).json(data);
});

/* ================= ACKNOWLEDGE INCIDENT ================= */
const acknowledgeInc = asyncHandler(async (req, res) => {
  const incident = await Incident.findById(req.params.id);

  if (!incident) {
    res.status(404);
    throw new Error("Incident not found");
  }

  incident.isSeen = true;
  await incident.save();

  res.status(200).json({ message: "Incident acknowledged" });
});

/* ================= UPDATE INCIDENT STATUS ================= */
const updateIncidentStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!status) {
    res.status(400);
    throw new Error("Status is required");
  }

  const incident = await Incident.findById(req.params.id);
  if (!incident) {
    res.status(404);
    throw new Error("Incident not found");
  }

  incident.status = status;
  await incident.save();

  res.status(200).json({
    message: "Incident status updated successfully",
    status: incident.status,
  });
});

module.exports = {
  addIncident,
  getAllIncidents,
  acknowledgeInc,
  updateIncidentStatus,
};