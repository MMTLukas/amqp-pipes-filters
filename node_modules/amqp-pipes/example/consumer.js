var amqp = require('amqplib');
var when = require('when');

/**
 * Sets up a consumer, that listens for messages handled by the pipes and filters
 * run: $ node consumer.js
 */

// value of resultPipe has to be the same as the last "to" specified
// in the pipes and filters config.json file
var resultPipe = 'result';

// assert Exchange + Queue & bind Queue to listen/consume from and log the result messages
amqp.connect('amqp://localhost').then(function(conn) {
  process.once('SIGINT', function() { conn.close(); });
  var ok = conn.createChannel();
  ok = ok.then(function(ch) {
    return when.all([
      ch.assertQueue(resultPipe, {exclusive: false, durable: true, autoDelete: false}),
      ch.assertExchange(resultPipe, 'direct', {durable: true, autoDelete: false}),
      ch.bindQueue(resultPipe, resultPipe, ''),
      ch.consume(resultPipe, logMessage),
      ch.ack()
      ]);
  });
  console.log("listening for Messages...");
  return ok;
}).then(null, console.warn);


function logMessage(msg) {
  if (msg !== 'undefined') {
    console.log("[x] Recieved: %s", msg.content.toString());
  }
}
