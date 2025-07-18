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

  const { endpoint, keys } = payload;
  const { auth, p256dh } = keys || {};

  if (!endpoint || !auth || !p256dh) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing required subscription fields" }),
    };
  }

  try {
    // Simulate DB insert or log
    console.log("📬 Subscribing:", { endpoint, auth, p256dh });

    return {
      statusCode: 201,
      body: JSON.stringify({ success: true, message: "Subscription stored" }),
    };
  } catch (err) {
    console.error("📛 Subscription error:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error", reason: err.message }),
    };
  }
}
