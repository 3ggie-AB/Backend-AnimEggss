require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;
const MAL_CLIENT_ID = process.env.MAL_CLIENT_ID;

app.use(cors()); // agar bisa diakses dari React Native

app.get("/", async (req, res) => {
  let { year, season, limit, offset } = req.query;
  offset = offset || 0;
  limit = parseInt(limit) || 50;

  const now = new Date();
  if(!year){
      year = now.getFullYear();
  }
  if (!season) {
    const month = now.getMonth() + 1;
  
    if (month >= 3 && month <= 5) {
      season = 'spring';
    } else if (month >= 6 && month <= 8) {
      season = 'summer';
    } else if (month >= 9 && month <= 11) {
      season = 'fall';
    } else {
      season = 'winter';
    }
  }

  console.log('Request Endpoint "/" :',year, season, limit);

  try {
    const response = await axios.get(
      `https://api.myanimelist.net/v2/anime/season/${year}/${season}?limit=${limit}&offset=${offset}`,
      {
        headers: {
          "X-MAL-CLIENT-ID": MAL_CLIENT_ID,
        },
      }
    );

    res.json(response.data);
    console.log(response.data);
  } catch (error) {
    console.error("Error fetching data from MAL:", error.message);
    res.status(500).json({ error: "Failed to fetch anime data from MAL" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
