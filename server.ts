import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import {getEvents, createEvent, getSingleEvent, register} from './routes.ts';
import { getUsers } from './controllers/users.ts';

const router = new Router();

router
    .get('/', (ctx) => {
        ctx.response.body = 'Welcome to notes API';
    })
    .get('/events', getEvents)
    .get('/events/:id', getSingleEvent)
    .post('/events', createEvent)
    .get('/users', getUsers)
    .post('/user/register', register)
    // .put('/events', updateEvent)
    // .delete('/events/:d', deleteEvent);

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

app.listen({port: 8000});
console.log("Server is running")