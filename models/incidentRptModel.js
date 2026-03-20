const mongoose = require("mongoose");

const IncidentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    report: {
      type: String,
      required: true,
    },
    pincodeOfIncident: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    mediaSt: {
      type: [String], // S3 URL
      default: [],
    },
    status:{
      type: String,
      enum: ["Pending", "In Review", "Action Taken", "Resolved"],
      default: "Pending",
    },
    isSeen: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = {
  Incident: mongoose.model("Incident", IncidentSchema),
};