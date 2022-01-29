import { Application, Router} from "https://deno.land/x/oak/mod.ts";
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

console.log(Deno.env.get("DATABASE_PASSWORD"))

// middleware router: enables routing based on pathname of a request
router
    .post('/organizer/login', organizerAPI.login)
    .post('/organizer/register', organizerAPI.register)
    .post('/organizer/logout', organizerAPI.logout)  
    .get('/organizer/allevents', organizerAPI.validateToken, eventAPI.getAllEvents)
    .get('/organizer/event/:id', organizerAPI.validateToken, eventAPI.getSingleEvent)
    .put('/organizer/update/event/:id', organizerAPI.validateToken, organizerAPI.validateToken, eventAPI.updateEvent)
    .post('/organizer/create/event', organizerAPI.validateToken, eventAPI.createEvent)
    .put('/organizer', organizerAPI.validateToken, organizerAPI.updateUser)
    .get('/organizer', organizerAPI.validateToken, organizerAPI.userInformation)
    .get('/organizer/visuals/revenue', organizerAPI.validateToken, api.getAllParticipants)
    .get('/organizer/visuals/partlastsevenevents', organizerAPI.validateToken, api.partLastSevenEvents)
    .get('/organizer/visuals/partsingleevent/:id', organizerAPI.validateToken, api.partSingleEvent)

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