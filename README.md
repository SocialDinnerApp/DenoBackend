# Gatsby Backend

This Deno backend is used for an organizer on Gatsby to create events. <br> It has access to [cloud.mongodb.com](https://cloud.mongodb.com) database and is hosted on [heroku.com](https://dashboard.heroku.com).

## Documentation: <br>
__mongodb:__ https://deno.land/x/mongo@v0.29.0 <br>
__oak:__ https://deno.land/x/oak@v10.1.1 <br>
__djwt:__ https://deno.land/x/djwt@v2.4 <br>
__bcrypt:__ https://deno.land/x/bcrypt@v0.3.0 <br>
__testing:__ https://deno.land/std@0.97.0/testing

## YouTube Videos & Websites <br>
__Deno & Typescript basics__ <br>
* [Deno Crash Course](https://www.youtube.com/watch?v=NHHhiqwcfRM&list=PL9Q8sSLWvSenWR6lcA9_4ka6A_WZpUS8l&index=17)<br>
* [RestAPI with Deno](https://www.youtube.com/watch?v=Hi1Xen0H_HI&list=PL9Q8sSLWvSenWR6lcA9_4ka6A_WZpUS8l&index=1)<br>
* [Deno & MongoDB REST API Tutorial with Oak Framework](https://www.youtube.com/watch?v=TMPBEkfIPWk&list=PL9Q8sSLWvSenWR6lcA9_4ka6A_WZpUS8l&index=2)<br>
* [TypeScript Tutorial - Explicit Types](https://www.youtube.com/watch?v=__92ek8Xh4o&list=PL9Q8sSLWvSenWR6lcA9_4ka6A_WZpUS8l&index=12)<br>
* [TypeScript Tutorial - Objects & Arrays](https://www.youtube.com/watch?v=157NopQ-chU&list=PL9Q8sSLWvSenWR6lcA9_4ka6A_WZpUS8l&index=13)<br>

__JWT authentication__<br>
* [logout and delete cookie](https://www.youtube.com/watch?v=Z0MnltqC8T8&list=PL9Q8sSLWvSenWR6lcA9_4ka6A_WZpUS8l&index=7)<br>
* [deno login and registration system](https://www.youtube.com/watch?v=2TRipZfWEGY&list=PL9Q8sSLWvSenWR6lcA9_4ka6A_WZpUS8l&index=8)<br>
* [Deno API Authentication using JWT Tokens](https://www.youtube.com/watch?v=9W_BUMeMQI8&list=PL9Q8sSLWvSenWR6lcA9_4ka6A_WZpUS8l&index=9)<br>

__Unit Tests with Deno__<br>
* [What is Unit Testing, Why We Use It, and Sample Test Cases](https://www.youtube.com/watch?v=iWtxEDE1IR4&list=PL9Q8sSLWvSenWR6lcA9_4ka6A_WZpUS8l&index=15)<br>
* [Intro To Deno Unit Testing](https://www.youtube.com/watch?v=qRmF8mlA2a0&list=PL9Q8sSLWvSenWR6lcA9_4ka6A_WZpUS8l&index=10)<br>
* [Deno: testing](https://www.youtube.com/watch?v=Bg1v3Pquf8w&list=PL9Q8sSLWvSenWR6lcA9_4ka6A_WZpUS8l&index=11)<br>

__Postman__<br>
* [Postman API tutorial for beginners](https://www.youtube.com/watch?v=FjgYtQK_zLE&list=PL9Q8sSLWvSenWR6lcA9_4ka6A_WZpUS8l&index=4)<br>

## Done
 - [x] setting up mongodb connection
 - [x] implemented CRUD operations for organizer <br> & created suitable responses for the frontend
 - [x] implemented functionaly to aggregate database data
 - [x] creating and verifying JSON Web Tokens to restrict unauthorized access
 - [x] login/register & logout functionality
 - [x] working with interfaces in TypeScript
 - [x] hashing passwords with bcrypt
 - [x] implemented helper functions to fulfill the __DRY-Principle__
 - [x] implemented a few unit-tests
 - [x] deployed backend to heroku

## Challenges

* facing issues by running deno, see: [StackOverflow - Question](https://stackoverflow.com/questions/70856292/the-server-is-taking-too-long-to-respond-with-the-deno-run-command/70856322#70856322)<br>
* first time using TypeScript, coming from Python <br>
* creating and verifying JSON Web Tokens with deno [djwt] <br>
* writing & trying unit-tests for Rest-API 
* switching from relational database to document-oriented NoSQL database [mongodb]

## Learnings<br>

* ~~for debugging in deno a lot of patience is needed~~ <br>
* after implementing authentification many errors occur because of missing baerer tokens <br>
* how to write simple unit-tests <br>



