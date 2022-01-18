import {Context, helpers, RouterContext} from "https://deno.land/x/oak/mod.ts";
import { Bson, Collection } from "https://deno.land/x/mongo@v0.29.0/mod.ts";
import { verify, decode } from "https://deno.land/x/djwt/mod.ts";
import db from "../mongodb/mongodb.ts";
import { Event } from "../event/event.ts";
import key from "../../key.ts";

export class API {

  // mongodb collection
  eventCollection = db.collection<Event>("events");
  participantCollection = db.collection("participant")
  event_participation = db.collection("event_participation")


  public getAllParticipants = async (ctx: Context) => {
    const headers: Headers = ctx.request.headers;

    // to make sure that authorization is not null
    const authorization = headers.get("Authorization");
    if (!authorization) {
      ctx.response.status = 401;
      return;
    }

    const jwt = authorization.split(" ")[1];
    const payload = await verify(jwt, key);
    const organizerId = payload._id;


    const events = await this.eventCollection.find({organizer: organizerId}, { noCursorTimeout: false }).toArray();

    let test: { eventId: string; value: number; }[] = []
    events.forEach(async event => {
      let _event = event._id
      let fee = event.fee
      const docs = await this.event_participation.aggregate([
      { $match: { eventId:  _event.toString()} },
      { $group: { _id: "$name", total: { $sum: 1 } } },]).toArray() as any;
      let count = docs[0].total
      let revenue = fee*count
      
      let dict = {eventId: _event.toString(), value: revenue}
      test.push(dict) 
      console.log(test)
      // const participant_count = await this.event_participation.countDocuments({ eventId: _event.toString() });
    })


    ctx.response.body = {
      data: test
     }
  }
}