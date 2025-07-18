import { sql } from "../../lib/db.mjs";

export async function handler(event) {
  const { id } = JSON.parse(event.body);

  if (!id) return { statusCode: 400, body: "Missing story ID" };

  try {
    await sql`DELETE FROM stories WHERE id = ${id}`;
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
