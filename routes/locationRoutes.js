const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/reverse", async (req, res) => {
  const { lat, lon } = req.query;

  try {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/reverse",
      {
        params: {
          format: "json",
          lat,
          lon
        },
        headers: {
          "User-Agent": "SafeHer-App"
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Location fetch failed" });
  }
});

module.exports = router;