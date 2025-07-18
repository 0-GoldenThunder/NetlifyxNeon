import { sql } from "../../lib/db.mjs";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

export async function handler(event) {
  const { email, password } = JSON.parse(event.body);

  try {
    const result = await sql`SELECT * FROM users WHERE email = ${email}`;
    const user = result[0];

    if (!user || user.password !== password) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Invalid credentials" }),
      };
    }

    const token = jwt.sign(
      { username: user.username, userId: user.id },
      SECRET,
      { expiresIn: "1h" }
    );

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, username: user.username }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
