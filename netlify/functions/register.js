import { sql } from "../../lib/db.js";

export async function handler(event) {
  const { name, email, password } = JSON.parse(event.body);
  await sql`INSERT INTO users (name, email, password) VALUES (${name}, ${email}, ${password})`;
  return { statusCode: 201, body: JSON.stringify({ success: true }) };
}
