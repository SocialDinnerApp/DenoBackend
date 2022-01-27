import { assertEquals } from "https://deno.land/std@0.97.0/testing/asserts.ts";
import { Iterator } from "./mongodb_iterator.ts"
import db from "../mongodb/mongodb.ts";


const event_participation = db.collection("event_participation");

// Tests for the mongoDB Iterator

Deno.test("Test iterator for 5 day intervals for the last 30 days", async () => {

    const oneIterator0: any = new Iterator()
    const expectedOutputIt0 = [[0,0,0,0,0,0],["28.12.2021","02.01.2022","07.01.2022","12.01.2022","17.01.2022","22.01.2022"]]
    const actualOutputIt0 = await oneIterator0.mongodbIterator(5, 30, event_participation, "61f27e9a0db8ab78a6a2d02b")
    assertEquals( actualOutputIt0, expectedOutputIt0)
  
  });
  

Deno.test("Test iterator for 5 day intervals for the last 27 days", async () => {

    const oneIterator1: any = new Iterator()
    const expectedOutputIt1 = [[0,0,0,0,0,0],["31.12.2021","05.01.2022","10.01.2022","15.01.2022","20.01.2022","25.01.2022"]]
    const actualOutputIt1 = await oneIterator1.mongodbIterator(5, 27, event_participation, "61f27e9a0db8ab78a6a2d02b")
    assertEquals( actualOutputIt1, expectedOutputIt1)

});

Deno.test("Test iterator for 10 day intervals for the last 50 days", async () => {

    const oneIterator2: any = new Iterator()
    const expectedOutputIt2 = [[0,0,0,0,0],["08.12.2021","18.12.2021","28.12.2021","07.01.2022","17.01.2022"]]
    const actualOutputIt2 = await oneIterator2.mongodbIterator(10, 50, event_participation, "61f27e9a0db8ab78a6a2d02b")
    assertEquals( actualOutputIt2, expectedOutputIt2)
    
});

Deno.test("Test iterator for 30 day intervals for the last 365 days", async () => {

    const oneIterator2: any = new Iterator()
    const expectedOutputIt2 = [[0,0,0,0,0,0,0,0,0,0,0,0,0],["27.01.2021","26.02.2021","28.03.2021","27.04.2021","27.05.2021",
    "26.06.2021","26.07.2021","25.08.2021","24.09.2021","24.10.2021","23.11.2021","23.12.2021","22.01.2022"]]
    const actualOutputIt2 = await oneIterator2.mongodbIterator(30, 365, event_participation, "61f27e9a0db8ab78a6a2d02b")
    assertEquals( actualOutputIt2, expectedOutputIt2)
    
});
