var amqp = require('amqplib');
var when = require('when');
var pipes = require('./config.json');

// The message gets entered by the user
var message = process.argv.slice(2).join(' ') || "Hello World";

// The message should go to the first defined filter
var filter = Object.keys(pipes)[0];

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
      return channel.publish(filter, '', new Buffer(message), options);
    }).then(function () {

      console.log("[x] Sent '%s'", message, "to filter '" + filter + "'");

      // After sending and logging the message we can close the channel
      return channel.close();
    });
  })).ensure(function () {

    // After sending message or rejected action safely close the connection
    connection.close();
  });
}).then(null, console.warn);