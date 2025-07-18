import { sql } from "../../lib/db.js";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

export async function handler(event) {
  const token = event.headers.authorization?.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, SECRET);
    const creator = decoded.username || "unknown";

    const { description, photo_url, lat, lon } = JSON.parse(event.body);

    if (!description || !photo_url) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing required fields" }) };
    }

    await sql`
      INSERT INTO stories (description, photo_url, lat, lon, creator)
      VALUES (${description}, ${photo_url}, ${lat}, ${lon}, ${creator})
    `;

    return { statusCode: 201, body: JSON.stringify({ success: true }) };
  } catch (err) {
    return { statusCode: 401, body: JSON.stringify({ error: "Unauthorized or invalid token",  }) };
  }
}
