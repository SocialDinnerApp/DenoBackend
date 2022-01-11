import { Context, helpers, RouterContext} from "https://deno.land/x/oak/mod.ts";
import { Bson } from "https://deno.land/x/mongo@v0.29.0/mod.ts";
import db from './mongodb.ts';
import { v4 } from "https://deno.land/std/uuid/mod.ts";
import type {Event} from './event.ts'
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts"
import UserSchema from './schemas/user.ts'
import { create, verify, decode, validate } from "https://deno.land/x/djwt/mod.ts";
import key from './test.ts'


const eventCollection = db.collection('events')

const getEvents = async ({ response }: { response: any }) => {
    try {
      // Find all events and convert them into an Array
      const allEvents = await eventCollection.find({}, { noCursorTimeout: false}).toArray();
      console.log(allEvents);
      if (allEvents) {
        response.status = 200;
        response.body = {
          success: true,
          data: allEvents,
        };
      } else {
        response.status = 500;
        response.body = {
          success: false,
          msg: "Internal Server Error",
        };
      }
    } catch (err) {
      response.body = {
        success: false,
        msg: err.toString(),
      };
    }
  };

const getSingleEvent = async ({
    params,
    response,
  }: {
    params: { id: string };
    response: any;
  }) => {
    // Searches for a particular event in the DB
    
    // Get objectId
    const objectId = params.id
    const event = await eventCollection.findOne({_id: new Bson.ObjectId(objectId)}, { noCursorTimeout: false});
    console.log(params.id)
    // If found, respond with the event. If not, respond with a 404
    if (event) {
      response.status = 200;
      response.body = {
        success: true,
        data: event,
      };
    } else {
      response.status = 404;
      response.body = {
        success: false,
        msg: "No event found",
      };
    }
  };


const createEvent = async (ctx: Context) => {
    const { title, body } = await ctx.request.body().value;
    const event: any = {
        id: v4.generate(),
        title,
        body,
        date: new Date()
    }
    const id = await eventCollection.insertOne(event);
    event._id = id; 
    ctx.response.status = 201
    ctx.response.body = event
    console.log(id)
}


const userCollection = db.collection<UserSchema>('users');

const register = async ({request, response}: Context) => {
  const {name, email, password} = await request.body().value;
  
  const id = await userCollection.insertOne({
    name,
    email,
    password: await bcrypt.hash(password)
  })

  response.body = await userCollection.findOne({_id: id}, { noCursorTimeout: false});
}

// Login function ---->
const login = async ({request, response, cookies}: Context) => {

  const {email, password} = await request.body().value;

  const user = await userCollection.findOne({email}, { noCursorTimeout: false});
  console.log(user)

  if (!user) {
    response.body = 404;
    response.body = {
      message: 'User not found!'
    };
    return;
  }

  console.log(await bcrypt.compare(password, user.password))
  console.log(user.password)
  if (!await bcrypt.compare(password, user.password)) {
    response.body = 401;
    response.body = {
      message: 'Incorrect password!'
    };
    return;

  }

  const jwt = await create({ alg: "HS512", typ: "JWT" }, { _id: user._id }, key);

  cookies.set('jwt', jwt, {httpOnly: true});
  

  response.body = {
    message: 'success',
    data: jwt
  };

  //const payload = await verify(jwt, key); // { foo: "bar" }
  //const [header, payload, signature] = decode(jwt);
}


// const logedUser = async ({response, cookies}: Context) => {
//   const jwtToken: string = response.headers.get("jwt") || '';

//   if (!jwtToken) {
//     response.body = 401;
//     response.body = {
//       message: 'unauthenticated'
//     }
//     return;
//   }

//   const payload = await verify(jwtToken, key); // { foo: "bar" }


//   if (!payload) {
//     response.body = 401;
//     response.body = {
//       message: 'unauthenticated'
//     }
//     return;
//   }
//   // const objectId = payload._id
//   // response.body = await userCollection.findOne({_id: new Bson.ObjectId(objectId)}, { noCursorTimeout: false});


// }

const validateToken = async (ctx: Context, next: any) => {
  console.log("Middleware");

  const headers: Headers = ctx.request.headers;
  const authorization = headers.get('Authorization')
  if (!authorization) {
    ctx.response.status = 401;
    return
  }
  const jwt = authorization.split(' ')[1];
  if (!jwt) {
    ctx.response.status = 401
    return;
  }

  const payload = await verify(jwt, key);
  if (payload){
    console.log("success")
    await next()
  }

}


const logout = async ({response, cookies}: Context) => {
  cookies.delete('jwt')

  response.body = {
    message: 'success'
  }
}



export {getEvents, createEvent, getSingleEvent, register, login, logout, validateToken};