import { Application, Router} from "https://deno.land/x/oak/mod.ts";
import { OrganizerAPI} from './src/user/api.ts'
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { EventAPI } from "./src/event/api.ts";
import { API } from "./src/visualization/api.ts";

const router = new Router();
const eventAPI = new EventAPI();
const organizerAPI = new OrganizerAPI();
const api = new API();

// middleware router: enables routing based on pathname of a request
router
    .post('/organizer/login', organizerAPI.login)
    .post('/organizer/register', organizerAPI.register)
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

app.listen({port: 8000});
console.log("Server is running")