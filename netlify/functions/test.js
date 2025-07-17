export async function handler() {
  const result = await sql`SELECT version()`;
  res.json(result[0]);
}
