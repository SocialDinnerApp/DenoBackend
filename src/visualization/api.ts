import { Context } from "https://deno.land/x/oak/mod.ts";
import { Bson, Collection } from "https://deno.land/x/mongo@v0.29.0/mod.ts";
import { verify } from "https://deno.land/x/djwt/mod.ts";
import { format } from "https://deno.land/std@0.91.0/datetime/mod.ts";
import db from "../mongodb/mongodb.ts";
import { Event } from "../event/event.ts";
import key from "../../key.ts";

export class API {
  // mongodb collections
  eventCollection = db.collection<Event>("events");
  participantCollection = db.collection("participant");
  event_participation = db.collection("event_participation");

  // retriev revenue from registered participations
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

    const events = await this.eventCollection
      .find({ organizer: organizerId }, { noCursorTimeout: false })
      .toArray();

    let organizer_revenue: any = [];

    let revenue = 0;
    for (const event of events) {
      const _event = event._id;
      let fee = event.fee;
      const docs = (await this.event_participation
        .aggregate([
          { $match: { eventId: _event.toString() } },
          { $group: { _id: "$name", total: { $sum: 1 } } },
        ])
        .toArray()) as any;
      if (Object.keys(docs).length != 0) {
        let count = docs[0].total;
        revenue = revenue + fee * count;
      } else {
        continue;
      }
    }

    let dict = { revenue: revenue };
    organizer_revenue.push(dict);

    ctx.response.status = 200
    ctx.response.body = {
      data: organizer_revenue,
    };
  };

  // return last seven (or less) from organizer created events
  public partLastSevenEvents = async (ctx: Context) => {
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

    const events = await this.eventCollection
      .find({ organizer: organizerId }, { noCursorTimeout: false })
      .sort({ datetime_created: -1 })
      .toArray();

    let last_events;
    if (events.length >= 8) {
      last_events = events.slice(0, 7);
    } else {
      last_events = events;
    }

    let relevant_information: any = [];

    for (const event of last_events) {
      let _event = event._id;
      let fee = event.fee;
      const docs = (await this.event_participation
        .aggregate([
          { $match: { eventId: _event.toString() } },
          { $group: { _id: "$name", total: { $sum: 1 } } },
        ])
        .toArray()) as any;
      if (Object.keys(docs).length != 0) {
        let count = docs[0].total;
        let revenue = fee * count;
        let dict = {
          eventId: _event.toString(),
          name: event.name,
          value: revenue,
        };
        relevant_information.push(dict);
      } else {
        let dict = { eventId: _event.toString(), name: event.name, value: 0 };
        relevant_information.push(dict);
      }
    }
    ctx.response.body = {
      data: relevant_information,
    };
  };

  // get current participations for specific event & return number of participants for the last 30 days in five days steps
  public partSingleEvent = async ({
    params,
    response,
  }: {
    params: { id: string };
    response: any;
  }) => {
    let eventId = params.id;
    const participants = await this.event_participation
      .find({ eventId: eventId }, { noCursorTimeout: false })
      .toArray();

    let today = new Date();
    const newDate = new Date(today);
    let date_before = new Date(newDate.setDate(newDate.getDate() - 30));

    let participations: any = [];
    let dates: any = [];

    for (let count = 0; count < 30; ) {
      var participant_count = 0;
      for (let i = 1; i < 6; i++) {
        var docs = (await this.event_participation
          .aggregate([
            {
              $match: {
                datetime_created: format(date_before, "yyyy-MM-dd"),
                eventId: eventId,
              },
            },
            { $group: { _id: "$name", total: { $sum: 1 } } },
          ])
          .toArray()) as any;
        if (Object.keys(docs).length != 0) {
          let count = docs[0].total;
          participant_count += count * 2;
          date_before = new Date(newDate.setDate(newDate.getDate() + 1));
        } else {
          date_before = new Date(newDate.setDate(newDate.getDate() + 1));
          participant_count += 0;
        }
      }
      count += 5;
      let converted_date = format(date_before, "dd.MM.yyyy");
      dates.push(converted_date);
      participations.push(participant_count);
    }

    response.body = {
      participations: participations,
      dates: dates,
    };
  };
}