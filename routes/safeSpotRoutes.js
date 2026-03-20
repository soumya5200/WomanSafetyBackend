const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/nearby", async (req, res) => {
  try {
    const { lat, lng, type = "All" } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: "lat & lng required" });
    }

    const radius = 3000;
    let amenityQuery = "";

    /* ================= FILTER QUERY ================= */
    if (type !== "All") {
      if (type === "Public") {
        amenityQuery = `
          node["leisure"~"park|playground"](around:${radius},${lat},${lng});
          node["amenity"~"marketplace|community_centre"](around:${radius},${lat},${lng});
          node["shop"="mall"](around:${radius},${lat},${lng});
          node["highway"="bus_stop"](around:${radius},${lat},${lng});
        `;
      } else {
        amenityQuery = `
          node["amenity"="${type.toLowerCase()}"](around:${radius},${lat},${lng});
          way["amenity"="${type.toLowerCase()}"](around:${radius},${lat},${lng});
          relation["amenity"="${type.toLowerCase()}"](around:${radius},${lat},${lng});
        `;
      }
    } else {
      amenityQuery = `
        node["amenity"="police"](around:${radius},${lat},${lng});
        node["amenity"="hospital"](around:${radius},${lat},${lng});
        node["leisure"="park"](around:${radius},${lat},${lng});
        node["highway"="bus_stop"](around:${radius},${lat},${lng});
      `;
    }

    const query = `
      [out:json][timeout:25];
      (
        ${amenityQuery}
      );
      out center;
    `;

    const response = await axios.post(
      "https://overpass.kumi.systems/api/interpreter",
      query,
      { headers: { "Content-Type": "text/plain" } }
    );

    const elements = response.data?.elements || [];

    /* ================= NORMALIZE DATA ================= */
    const spots = elements
      .map((item) => {
        const latVal = item.lat || item.center?.lat;
        const lngVal = item.lon || item.center?.lon;
        if (!latVal || !lngVal) return null;

        let normalizedType = "Public";

        if (item.tags?.amenity === "police") normalizedType = "Police";
        else if (item.tags?.amenity === "hospital") normalizedType = "Hospital";

        return {
          _id: `${item.type}-${item.id}`,
          name: item.tags?.name || "Unknown Place",
          type: normalizedType,
          location: {
            lat: latVal,
            lng: lngVal,
          },
        };
      })
      .filter(Boolean);

    res.json(spots);
  } catch (err) {
    console.error("SafeSpots error:", err.message);
    res.status(500).json({ message: "Backend error" });
  }
});

module.exports = router;
