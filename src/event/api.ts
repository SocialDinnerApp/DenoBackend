import {Context} from "https://deno.land/x/oak/mod.ts";
import { Bson } from "https://deno.land/x/mongo@v0.29.0/mod.ts";
import db from "../../mongodb/mongodb.ts";
import { Event } from "./event.ts";
import { GetId } from '../helper/get_objectId.ts'

export class EventAPI {

  // mongodb collection
  eventCollection = db.collection<Event>("events");

  // helper class
  getId = new GetId()
  
  // get all events corresponding to particular user 
  public getAllEvents = async (ctx: Context) => {

    const headers: Headers = ctx.request.headers;
    const organizerId = await this.getId.objectId(headers, ctx)

    const events = await this.eventCollection.find({organizer: organizerId}, { noCursorTimeout: false }).toArray();
    
    if (events.length == 0) {
        ctx.response.status = 404,
        ctx.response.body = "Error: no events found."
    } else {
      ctx.response.status = 201;
      ctx.response.body = events;
    }
  }
  
  // get one event by its objectId
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

  // create one event 
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
    const organizerId = await this.getId.objectId(headers, ctx)

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
