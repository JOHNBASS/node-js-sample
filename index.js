var express = require('express');
var http = require('http');
var cool = require('cool-ascii-faces');

var requestify = require('requestify'); 

var dateTime = require('node-datetime');


var app = express();

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


app.set('port', (process.env.PORT || 8080));
app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {

	console.log("Got response: " + response.statusCode);
   console.log("ddos:" + request.url);
  response.send('Hello World!');
});




app.get('/api', function(request, response) {

	//console.log("Got response: " + response.statusCode);
   	//console.log("ddos:" + request.url);
   	var dt = dateTime.create();
	var formatted = dt.format('Y-m-d H:M:S');
	//console.log(formatted);
   	Invokpostdata(request.query.email,request.query.Toaccount,request.query.Toemail,request.query.Amount,formatted);
   	response.send('{"messages":[{"text":"in db"}]}');
});

var datalist;
var keys = [];
app.get('/get', function(request, response) {

	//console.log("Got response: " + response.statusCode);
   //console.log("ddos:" + request.url);
   Getdata(request.query.email, function() {

   		var counts = getKeys(datalist).length;
   		console.log("D:" + JSON.stringify(datalist));
		console.log("D:" + counts);
		console.log("D:" + counts.Amount);
   	 	response.send('HI');
   });


   //length();
   //var obj = JSON.stringify(datalist);



   //for()

   //response.send('{"messages":[{"text":'+request.query.email+'}]}');
});

var getKeys = function(obj){
   for(var key in obj){
   		console.log("D:" + key);
      keys.push(key);
   }
   return keys;
}


app.get('/index', function(request, response) {

	console.log("Got response: " + response.statusCode);
   console.log("ddos:" + request.url);
  	response.render('pages/index');
});

app.get('/page', function(request, response) {

	console.log("Got response: " + response.statusCode);
   console.log("ddos:" + request.url);
  	response.render('pages/page1');
});

app.get('/cool', function(request, response) {
  response.send(cool());
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});



http.get({'host': 'api.ipify.org', 'port': 80, 'path': '/'}, function(resp) {
  resp.on('data', function(ip) {
    console.log("My public IP address is: " + ip);
  });
});


function Invokpostdata(email,Toaccount,Toemail,Amount,date)
{
	requestify.request('https://transferhelper-6fc9a.firebaseio.com/users.json', {
	    method: 'POST',
	    body: {
	        Email: email,
	        Toaccount: Toaccount,
	        Toemail:Toemail,
	        Amount:Amount,
	        DateTime:date
	    },
	    headers: {
	        'X-Forwarded-By': 'me'
	    },
	    cookies: {
	        mySession: 'some cookie value'
	    },
	    auth: {
	        // username: 'foo',
	        // password: 'bar'
	    },
	    dataType: 'json'        
	})
	.then(function(response) {
	    // get the response body
	    response.getBody();

	    // get the response headers
	    response.getHeaders();

	    // get specific response header
	    response.getHeader('Accept');

	    // get the code
	    response.getCode();

	    // Get the response raw body
	    response.body;
	});
}

function Getdata(email,callback)
{
	requestify.request('https://transferhelper-6fc9a.firebaseio.com/users.json', {
	    method: 'get',
	    headers: {
	        'X-Forwarded-By': 'me'
	    },
	    cookies: {
	        mySession: 'some cookie value'
	    },
	    auth: {
	        // username: 'foo',
	        // password: 'bar'
	    },
	    dataType: 'json'        
	})
	.then(function(response) {
	    // get the response body
	    response.getBody();

	    // get the response headers
	    response.getHeaders();

	    // get specific response header
	    response.getHeader('Accept');

	    // get the code
	    response.getCode();

	    // Get the response raw body
	    response.body;

	    datalist = response.getBody();
	    callback();

	});
}




