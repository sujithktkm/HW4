var http      = require('http');
var httpProxy = require('http-proxy');
var exec = require('child_process').exec;
var request = require("request");
var express = require('express');
var redis = require('redis');
var app = express();
var GREEN = 'http://127.0.0.1:3002';
var BLUE  = 'http://127.0.0.1:3001';
var blue = redis.createClient(6379, '127.0.0.1', {});
var green = redis.createClient(6380, '127.0.0.1', {});
var flag = 1;
var TARGET = BLUE;

var infrastructure =
{
  setup: function()
  {
    // Proxy.
    var options = {};
    var proxy   = httpProxy.createProxyServer(options);

    app.listen(3200, 'localhost');

    // Launch blue slice
   // exec('forever start deploy/blue-www/main.js 3001');
    console.log("blue redis instance");
  
    // Launch green slice
    //exec('forever start deploy/green-www/main.js 3002');
    console.log("green redis instance");

    app.get('/switch', function(req, res) {
      if (TARGET == BLUE) {
        blue.lrange("queue1", 0, -1, function(err, message) {
          green.del("queue1");
          message.foreach(function(item) {
            green.lpush("queue1",item);
          })
        })
        TARGET = GREEN;
      } else {
        green.lrange("queue1", 0, -1, function(err, message) {
          blue.del("queue1");
          message.foreach(function(item) {
            blue.lpush("queue1",item);
          })
        })
        TARGET = BLUE;
      }
//      res.send("switch done");
    });

    app.get('/*', function(req, res) {
      console.log(TARGET);
      proxy.web( req, res, {target: TARGET } );
      if (flag == 1) {
        if (TARGET == BLUE) {
          proxy.web( req, res, {target: GREEN } );
          console.log("ASDASDA");
        }
        else
          proxy.web( req, res, {target: BLUE } );
      }
    });

    app.post('/upload', function(req, res) {
      console.log(TARGET);
      proxy.web( req, res, {target: TARGET } );
      if (flag == 1) {
        if (TARGET == BLUE) {
          proxy.web( req, res, {target: GREEN } );
          console.log("ASDASDA");
        }
        else
          proxy.web( req, res, {target: BLUE } );
      }
    });

//setTimeout
/*var options = 
{
 url: "http://localhost:3100",
};
request(options, function (error, res, body) {
}
*/
  },

  teardown: function()
  {
    exec('forever stopall', function()
    {
      console.log("infrastructure shutdown");
      process.exit();
    });
  },
}
    
infrastructure.setup();

// Make sure to clean up.
process.on('exit', function(){infrastructure.teardown();} );
process.on('SIGINT', function(){infrastructure.teardown();} );
process.on('uncaughtException', function(err){
  console.log(err);
//  infrastructure.teardown();
} );