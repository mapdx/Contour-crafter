exports.handler = async (event) => {
  try {
    const { locations } = JSON.parse(event.body);

    if (!Array.isArray(locations)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid 'locations' format. Must be an array." })
      };
    }

    const apiUrl = "https://api.opentopodata.org/v1/etopo1";

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locations })
    });

    const raw = await response.text(); // ← fetch as text first to inspect
    console.log("OpenTopoData raw response:", raw);

    let data;
    try {
      data = JSON.parse(raw);
    } catch (parseError) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to parse OpenTopoData response", raw })
      };
    }

    if (!data || !Array.isArray(data.results)) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "No results returned from OpenTopoData", raw })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };

  } catch (error) {
    console.error("OpenTopo Proxy Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error", details: error.message })
    };
  }
};
