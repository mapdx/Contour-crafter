const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  try {
    const { locations } = JSON.parse(event.body);

    if (!Array.isArray(locations) || locations.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No locations provided" }),
      };
    }

    // Convert from array of strings like "45.47,-122.72" into single pipe-separated string
    const formatted = locations.map(pt => [pt.latitude, pt.longitude]);

        if (parts.length !== 2) return null;
        const lat = parseFloat(parts[0].trim());
        const lon = parseFloat(parts[1].trim());
        if (isNaN(lat) || isNaN(lon)) return null;
        return `${lat},${lon}`;
      })
      .filter(Boolean)
      .join("|");

    const url = `https://api.opentopodata.org/v1/srtm90m?locations=${encodeURIComponent(formattedLocations)}`;
    console.log("🔍 OpenTopo URL:", url);

    const response = await fetch(url);

    if (!response.ok) {
      const text = await response.text();
      console.error("🌩 OpenTopoData API Error:", response.status, text);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: "OpenTopoData fetch failed", detail: text }),
      };
    }

    const result = await response.json();

    if (!Array.isArray(result.results) || result.results.length === 0) {
      console.error("⚠️ No elevation results:", result);
      return {
        statusCode: 502,
        body: JSON.stringify({ error: "No elevation data returned from API" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error("🔥 Proxy function error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error", detail: error.message }),
    };
  }
};
