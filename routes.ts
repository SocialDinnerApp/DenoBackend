import { Context, helpers, RouterContext} from "https://deno.land/x/oak/mod.ts";
import db from './mongodb.ts';
import { v4 } from "https://deno.land/std/uuid/mod.ts";
import type {Event} from './event.ts'

const eventCollection = db.collection('events')

const getEvents = async ({ response }: { response: any }) => {
    try {
      // Find all quotes and convert them into an Array
      const allEvents = await eventCollection.find({}, { noCursorTimeout: false}).toArray();
      console.log(allEvents);
      if (allEvents) {
        response.status = 200;
        response.body = {
          success: true,
          data: allEvents,
        };
      } else {
        response.status = 500;
        response.body = {
          success: false,
          msg: "Internal Server Error",
        };
      }
    } catch (err) {
      response.body = {
        success: false,
        msg: err.toString(),
      };
    }
  };

const getSingleEvent = async(ctx: Context) => {
  
}

const createEvent = async (ctx: Context) => {
    const { title, body } = await ctx.request.body().value;
    const event: any = {
        id: v4.generate(),
        title,
        body,
        date: new Date()
    }
    const id = await eventCollection.insertOne(event);
    event._id = id; 
    ctx.response.status = 201
    ctx.response.body = event
    console.log(id)
}

export {getEvents, createEvent, getSingleEvent};