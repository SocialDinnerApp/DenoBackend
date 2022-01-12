import { Context, helpers, RouterContext} from "https://deno.land/x/oak/mod.ts";
import { Bson, Collection} from "https://deno.land/x/mongo@v0.29.0/mod.ts";
import db from '../mongodb/mongodb.ts'

export enum UserManagerResponseStatus {
  OK,
  ERROR,
  NOT_FOUND,
  INVALID_DATA,
  CONFLICT_ID,
}

export interface UserManagerResponse {
  status: UserManagerResponseStatus;
  value?: any | undefined;
}

export class EventAPI {

  // events = eventCollection
  eventCollection = db.collection('events')

  // Get Events
  public async getAllEvents() {

    if(!this.eventCollection) {
      return { status: UserManagerResponseStatus.ERROR, value: "Error fetching users from database."};
    }
    const events = await this.eventCollection.find({}, { noCursorTimeout: false}).toArray();
    events.forEach(function(user: any) {
      delete user._id;
    });
    return {status: UserManagerResponseStatus.OK, value: events};
  }
  

  public async getSingleEvent(eventId: string){

    const event = await this.eventCollection.findOne({_id: new Bson.ObjectId(eventId)}, { noCursorTimeout: false});
    console.log(event)

    if(!event) {
      return { status: 404, value: "Error: Event not found." };
    } else {
      return { status: UserManagerResponseStatus.OK, value: event};
    }
  };


  public createEvent = async(ctx: Context) => {
    const { name, body } = await ctx.request.body().value;
    const event: any = {
              name,
              body
            }
    const id = await this.eventCollection.insertOne(event);
    event._id = id; 
    ctx.response.status = 201
    ctx.response.body = event
    console.log(id)
  }

    
}