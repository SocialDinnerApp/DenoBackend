import {Context} from "https://deno.land/x/oak/mod.ts";
import { verify } from "https://deno.land/x/djwt/mod.ts";
import key from "../../key.ts";

export class GetId {

    // return specific objectId of organizer
    public async objectId(headers: Headers, ctx: Context) {

        // make sure that authorization is not null
        const authorization = headers.get("Authorization");
        console.log(authorization)
        if (!authorization) {
        ctx.response.status = 401;
        return;
        }
        
        const jwt = authorization.split(" ")[1];
        const payload = await verify(jwt, key);
        const organizerId = payload._id
        
        return organizerId;
    }
}