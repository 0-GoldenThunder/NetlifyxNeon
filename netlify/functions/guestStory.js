import { sql } from "../../lib/db.js";

function generateGuestName() {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `guest_${random}`;
}

export async function handler(event) {
  try {
    const { description, photo_url, lat, lon } = JSON.parse(event.body);

    if (!description || !photo_url) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing required fields" }) };
    }

    const creator = generateGuestName();

    await sql`
      INSERT INTO stories (description, photo_url, lat, lon, creator)
      VALUES (${description}, ${photo_url}, ${lat}, ${lon}, ${creator})
    `;

    return { statusCode: 201, body: JSON.stringify({ success: true, creator }), event};
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) ,event};
  }
}
