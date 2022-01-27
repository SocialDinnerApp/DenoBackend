import { EventAPI } from "./api.ts";
import { assertEquals } from "https://deno.land/std@0.97.0/testing/asserts.ts";


// set "numberEvents" to the current existing number of events for a specific organizer
const numberEvents = 2
// Test getAllEvents functionality
Deno.test("Test if number of events equals variable numberEvents", async () => {
  const new_getAllEvents = new EventAPI();
  const allEvents = await new_getAllEvents.getAllEvents;
  assertEquals(allEvents.apply.length , numberEvents)

});


