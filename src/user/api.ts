import db from '../mongodb/mongodb.ts';
import User from '../user/user.ts'
import key from '../../key.ts'

import { Context, helpers, RouterContext} from "https://deno.land/x/oak/mod.ts";
import { create, verify, decode, validate } from "https://deno.land/x/djwt/mod.ts";
import { Bson } from "https://deno.land/x/mongo@v0.29.0/mod.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts"

const userCollection = db.collection<User>('users');

const register = async ({request, response}: Context) => {

  const  {username, email, password, faculty, city, university} = await request.body().value;

  const user = {
    username,
    email,
    password: await bcrypt.hash(password),
    faculty, 
    city, 
    university,
    datetime_created: new Date(),
    datetime_updated: new Date()
  }
  
  const id = await userCollection.insertOne(user)
  const registered_user = await userCollection.findOne({_id: id}, { noCursorTimeout: false}) as Partial<User>;

  delete registered_user?.password

   // register response
   response.body = {
    message: 'success',
    data: registered_user
   }
}

// Login function
const login = async ({request, response, cookies}: Context) => {

  const {email, password} = await request.body().value;

  const user = await userCollection.findOne({email}, { noCursorTimeout: false});
  console.log(user)

  if (!user) {
    response.status = 404
    response.body = {
      message: 'User not found!',
    };
    return;
  }

  // console.log(await bcrypt.compare(user.password, password))
  // console.log('Password', user.password)
  if (!await bcrypt.compare(password, user.password)) {
    response.status = 404
    response.body = {
      message: 'Incorrect password!'
    };
    return;
  }

  const jwt = await create({ alg: "HS512", typ: "JWT" }, { _id: user._id }, key);
  cookies.set('jwt', jwt, {httpOnly: true});

  const logged_user = await userCollection.findOne({email}, { noCursorTimeout: false}) as Partial<User>;

  delete logged_user?.password


  // login response
  response.body = {
    message: 'success',
    data: {
      jwt: jwt,
      organizerId: logged_user
    }
  };
}

const validateToken = async (ctx: Context, next: any) => {
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

const logout = async (ctx: Context, response: any) => {
  ctx.cookies.delete('jwt');
  ctx.response.body = {
    message: 'success'
  }
}

const updateUser = async (ctx: Context) => {
  const headers: Headers = ctx.request.headers;

    // to make sure that authorization is not null
    const authorization = headers.get("Authorization");
    if (!authorization) {
      ctx.response.status = 401;
      return;
    }

    const jwt = authorization.split(" ")[1];
    const payload = await verify(jwt, key);
    const organizerId = payload._id;

    const { username, email, password, city } = await ctx.request.body().value;

    const updatedUser = await userCollection.updateOne(
      { _id: new Bson.ObjectId(String(organizerId)) },
      { $set: { username, email, password: await bcrypt.hash(password), city } }
    );

    const user = await userCollection.findOne({ _id: new Bson.ObjectId(String(organizerId))}, { noCursorTimeout: false})
    ctx.response.body = {
      user
    }
  }

    const userInformation = async (ctx: Context) => {
      const headers: Headers = ctx.request.headers;
    
        // to make sure that authorization is not null
        const authorization = headers.get("Authorization");
        if (!authorization) {
          ctx.response.status = 401;
          return;
        }
    
        const jwt = authorization.split(" ")[1];
        const payload = await verify(jwt, key);
        const organizerId = payload._id;
  
        const user = await userCollection.find({_id: new Bson.ObjectId(String(organizerId))}, {noCursorTimeout: false}).toArray();
    
        ctx.response.body = user
    }


export {register, login, logout, updateUser, userInformation, validateToken}