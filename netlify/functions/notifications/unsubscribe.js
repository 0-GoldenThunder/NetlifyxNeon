export async function handler(event) {
  let payload;

  try {
    payload = JSON.parse(event.body); // ✅ read once
  } catch (err) {
    console.error("❌ JSON parse error:", err.message);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON payload" }),
    };
  }

  const { endpoint } = payload;

  if (!endpoint) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing required field: endpoint" }),
    };
  }

  try {
    // Simulate DB removal or log
    console.log("🔕 Unsubscribing:", endpoint);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Unsubscription successful" }),
    };
  } catch (err) {
    console.error("📛 Unsubscription error:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error", reason: err.message }),
    };
  }
}
