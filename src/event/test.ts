import { EventAPI } from "./api.ts";
import { assertEquals } from "https://deno.land/std@0.97.0/testing/asserts.ts";


// current number of events: 11
const numberEvents = 2

Deno.test("Test if number of events equals variable numberEvents", async () => {
  const new_getAllEvents = new EventAPI();
  const allEvents = await new_getAllEvents.getAllEvents;
  assertEquals(allEvents.apply.length , numberEvents)

});


