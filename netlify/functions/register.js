import { sql } from "../../lib/db.js";

export async function handler(event) {
  const { username, email, password } = JSON.parse(event.body);

  try {
    await sql`INSERT INTO users (username, email, password) VALUES (${username}, ${email}, ${password})`;
    return {
      statusCode: 201,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message, message: "register problem"}) };
  }
}
