const fetch = require("node-fetch");

exports.handler = async (event) => {
  try {
    const { locations } = JSON.parse(event.body);

    if (!Array.isArray(locations)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid locations" })
      };
    }

    const apiUrl = "https://api.opentopodata.org/v1/etopo1";
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locations })
    });

    const data = await response.json();

    if (!data || !data.results) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "No data returned from OpenTopoData" })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error("Function error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error", details: error.message })
    };
  }
};
