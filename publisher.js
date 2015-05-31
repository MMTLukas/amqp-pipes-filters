var amqp = require('amqplib');
var when = require('when');

var message = process.argv.slice(2).join(' ') || "Hello World";

var destinationFilter = "lower_case";
amqp.connect().then(function (connection) {


  return when(connection.createChannel().then(function (channel) {
    var ok = channel.assertExchange(destinationFilter, 'direct', false, true, false);

    return ok.then(function (_qok) {
      channel.publish(inputPipe, '', new Buffer(message), {persistent: true});
      console.log("[x] Sent '%s'", message, "to filter '" + inputPipe + "'");
      return channel.close();
    });
  })).ensure(function () {
    //After sending message or rejected action safely close the connection
    connection.close();
  });
}).then(null, console.warn);