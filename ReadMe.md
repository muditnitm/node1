db# A Express Project

## Directory Structure

* controllers (handle request, response, authentication etc, no queries. ), 
* services (reusable business logic across multiple requests, no queries. ), 
* models (database CRUD operations, queries, data validations, data dependencies.), 
* lib (reusable code across multiple microservices), 
* config (configuration files) , 
* test, features (unit test files & acceptance test files.), 
* public (static resources need to be available),
* middleware (functionalities that apply globally for all routes/api calls), 
* server.js (includes the middleware)
* index.js (start the server)
* router.js, (define routes)
* package.json 

## Coding Guidelines

* Functions and Arrow Functions ```(https://stackoverflow.com/questions/22939130/when-should-i-use-arrow-functions-in-ecmascript-6)``` 
* Const, let instead of var (understand the scope of let and const, they’re block scoped)
* Spread operators for object, array operations - Mutation(Object.assign) and non-mutation    (Spread) as per use case
* export default, export specific Function instead of module.exports
* import blah or import {blah} or import * as blah instead of require depending on how it’s   exported (as default or as a specificFunc respectively)
* string literals usage - use `this is ${blah}` instead of ‘this is’+blah, also for 	      multi-line strings
* default params 
* var link = function (height, color, url) { var height = height || 50 var color = color || 'red' var url = url || 'http://azat.co'… }
* the above code will be
const link =(height = 50, color = 'red', url = 'http://azat.co') => {}
use async - await instead of direct promises, except for Promise.all([a,b,c])
de-structured assignments
  	var body = req.body, // body has username and password 
username = body.username, password = body.password
the above code will be
const {username, password} = req.body
* tracer or log4js(info,success and error) instead of console.log
* use lodash for all the utility operations - https://lodash.com/docs/  , some basic support is already added in ES6```https://pawelgrzybek.com/whats-new-in-ecmascript-2016-es6/ ```
* statsd for monitoring and alert
* use of Map and Reduce wherever required instead of direct loops.
* Use res.status(STATUS_CODE).json for sending back the data and always send a success: true/false param along with the rest of the data, also send back if there’s an error as res.status(500).json( success: false) to notify client that something's wrong on the server end.
* status 400 for bad requests


* axios istead of fetch - also   catch every error in the http request by axios.get(url).catch() (```https://medium.com/@thejasonfile/fetch-vs-axios-js-for-making-http-requests-2b261cdd3af5```) (```https://github.com/axios/axios#features```)
* swagger for API documentation
* load testing with JMeter or Gatling
* get method for get requests(idempotent requests - fetching data without updating) instead of post method
* Use constants instead of strings in comparisons
* Standard response format for success and failure.
     { 
	status:
	message: 
	data:
	error:
     }
* Hard coded email id and mobile number etc should be read from config files.
* Always handle promise failures
* Create multiple log files using log4js

* If because of unCaughtException service my go offline hence we use nodemailer to send the mail about the crash and then shutdown.


# node1
# node1
