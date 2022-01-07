import db from '../mongodb.ts'; 
import { Context } from "https://deno.land/x/oak/mod.ts";
//import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";

interface User {
    email: string,
    passwort: string
}

class UserClass {
    constructor(){}
    userCollection = db.collection('users2');

    register = async (ctx: Context) => {
        const { email, password } =  await ctx.request.body().value;
        const inputUserDetails: any = {
            email: email,
            password: password
        }
        const register = await this.userCollection.insertOne(inputUserDetails)
        
        // inputUserDetails.email;
        //const password = inputUserDetails.passwort;
        //const salt = await bcrypt.genSalt(10);
        //const hashPassword = await bcrypt.hash(password, salt);
        // const register = this.userCollection.insertOne({email: email, password: password})
        return console.log('User has been created');
    }
}


// const createEvent = async (ctx: Context) => {
//     const { title, body } = await ctx.request.body().value;
//     const event: any = {
//         id: v4.generate(),
//         title,
//         body,
//         date: new Date()
//     }
//     const id = await eventCollection.insertOne(event);
//     event._id = id; 
//     ctx.response.status = 201
//     ctx.response.body = event
//     console.log(id)
// }

export default UserClass;   