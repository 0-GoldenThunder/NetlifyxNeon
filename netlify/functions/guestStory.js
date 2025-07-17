import { sql } from "../../lib/db.js";
import { IncomingForm } from "formidable";

export const config = {
  bodyParser: false, // disable default parser
};

export async function handler(event) {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm();

    form.parse(event, async (err, fields, files) => {
      if (err) {
        return resolve({
          statusCode: 500,
          body: JSON.stringify({ error: "Form parsing failed" }),
        });
      }

      const { description, lat, lon } = fields;
      const photo = files.photo; // contains file metadata

      // Insert into NeonDB with creator = guest_xxxx
      const creator = `guest_${Math.floor(1000 + Math.random() * 9000)}`;

      await sql`
        INSERT INTO stories (description, photo_url, lat, lon, creator)
        VALUES (${description}, ${photo?.filepath || "unknown"}, ${lat}, ${lon}, ${creator})
      `;

      resolve({
        statusCode: 201,
        body: JSON.stringify({ success: true, creator }),
      });
    });
  });
}
