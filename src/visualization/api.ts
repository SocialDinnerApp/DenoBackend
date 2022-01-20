import {Context, helpers, RouterContext} from "https://deno.land/x/oak/mod.ts";
import { Bson, Collection } from "https://deno.land/x/mongo@v0.29.0/mod.ts";
import { verify, decode } from "https://deno.land/x/djwt/mod.ts";
import { parse } from "https://deno.land/std@0.95.0/datetime/mod.ts";
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

    let event_revenue: any = []

    for (const event of events) {
      let _event = event._id
      let fee = event.fee
      const docs = await this.event_participation.aggregate([
          { $match: { eventId:  _event.toString()} },
          { $group: { _id: "$name", total: { $sum: 1 } } },]).toArray() as any;
          let count = docs[0].total
      let revenue = fee*count
      let dict = {eventId: _event.toString(), value: revenue}
      event_revenue.push(dict) 
    }

    ctx.response.body = {
      data: event_revenue
     }
  }

  public lastSevenEvents = async (ctx: Context) => {
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

    const events = await this.eventCollection.find({organizer: organizerId}, { noCursorTimeout: false }).sort({datetime_created: -1}).toArray();
    
    const last_events = events.slice(0,3)


    let relevant_information: any = []

    for (const event of last_events) {
      let _event = event._id
      let fee = event.fee
      const docs = await this.event_participation.aggregate([
        { $match: { eventId:  _event.toString()} },
        { $group: { _id: "$name", total: { $sum: 1 } } },]).toArray() as any;
        if(Object.keys(docs).length != 0){
          console.log("HIER", docs)
          let count = docs[0].total
          let revenue = fee*count
          let dict = {eventId: _event.toString(), name: event.name, value: revenue}
          relevant_information.push(dict) 
        } else {
          let dict = {eventId: _event.toString(), name: event.name, value: 0}
          relevant_information.push(dict) 
        
      
    }


    ctx.response.body = {
      data: relevant_information
     }
    }
  }
}

