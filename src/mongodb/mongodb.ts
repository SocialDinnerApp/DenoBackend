import { MongoClient } from "https://deno.land/x/mongo@v0.29.0/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";

// import  password  from '../../password.ts'
config({ export: true });

const client = new MongoClient();
  
// Connect using srv url + password 
await client.connect(
    `mongodb+srv://deno:${Deno.env.get("API_PASSWORD")}@denobackend.vgbvb.mongodb.net/DenoBackend?authMechanism=SCRAM-SHA-1`,
  );

const db = client.database('notes');

export default db;