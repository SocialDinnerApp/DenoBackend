import db from '../mongodb/mongodb.ts';
import UserSchema from '../user/user.ts'
import key from '../key.ts'

import { Context, helpers, RouterContext} from "https://deno.land/x/oak/mod.ts";
import { create, verify, decode, validate } from "https://deno.land/x/djwt/mod.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts"

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

// Login function
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

  console.log(await bcrypt.compare(user.password, password))
  console.log('Password', user.password)
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

export {register, login, logout, validateToken}