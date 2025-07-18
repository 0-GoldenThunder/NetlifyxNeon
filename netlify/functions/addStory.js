import { sql } from "../../lib/db.mjs";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, SECRET);
    return decoded?.username || null;
  } catch (err) {
    console.error("🔐 Token verification failed:", err.message);
    return null;
  }
}

export async function handler(event) {
  const token = event.headers.authorization?.replace("Bearer ", "");
  const creator = verifyToken(token);

  if (!creator) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Unauthorized or invalid token" }),
    };
  }

  let payload;

  try {
    payload = JSON.parse(event.body);
  } catch (parseErr) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON payload" }),
    };
  }

  const { description, photo_url, lat, lon } = payload;

  if (!description || !photo_url) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Missing required fields: description or photo_url",
      }),
    };
  }

  try {
    await sql`
      INSERT INTO stories (description, photo_url, lat, lon, creator)
      VALUES (${description}, ${photo_url}, ${lat}, ${lon}, ${creator})
    `;

    return {
      statusCode: 201,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        success: true,
        creator,
      }),
    };
  } catch (dbErr) {
    console.error("📛 Database error:", dbErr.message);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to insert story",
        reason: dbErr.message,
      }),
    };
  }
}
