# Gatsby Backend

This Deno backend is used for an organizer on Gatsby to create events. <br> It has access to [cloud.mongodb.com](https://cloud.mongodb.com) database and is hosted on [heroku.com](https://dashboard.heroku.com).

## Background

The idea for the project arose from the "Fallstudie" subject and was intended as an extension to offer organizers (e.g. faculties) a website to create events for our Gatsby Application. For the subject "Web-Programming", a new and complete backend was realized using Deno & TypeScript, despite the existing Flask backend (tbf [here](https://github.com/SocialDinnerApp/Backend)), which was implemented for the Application. The aim was, besides the challenge of dealing with a non-relational database, to learn how to use Deno. Next to the sole development of the backend, we suppoted the frontend-team on the design of the Website. Additionally, we created a possibility for the frontend to receive the needed responses in the required way. 

### Done
 - [x] Developed complete backend (TypeScript) including following routes:
      - implemented basic CRUD operations for organizer (e.g. creating events)
      - login, register, logout functionality for frontend
      - getAllEvents --> for a particular registered organizer
      - getSingleEvent --> to show event information in the frontend
      - validateToken --> to check if the organizer's token exists & is not expired
      - database aggregation to receive:<br>
        - event revenue, depending on the individual fee of the event & its participations
        - count of participations for a certain timeframe (in our case: last 30 days) aggregated over 5 day blocks
        - last seven (or less) events of a particular organizer including the number of participations
 - [x] evaluated different database third-party-modules including: [sqlite](https://deno.land/x/sqlite@v3.2.0), [mysql](https://deno.land/x/mysql@v2.10.2), [postgres](https://deno.land/x/postgres@v0.15.0) & [mongodb](https://deno.land/x/mongo@v0.29.1)
 - [x] setting up mongodb connection
 - [x] design implementation of non-relational data-model for all entities 
 - [x] creating data to test the frontend & backend compatibility
    - different organizers, events, participants & event participations
 - [x] created suitable routes & responses for the frontend
 - [x] creating and verifying JSON Web Tokens to restrict unauthorized access
 - [x] working with interfaces in TypeScript
 - [x] hashing passwords with bcrypt
 - [x] implemented helper functions to fulfill the __DRY-Principle__
 - [x] implemented a few unit-tests
 - [x] deployed backend to heroku, as well as needed env-variables

## Challenges

* facing issues by running deno, see: [StackOverflow - Question](https://stackoverflow.com/questions/70856292/the-server-is-taking-too-long-to-respond-with-the-deno-run-command/70856322#70856322)<br>
* first time using TypeScript, coming from Python <br>
* creating and verifying JSON Web Tokens with deno [djwt] <br>
* writing & trying unit-tests for Rest-API 
* switching from relational database to document-oriented NoSQL database [mongodb]

## Learnings<br>

* ~~for debugging in deno a lot of patience is needed~~ <br>
* Improved TypeScript skills <br>
* Improved database knowledge <br>
* How to write simple unit-tests <br>
* How to write a deno module and ~~how to publish it on deno.land~~ (pending)<br>

## Documentation: <br>
__mongodb:__ https://deno.land/x/mongo@v0.29.0 <br>
__oak:__ https://deno.land/x/oak@v10.1.1 <br>
__djwt:__ https://deno.land/x/djwt@v2.4 <br>
__bcrypt:__ https://deno.land/x/bcrypt@v0.3.0 <br>
__testing:__ https://deno.land/std@0.97.0/testing

## YouTube Videos <br>
__Deno & Typescript__ <br>
* [Deno Crash Course](https://www.youtube.com/watch?v=NHHhiqwcfRM&list=PL9Q8sSLWvSenWR6lcA9_4ka6A_WZpUS8l&index=17)<br>
* [RestAPI with Deno](https://www.youtube.com/watch?v=Hi1Xen0H_HI&list=PL9Q8sSLWvSenWR6lcA9_4ka6A_WZpUS8l&index=1)<br>
* [Deno & MongoDB REST API Tutorial with Oak Framework](https://www.youtube.com/watch?v=TMPBEkfIPWk&list=PL9Q8sSLWvSenWR6lcA9_4ka6A_WZpUS8l&index=2)<br>
* [TypeScript Tutorial - Explicit Types](https://www.youtube.com/watch?v=__92ek8Xh4o&list=PL9Q8sSLWvSenWR6lcA9_4ka6A_WZpUS8l&index=12)<br>
* [TypeScript Tutorial - Objects & Arrays](https://www.youtube.com/watch?v=157NopQ-chU&list=PL9Q8sSLWvSenWR6lcA9_4ka6A_WZpUS8l&index=13)<br>

__JWT authentication__<br>
* [deno login and registration system](https://www.youtube.com/watch?v=2TRipZfWEGY&list=PL9Q8sSLWvSenWR6lcA9_4ka6A_WZpUS8l&index=8)<br>
* [Deno API Authentication using JWT Tokens](https://www.youtube.com/watch?v=9W_BUMeMQI8&list=PL9Q8sSLWvSenWR6lcA9_4ka6A_WZpUS8l&index=9)<br>

__Unit Tests with Deno__<br>
* [What is Unit Testing, Why We Use It, and Sample Test Cases](https://www.youtube.com/watch?v=iWtxEDE1IR4&list=PL9Q8sSLWvSenWR6lcA9_4ka6A_WZpUS8l&index=15)<br>
* [Intro To Deno Unit Testing](https://www.youtube.com/watch?v=qRmF8mlA2a0&list=PL9Q8sSLWvSenWR6lcA9_4ka6A_WZpUS8l&index=10)<br>

__Postman__<br>
* [Postman API tutorial for beginners](https://www.youtube.com/watch?v=FjgYtQK_zLE&list=PL9Q8sSLWvSenWR6lcA9_4ka6A_WZpUS8l&index=4)<br>

