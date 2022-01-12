import { MongoClient } from "https://deno.land/x/mongo@v0.29.0/mod.ts";
import  password  from '../../password.ts'

const client = new MongoClient();
  
// Connect using srv url + password 
await client.connect(
    `mongodb+srv://deno:${password}@denobackend.vgbvb.mongodb.net/DenoBackend?authMechanism=SCRAM-SHA-1`,
  );

const db = client.database('notes');

export default db;