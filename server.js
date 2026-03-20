process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const express = require("express");
const errorHandler = require("./middlewares/errorHandler");
const connectDB = require("./database/db");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const incRoutes = require("./routes/incidentRoutes");
const emergencyRoutes = require("./routes/emergencyRoutes");
const chatRoutes = require('./routes/chatRoutes');
const tripRoutes = require('./routes/tripRoutes');
const sosRoutes = require('./routes/sosRoutes');
const locationRoutes = require('./routes/locationRoutes');
const safeSpotRoutes = require("./routes/safeSpotRoutes");

// ✅ ADD THIS
//const incidentEvidenceRoutes = require("./routes/incidentEvidenceRoutes");

require("dotenv").config();

const app = express();
const port = process.env.PORT;

app.use(express.json());

// ✅ ADD THIS (STATIC UPLOADS)
app.use("/uploads", express.static("uploads"));

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.options("*", cors());

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/incidents", incRoutes);
app.use("/api/v1/emergency", emergencyRoutes);
app.use("/api/v1/chats", chatRoutes);
app.use("/api/v1/trips", tripRoutes);
app.use("/api/v1/sos", sosRoutes);
app.use("/api/v1/location", locationRoutes);
app.use("/api/v1/safespots", safeSpotRoutes);
// ✅ ADD THIS
//app.use("/api/v1/evidence", incidentEvidenceRoutes);

// Error handler (LAST)
app.use(errorHandler);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`Server started on ${port}`);
      console.log(`Mongo Connected!!!`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();