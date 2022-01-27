import db from "../../mongodb/mongodb.ts";
import User from "../user/user.ts";
import key from "../../key.ts";

import { Context } from "https://deno.land/x/oak/mod.ts";
import { create, verify } from "https://deno.land/x/djwt/mod.ts";
import { Bson } from "https://deno.land/x/mongo@v0.29.0/mod.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { GetId } from '../helper/get_objectId.ts'


export class OrganizerAPI {

  // mongodb collection
  userCollection = db.collection<User>("users");

  // helper class
  getId = new GetId()

  public register = async ({ request, response }: Context) => {
    const { username, email, password, faculty, city, university } =
      await request.body().value;

    const user = {
      username,
      email,
      password: await bcrypt.hash(password),
      faculty,
      city,
      university,
      datetime_created: new Date(),
      datetime_updated: new Date(),
    };

    const id = await this.userCollection.insertOne(user);
    const registered_user = (await this.userCollection.findOne(
      { _id: id },
      { noCursorTimeout: false }
    )) as Partial<User>;

    delete registered_user?.password;

    // register response
    response.body = {
      message: "success",
      data: registered_user,
    };
  };

  // login function
  public login = async ({ request, response, cookies }: Context) => {
    const { email, password } = await request.body().value;

    const user = await this.userCollection.findOne(
      { email },
      { noCursorTimeout: false }
    );

    if (!user) {
      response.status = 404;
      response.body = {
        message: "User not found!",
      };
      return;
    }

    if (!(await bcrypt.compare(password, user.password))) {
      response.status = 401;
      response.body = {
        message: "Incorrect password!",
      }
    }
    
    // generate jwt
    const jwt = await create(
      { alg: "HS512", typ: "JWT" },
      { _id: user._id },
      key
    );
    cookies.set("jwt", jwt, { httpOnly: true });

    // return logged user
    const logged_user = (await this.userCollection.findOne(
      { email },
      { noCursorTimeout: false }
    )) as Partial<User>;

    // avoid returning user password as response
    delete logged_user?.password;

    // login response: jwt token & user information
    response.body = {
      message: "success",
      data: {
        jwt: jwt,
        organizerId: logged_user,
      },
    };
  };

  // validate jwt token to prevent unauthorized requests
  public validateToken = async (ctx: Context, next: any) => {

    const headers: Headers = ctx.request.headers;
    const authorization = headers.get("Authorization");
    if (!authorization) {
      ctx.response.status = 401;
      return;
    }
    const jwt = authorization.split(" ")[1];
    if (!jwt) {
      ctx.response.status = 401;
      return;
    }

    const payload = await verify(jwt, key);
    if (payload) {
      await next();
    }
  };

  // logout function - delete jwt token
  public logout = async (ctx: Context, response: any) => {
    ctx.cookies.delete("jwt");
    ctx.response.body = {
      message: "success",
    };
  };

  // update the organizer's information
  public updateUser = async (ctx: Context) => {
    const headers: Headers = ctx.request.headers;

    const organizerId = await this.getId.objectId(headers, ctx)

    const { username, email, password, city } = await ctx.request.body().value;

    if (!password) {
      const updatedUser = await this.userCollection.updateOne(
        { _id: new Bson.ObjectId(String(organizerId)) },
        { $set: { username, email, city } }
      );
    } else {
      const updatedUser = await this.userCollection.updateOne(
        { _id: new Bson.ObjectId(String(organizerId)) },
        {
          $set: {
            username,
            email,
            password: await bcrypt.hash(password),
            city,
          },
        }
      );
    }

    // receive update information
    const user = await this.userCollection.findOne(
      { _id: new Bson.ObjectId(String(organizerId)) },
      { noCursorTimeout: false }
    );
    ctx.response.body = {
      user,
    };
  };

  // retrieve the organizer's information for the profile page
  public userInformation = async (ctx: Context) => {
    const headers: Headers = ctx.request.headers;

    const organizerId = await this.getId.objectId(headers, ctx)

    const user = await this.userCollection
      .find(
        { _id: new Bson.ObjectId(String(organizerId)) },
        { noCursorTimeout: false }
      )
      .toArray();

    ctx.response.body = user;
  };
}