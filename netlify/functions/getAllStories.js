import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL);

export async function handler() {
  try {
    const result = await sql`SELECT * FROM stories ORDER BY created_at DESC`;
    return {
      statusCode: 200,
      body: JSON.stringify({ listStory: result }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}