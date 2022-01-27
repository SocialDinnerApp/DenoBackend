import {Context, helpers, RouterContext} from "https://deno.land/x/oak/mod.ts";
import { Bson } from "https://deno.land/x/mongo@v0.29.0/mod.ts";
import { verify, decode } from "https://deno.land/x/djwt/mod.ts";
import db from "../mongodb/mongodb.ts";
import { Event } from "./event.ts";
import key from "../../key.ts";


export class EventAPI {

  // mongodb collection
  eventCollection = db.collection<Event>("events");

  // get all events corressponding to particular user 
  public getAllEvents = async (ctx: Context) => {

    const headers: Headers = ctx.request.headers;

    // make sure that authorization is not null
    const authorization = headers.get("Authorization");
    if (!authorization) {
      ctx.response.status = 401;
      return;
    }

    const jwt = authorization.split(" ")[1];
    const payload = await verify(jwt, key);
    const organizerId = payload._id;

    const events = await this.eventCollection.find({organizer: organizerId}, { noCursorTimeout: false }).toArray();
    
    if (events.length == 0) {
        ctx.response.status = 404,
        ctx.response.body = "Error: no events found."
    } else {
      ctx.response.status = 201;
      ctx.response.body = events;
    }
    
    // events.forEach(function (user: any) {
    //   delete user._id;
    // });
  }
  
  public getSingleEvent = async ({params,response}: {params: { id: string }; response: any}) => {

    const objectId = params.id;
    
    const event = await this.eventCollection.findOne( { _id: new Bson.ObjectId(objectId) }, { noCursorTimeout: false });

    if (!event) {
      return { status: 404, value: "Error: Event not found." };
    } else {
      response.status = 200
      response.body = event
    }
  }

  public createEvent = async (ctx: Context) => {

    const {
      name,
      description,
      date,
      time_starter,
      time_main,
      time_dessert,
      city,
      zip_code,
      fee,
      max_participants,
      registration_deadline,
    } = await ctx.request.body().value;

    const headers: Headers = ctx.request.headers;
    const authorization = headers.get("Authorization");

    // to make sure that authorization is not null
    if (!authorization) {
      ctx.response.status = 401;
      return;
    }

    const jwt = authorization.split(" ")[1];
    const payload = await verify(jwt, key);
    const organizerId = payload._id;

    const event = {
      name,
      description,
      organizer: organizerId,
      date,
      time_starter,
      time_main,
      time_dessert,
      city,
      zip_code,
      fee,
      max_participants,
      registration_deadline,
      datetime_created: new Date(),
      datetime_updated: new Date(),
    };

    // const events = await eventCollection.findOne({_id: id}, { noCursorTimeout: false}) as Partial<User>;
    const id = await this.eventCollection.insertOne(event);
    ctx.response.status = 201;
    ctx.response.body = event;
  };

  // update event information
  public updateEvent = async ({params,response,request,}: {params: { id: string }; response: any; request: any; }) => {

    const objectId = params.id;
    const { title, body } = await request.body().value;
    
    const updatedEvent = await this.eventCollection.updateOne(
      { _id: new Bson.ObjectId(objectId) },
      { $set: { title, body } }
    );

    response.status = 200;
    response.body = updatedEvent;
  };
}
