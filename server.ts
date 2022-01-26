import { Application, Router, Status } from "https://deno.land/x/oak/mod.ts";
// import {getAllEvents, createEvent, getSingleEvent} from './src/event/routes.ts';
import {register, login, logout, updateUser, validateToken, userInformation} from './src/user/api.ts'
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { EventAPI } from "./src/event/api.ts";
import { API } from "./src/visualization/api.ts";


export interface TEST {
    name: string; 
    body: string;
    }


const router = new Router();
const eventAPI = new EventAPI();
const api = new API();


router
    .get('/welcome', (ctx) => {
        ctx.response.body = 'Welcome to Gatsby';
    }) 
    .post('/user/login', login)
    .post('/user/register', register)
    .post('/user', validateToken)
    .post('/user/logout', logout)  
    .get('/allevents', validateToken, eventAPI.getAllEvents)
    .get('/event/:id', eventAPI.getSingleEvent)
    .put('/update/event/:id', validateToken, eventAPI.updateEvent)
    .post('/create/event', eventAPI.createEvent)
    .get('/myevents', validateToken, eventAPI.getOrganizerEvents)
    .get('/api/visuals/revenue', api.getAllParticipants)
    .get('/api/visuals/lastseven', api.lastSevenEvents)
    .put('/update/user', validateToken, updateUser)
    .get('/api/visuals/eventinformation/:id', api.eventSpecificInformation)
    .get('/api/userinformation', userInformation)


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