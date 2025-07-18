import { sql } from "../../lib/db.js";

function generateGuestName() {
  return `guest_${Math.floor(1000 + Math.random() * 9000)}`;
}

export async function handler(event) {
  let body;

  try {
    body = JSON.parse(event.body);
  } catch (parseErr) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON payload" }),
    };
  }

  const { description, photo_url, lat, lon } = body;

  if (!description || !photo_url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing required fields: description or photo_url" }),
    };
  }

  try {
    const creator = generateGuestName();

    await sql`
      INSERT INTO stories (description, photo_url, lat, lon, creator)
      VALUES (${description}, ${photo_url}, ${lat}, ${lon}, ${creator})
    `;

    return {
      statusCode: 201,
      body: JSON.stringify({ success: true, creator }),
    };
  } catch (err) {
    console.error("📛 Database error:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Server error during story insertion",
        reason: err.message,
      }),
    };
  }
}
