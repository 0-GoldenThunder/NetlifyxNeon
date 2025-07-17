import { sql } from "../../lib/db.js";

export async function handler(event) {
  const { username, email, password } = JSON.parse(event.body);
  await sql`INSERT INTO users (username, email, password) VALUES (${username}, ${email}, ${password})`;
  return { statusCode: 201, body: JSON.stringify({ success: true }) };
}
