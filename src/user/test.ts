import { OrganizerAPI } from "./api.ts";
import { assertEquals } from "https://deno.land/std@0.97.0/testing/asserts.ts";
import User from "./user.ts";

// tried tests for modules in user, but this will probably need a mock of a logged in user to work properly

// Deno.test("Test if username is type string", async () => {
//   const user = new User.username;
//   assertEquals(user.type , "string")
// });