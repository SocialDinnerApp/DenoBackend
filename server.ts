import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import {getEvents, createEvent, getSingleEvent, register, login, logout, validateToken, updateEvent} from './routes.ts';
import { oakCors } from "https://deno.land/x/cors/mod.ts";

const router = new Router();

router
    .get('/', (ctx) => {
        ctx.response.body = 'Welcome to notes API';
    })
    .get('/events',  validateToken, getEvents)
    .get('/events/:id', getSingleEvent)
    .post('/events', createEvent)
    .post('/user/login', login)
    .post('/user/register', register)
    .post('/user', validateToken)
    .post('user/logout', logout)

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