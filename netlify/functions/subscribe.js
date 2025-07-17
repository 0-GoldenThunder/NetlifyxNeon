export async function handler(event) {
  const method = event.httpMethod;
  const body = JSON.parse(event.body);

  if (method === "POST") {
    console.log("Subscribed to notifications:", body);
    return { statusCode: 200, body: JSON.stringify({ subscribed: true }) };
  } else if (method === "DELETE") {
    console.log("Unsubscribed from:", body.endpoint);
    return { statusCode: 200, body: JSON.stringify({ unsubscribed: true }) };
  }

  return { statusCode: 405, body: "Method Not Allowed" };
}
