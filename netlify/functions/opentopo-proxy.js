const fetch = require('node-fetch');

module.exports.handler = async function (event, context) {
  try {
    const { locations } = JSON.parse(event.body);

    if (!Array.isArray(locations) || locations.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No locations provided" }),
      };
    }

    // Format locations as LAT,LON|LAT,LON|...
    const queryString = locations
      .map((loc) => {
        const [lat, lon] = loc.split(",");
        return `${parseFloat(lat)},${parseFloat(lon)}`;
      })
      .join("|");

    const url = `https://api.opentopodata.org/v1/mapzen?locations=${encodeURIComponent(queryString)}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`OpenTopoData API error: ${response.statusText}`);
    }

    const result = await response.json();

    if (!result.results || result.results.length === 0) {
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
    console.error("Function error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error", detail: error.message }),
    };
  }
};
