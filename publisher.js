var amqp = require('amqplib');
var when = require('when');
var pipes = require('./config.json');
var colors = require('colors/safe');

// Parameters for the script should be like
// 'node main.js lower_case this is a message'
// 'node main.js filter_name message'

var parameters = process.argv.slice(2);
var name, message;

// If a filter is provided via script parameters only use the provided filter
// else initialize every filter in the config file

if (parameters.length >= 2) {
  name = parameters[0];
  message = parameters.splice(1).join(" ");

  if (pipes[name] == undefined) {
    console.error(colors.red("EXIT.") + " Couldn't find filter '" + name + "'");
    return;
  }
} else {
  console.error(colors.red("EXIT.") + " Command should be like: " + colors.yellow("node publisher.js filter_name message"));
  return;
}

// The message should go to the first defined filter
var filter = pipes[name].from;

// Create connection, channel and send the message
amqp.connect("amqp://localhost").then(function (connection) {

  // Using promises to manage the asynchronous initializations
  return when(connection.createChannel().then(function (channel) {

    // OPTIONS EXCHANGE
    // Durable (exchange will survive broker restarts): false
    // Internal (don't publish message direct to exchange): false
    // AutoDelete (exchange will be destroyed after a specific number of messages): false
    var options = {durable: false, internal: false, autoDelete: false};

    // Create an exchange for sending the message to the first filter
    return channel.assertExchange(filter, 'direct', options).then(function () {

      // OPTIONS PUBLISH
      // Persistent (message will survive broker restarts): true
      var options = {persistent: true};

      // Send a message to the exchange
      for (var i = 0; i < 9; i++) {
        channel.publish(filter, '', new Buffer(message), options);
        console.log("[x] Sent '%s'", message, "to filter '" + filter + "'");
      }
    }).then(function () {
      // After sending and logging the message we can close the channel
      return channel.close();
    });
  })).ensure(function () {

    // After sending message or rejected action safely close the connection
    connection.close();
  });
}).then(null, console.warn);