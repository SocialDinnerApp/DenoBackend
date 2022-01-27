import { Application, Router, Status } from "https://deno.land/x/oak/mod.ts";
// import {getAllEvents, createEvent, getSingleEvent} from './src/event/routes.ts';
import { OrganizerAPI} from './src/user/api.ts'
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { EventAPI } from "./src/event/api.ts";
import { API } from "./src/visualization/api.ts";
import { parse } from 'https://deno.land/std/flags/mod.ts'

const router = new Router();
const eventAPI = new EventAPI();
const organizerAPI = new OrganizerAPI();
const api = new API();

const { args } = Deno;
const DEFAULT_PORT = 3000;
const PORT = parse(args).port;

router
    .post('/organizer/login', organizerAPI.login)
    .post('/organizer/register', organizerAPI.register)
    // .post('/organizer', organizerAPI.validateToken)
    .post('/organizer/logout', organizerAPI.logout)  
    .get('/organizer/allevents', eventAPI.getAllEvents)
    .get('/organizer/event/:id', eventAPI.getSingleEvent)
    .put('/organizer/update/event/:id', organizerAPI.validateToken, eventAPI.updateEvent)
    .post('/organizer/create/event', eventAPI.createEvent)
    .put('/organizer', organizerAPI.validateToken, organizerAPI.updateUser)
    .get('/organizer', organizerAPI.userInformation)
    .get('/organizer/visuals/revenue', api.getAllParticipants)
    .get('/organizer/visuals/partlastsevenevents', api.partLastSevenEvents)
    .get('/organizer/visuals/partsingleevent/:id', api.partSingleEvent)

const app = new Application();

// for the frontend to get the cookie for authentification
app.use(oakCors({
    credentials: true,
    origin: '*',
}))

app.use(router.routes());
app.use(router.allowedMethods());

app.listen({ port: PORT ?? DEFAULT_PORT });
console.log("Server is running")