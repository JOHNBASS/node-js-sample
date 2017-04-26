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
app.get('/get', function(request, response) {

	//console.log("Got response: " + response.statusCode);
   //console.log("ddos:" + request.url);
   Getdata(request.query.email, function() {
   		var counts = getKeys(datalist);
   		//console.log("D:" + JSON.stringify(datalist));
   		var Amounts ;
   		var Emails ;
   		var Toaccounts ;
   		var Toemails ;
   		var SrtingPonse;

   		for(i=0;i<=(counts.length-1);i++){
   			var keyc = counts[i];
   			Amounts = datalist[keyc].Amount;
			Emails = datalist[keyc].Email;
			Toaccounts = atalist[keyc].Toaccount;
			Toemails = atalist[keyc].Toemail;
			SrtingPonse += Emails +" to " +Toaccounts+" by "+Toaccounts+" Amounts:"+ Amounts +" ||" ;
   		}
   		
   		response.send('{"messages":[{"text":'+SrtingPonse+'}]}');
		//console.log("D:" + datalist[keyc].Amount);
		//console.log("Dw:" + counts.length);
   	 	//response.send('HI');
   });


   //length();
   //var obj = JSON.stringify(datalist);



   //for()

   //response.send('{"messages":[{"text":'+request.query.email+'}]}');
});

var getKeys = function(obj){
	var keys = [];
   for(var key in obj){

   		console.log("D:" + key);
   		//console.log("D:" + obj[0]);
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




