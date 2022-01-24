import {Context, helpers, RouterContext} from "https://deno.land/x/oak/mod.ts";
import { Bson } from "https://deno.land/x/mongo@v0.29.0/mod.ts";
import { verify, decode } from "https://deno.land/x/djwt/mod.ts";
import db from "../mongodb/mongodb.ts";
import { Event } from "./event.ts";
import key from "../../key.ts";

export enum ResponseStatus {
  OK,
  ERROR,
  NOT_FOUND,
  INVALID_DATA,
  CONFLICT_ID,
}

export interface EventResponse {
  status: ResponseStatus;
  value?: any | undefined;
}

export class EventAPI {
  // mongodb collection
  eventCollection = db.collection<Event>("events");

  // Get Events
  public getAllEvents = async (ctx: Context) => {

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


    if (!this.eventCollection) {
      return {
        status: ResponseStatus.ERROR,
        value: "Error fetching users from database.",
      };
    }
    const events = await this.eventCollection.find({organizer: organizerId}, { noCursorTimeout: false }).toArray();
    
    // events.forEach(function (user: any) {
    //   delete user._id;
    // });
    console.log(events)
    ctx.response.status = 201;
    ctx.response.body = events;
  }

  public async getSingleEvent(eventId: string) {
    const event = await this.eventCollection.findOne(
      { _id: new Bson.ObjectId(eventId) },
      { noCursorTimeout: false }
    );

    if (!event) {
      return { status: 404, value: "Error: Event not found." };
    } else {
      return { status: ResponseStatus.OK, value: event };
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

  public updateEvent = async ({
    params,
    response,
    request,
  }: {
    params: { id: string };
    response: any;
    request: any;
  }) => {
    // Searches for a particular event in the DB
    const objectId = params.id;
    const { title, body } = await request.body().value;
    const updatedEvent = await this.eventCollection.updateOne(
      { _id: new Bson.ObjectId(objectId) },
      { $set: { title, body } }
    );
    // If found, respond with updating the event. If not, respond with a 404
    response.status = 200;
    response.body = updatedEvent;
  };

  public getOrganizerEvents = async (ctx: Context) => {

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
    // console.log(organizerId)

    //user._id.toString()

    // to search param
    // const searchParam = await ctx.request.url.searchParams.get('s');

    // if (searchParam) {
    //   options = {
    //     title: new RegExp(searchParam.toString(), 'i')
    //   }
    // }

    // const jwt = authorization.split(' ')[1];
    // const payload = await verify(jwt, key);
    // const organizerId = payload._id

    console.log(organizerId);
    const events = await this.eventCollection.find({ organizer: organizerId }, { noCursorTimeout: false }).toArray();
    console.log(events);

    ctx.response.body = {
      message: "success",
      data: events,
    };
  };
}
