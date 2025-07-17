import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export async function handler() {
  try {
    await sql`SELECT 1 AS connected`; // lightweight test query
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false }),
    };
  }
}