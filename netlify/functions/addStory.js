import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL);

export async function handler(event) {
  const { description, photo_url, lat, lon } = JSON.parse(event.body);

  if (!description || !photo_url) {
    return { statusCode: 400, body: "Missing required fields" };
  }

  try {
    await sql`
      INSERT INTO stories (description, photo_url, lat, lon)
      VALUES (${description}, ${photo_url}, ${lat}, ${lon})
    `;
    return { statusCode: 201, body: JSON.stringify({ success: true }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
