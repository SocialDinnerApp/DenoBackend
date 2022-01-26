import { EventAPI } from "./api.ts";
import { delay } from "https://deno.land/std@0.121.0/async/delay.ts";
import { assertEquals } from "https://deno.land/std@0.97.0/testing/asserts.ts";


class EventTests {
  // Test if the number of all events equals 0, then proceed to go to "empty site design"?
  // pass
  public noEventsPass() {
    Deno.test("Fail if getAllEvents is empty #pass", async () => {
      const new_getAllEvents = new EventAPI();
      const allEvents = await new_getAllEvents.getAllEvents;
      console.log(allEvents)
      // current number of events: 11
      assertEquals(allEvents.apply.length , 11)

  });}
  
  //fail
  public noEventsFail() {
    Deno.test("Fail if getAllEvents is empty #fail", async () => {
      const new_getAllEvents = new EventAPI();
      const allEvents = await new_getAllEvents.getAllEvents;
      // current number of events: 11
      assertEquals(allEvents.apply.length, -3)

  });}

  // actual test
  public noEventsTest() {
    Deno.test("Fail if getAllEvents is empty #test", async () => {
      const new_getAllEvents = new EventAPI();
      const allEvents = await new_getAllEvents.getAllEvents;
      // current number of events: 11
      assertEquals(allEvents.apply.length, 0)

  });}
//--------------------------------------------------------------------------------------------------------------------------------
  //is all the input for the create events right?
  

//   public datatypeEventPass(eventId: string) {
//     Deno.test("Fail if getSingleEvent has wrong datatypes #pass", async () => {
//       const new_getSingleEvent = new EventAPI();
//       const thisEvent = await new_getSingleEvent.getSingleEvent(eventId);
//       // current number of events: 11
//       console.log(thisEvent.value.valueOf.arguments)
//       assertEquals(thisEvent.value.valueOf.arguments , 0)
    
//   });}

//   public datatypeEventFail(eventId: string) {
//     Deno.test("Fail if getSingleEvent has wrong datatypes #fail", async () => {
//       const new_getSingleEvent = new EventAPI();
//       const thisEvent = await new_getSingleEvent.getSingleEvent(eventId);
//       // current number of events: 11
//       assertEquals(thisEvent.value.valueOf.arguments, 0)
    
//   });}

//   public datatypeEventTest(eventId: string) {
//     Deno.test("Fail if getSingleEvent has wrong datatypes #test", async () => {
//       const new_getSingleEvent = new EventAPI();
//       const thisEvent = await new_getSingleEvent.getSingleEvent(eventId);
//       // current number of events: 11
//       assertEquals(thisEvent.value.valueOf.arguments, 0)
    
//   });}



// //-----------------------------------------------------------------------------------------------------

// // Test if all mandatory fields are filled
//  // pass
//  public filledFieldsPass() {
//   Deno.test("Fail if not all mandatory fields are filled #pass", async () => {
//     const new_createEvent = new EventAPI();
//     const allEvents = await new_createEvent.createEvent;
    

// });}

// //fail
// public filledFieldsFail() {
//   Deno.test("Fail if not all mandatory fields are filled #fail", async () => {
//     const new_createEvent = new EventAPI();
//     const allEvents = await new_createEvent.createEvent;
    

// });}

// // actual test
// public filledFieldsTest() {
//   Deno.test("Fail if not all mandatory fields are filled #test", async () => {
//     const new_createEvent = new EventAPI();
//     const allEvents = await new_createEvent.createEvent;
    

// });}

}
