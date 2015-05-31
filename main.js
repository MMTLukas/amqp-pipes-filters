// START FILTER AND GIVE THEM INPUT

// When starting all the filters
// throw error, when a filter is not implementing the interface
// ala => "Put 'IFilter.call(this);' inside your constructor!"

// Queue options:
// exclusive = if true the queue is scoped to the connection. default false.
// durable = if true the queue will survive broker restarts. default true.
// autoDelete = if true the queue will be deleted when the number of consumer drops to zero. default false.
// arguments ...

var amqp = require('amqplib');
var Pipe = require('./classes/Pipe');
var pipes = require('./config.json');

for (var i = 0; i < Object.keys(pipes).length; i++) {
  var current = Object.keys(pipes)[i];
  var from = pipes[current].from;
  var to = pipes[current].to;

  var Filter = require(pipes[current].filter);
  var filter = new Filter();
  //TODO: check if interface in filter is used

  initPipe(from, to, filter, current);
}

function initPipe(from, to, filter, name) {

  amqp.connect("amqp://localhost").then(function (connection) {
    process.once('SIGINT', function () {
      connection.close();
    });

    var ok = connection.createChannel();

    ok = ok.then(function (channel) {
      var pipeInstance = new Pipe(channel, from, to, filter);
      return pipeInstance.start();
    });

    return ok.then(function () {
      console.log("Filter '" + name + "' with pipe initialized.");
    });
  }).then(null, console.warn);

}