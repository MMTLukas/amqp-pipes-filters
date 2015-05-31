var amqp = require('amqplib');
var Pipe = require('./classes/Pipe');
var pipes = require('./config.json');
var colors = require('colors/safe');

// Iterate through all filters and initialize for every filter a pipe
// Check if filter has a method "process" declared
for (var i = 0; i < Object.keys(pipes).length; i++) {
  var current = Object.keys(pipes)[i];
  var from = pipes[current].from;
  var to = pipes[current].to;

  var Filter = require(pipes[current].filter);
  var filter = new Filter(i);

  if (typeof filter.process !== "function") {
    console.error("Filter " + current + " have to implement a process function");
    return;
  }

  initPipe(from, to, filter, current);
}

// Every filter gets a pipe, which uses a amqp channel
function initPipe(from, to, filter, name) {

  amqp.connect("amqp://localhost").then(function (connection) {
    process.once('SIGINT', function () {
      connection.close();
    });

    // Create for every Pipe a channel and set the pipe up
    return connection.createChannel().then(function (channel) {
      var pipeInstance = new Pipe(channel, from, to, filter);
      return pipeInstance.start();
    }).then(function () {
      console.log(colors.green("Filter '" + name + "' with pipe initialized."));
    });

  }).then(null, console.warn);

}