var amqp = require('amqplib');
var Pipe = require('./classes/Pipe');
var pipes = require('./config.json');
var colors = require('colors/safe');

var parameters = process.argv.slice(2);

// If a filter is provided via script parameters only use the provided filter
// else initialize every filter in the config file

if (parameters.length > 1 || (parameters.length === 1 && parameters[0].split("=")[0] != "--filter")) {
  console.error(colors.red("EXIT.") + " Command should be like: " + colors.yellow("node main.js --filter=filter_name"));
} else if (parameters.length === 1) {
  var name = parameters[0].split("=")[1]
  if (pipes[name] != undefined) {
    initPipe(name, 0);
  } else {
    console.error(colors.red("EXIT.") + " Couldn't find filter '" + name + "'");
    return;
  }
} else {

  // If no parameter is given, iterate through all filters
  // and initialize for every filter a pipe
  // Check if filter has a method "process" declared
  for (var i = 0; i < Object.keys(pipes).length; i++) {
    var name = Object.keys(pipes)[i];
    initPipe(name, i);
  }
}

// Every filter gets a pipe, which uses a amqp channel
function initPipe(name, i) {

  amqp.connect("amqp://localhost").then(function (connection) {
    process.once('SIGINT', function () {
      connection.close();
    });

    // Create for every Pipe a channel and set the pipe up
    return connection.createChannel().then(function (channel) {
      var from = pipes[name].from;
      var to = pipes[name].to;

      var Filter = require(pipes[name].filter);
      var filter = new Filter(i);

      if (typeof filter.process !== "function") {
        console.error(colors.red("EXIT.") + " Filter '" + name + "' have to implement a process function");
        return;
      }

      var pipeInstance = new Pipe(channel, from, to, filter);
      return pipeInstance.start();
    }).then(function () {
      console.log(colors.green("Filter '" + name + "' with pipe initialized."));
    });

  }).then(null, console.warn);

}