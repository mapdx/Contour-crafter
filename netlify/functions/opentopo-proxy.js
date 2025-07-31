const fetch = require("node-fetch");

exports.handler = async function(event) {
  try {
    const { locations } = JSON.parse(event.body);

    if (!Array.isArray(locations)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid locations array." })
      };
    }

    // Convert array of { latitude, longitude } objects to a pipe-separated string
    const formatted = locations
      .map(pt => `${pt.latitude},${pt.longitude}`)
      .join("|");

    console.log("🛰 Sending formatted locations string:", formatted);

    const response = await fetch("https://api.opentopodata.org/v1/mapzen", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locations: formatted })
    });

    const text = await response.text();
    console.log("📩 OpenTopo raw response:", text);

    const data = JSON.parse(text);

    if (!data.results || data.results.length === 0) {
      throw new Error("No elevation data returned from OpenTopo");
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };

  } catch (err) {
    console.error("❌ Error in opentopo-proxy:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || "Unknown error" })
    };
  }
};
