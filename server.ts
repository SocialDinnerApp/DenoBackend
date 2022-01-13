import { Application, Router, Status } from "https://deno.land/x/oak/mod.ts";
// import {getAllEvents, createEvent, getSingleEvent} from './src/event/routes.ts';
import {register, login, logout, validateToken} from './src/user/api.ts'
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { EventAPI } from "./src/event/routes.ts";

export interface TEST {
    name: string; 
    body: string;
    }


const router = new Router();
const eventAPI = new EventAPI();

router
    .get('/welcome', (ctx) => {
        ctx.response.body = 'Welcome to Gatsby';
    }) 
    .post('/user/login', login)
    .post('/user/register', register)
    .post('/user', validateToken)
    .post('/user/logout', logout)  
    .get('/allevents', validateToken, async (context) => {
        let result = await eventAPI.getAllEvents();
        context.response.body = result.value;
    })
    .get('/event/:id', validateToken, async (context) => {
        if (!context.params.id) {
            context.response.status = Status.BadRequest;
            context.response.body = "Invalid parameters.";
          } else {
            let objectId = context.params.id;
            let result = await eventAPI.getSingleEvent(objectId);
            if(result.status == 404){
                context.response.body = {
                    success: false,
            }} else {
            context.response.body = {
                success: true,
                data: result
             }
            } 
          }        
    })
    .put('/update/event/:id', validateToken, eventAPI.updateEvent)
    .post('/create/event', validateToken, async (context) => {
              await eventAPI.createEvent(context)
    } )


const app = new Application();

// for the frontend to get the cookie for authentification
app.use(oakCors({
    credentials: true,
    origin: /^.+localhost:(1234|3000|8000)$/,
}))

app.use(router.routes());
app.use(router.allowedMethods());

app.listen({port: 8000});
console.log("Server is running")