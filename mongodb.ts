import { MongoClient } from "https://deno.land/x/mongo@v0.29.0/mod.ts";
import  password  from "./password.ts"

const client = new MongoClient();

//password in ignore file
// await client.connect(
//     "mongodb+srv://deno:testpasswort@denobackend.vgbvb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
//   );

// client.connect("mongodb+srv://deno:testpasswort@denobackend.vgbvb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")

//const db = client.database('notes');

  
  // Connect using srv url
await client.connect(
    `mongodb+srv://deno:${password}@denobackend.vgbvb.mongodb.net/DenoBackend?authMechanism=SCRAM-SHA-1`,
  );

// await client.connect(
//   'mongodb+srv://deno:testpasswort@denobackend.vgbvb.mongodb.net/DenoBackend?authMechanism=SCRAM-SHA-1',
// );

const db = client.database('notes');

export default db;