export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Only POST requests allowed'
    };
  }

  try {
    const { locations } = JSON.parse(event.body);
    
    const response = await fetch('https://api.opentopodata.org/v1/etopo1';, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locations })
    });

    const data = await response.json(); // Already parsed

    // ✅ Return raw JSON — not stringified again
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data) // Just pass along OpenTopoData response
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Server error', detail: error.message })
    };
  }
}
