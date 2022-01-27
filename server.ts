import { Application, Router, Status } from "https://deno.land/x/oak/mod.ts";
// import {getAllEvents, createEvent, getSingleEvent} from './src/event/routes.ts';
import {register, login, logout, updateUser, validateToken, userInformation} from './src/user/api.ts'
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { EventAPI } from "./src/event/api.ts";
import { API } from "./src/visualization/api.ts";

const router = new Router();
const eventAPI = new EventAPI();
const api = new API();

router
    .post('/organizer/login', login)
    .post('/organizer/register', register)
    // to be removed
    .post('/organizer', validateToken)
    .post('/organizer/logout', logout)  
    .get('/organizer/allevents', validateToken, eventAPI.getAllEvents)
    .get('/organizer/event/:id', eventAPI.getSingleEvent)
    .put('/organizer/update/event/:id', validateToken, eventAPI.updateEvent)
    .post('/organizer/create/event', eventAPI.createEvent)
    .put('/organizer', validateToken, updateUser)
    .get('/organizer', userInformation)
    .get('/organizer/visuals/revenue', api.getAllParticipants)
    .get('/organizer/visuals/partsingleevent/:id', api.partSingleEvent)
    .get('/organizer/visuals/partlastsevenevents', api.partLastSevenEvents)

const app = new Application();

// for the frontend to get the cookie for authentification
app.use(oakCors({
    credentials: true,
    origin: '*',
}))

app.use(router.routes());
app.use(router.allowedMethods());

app.listen({port: 8000});
console.log("Server is running")