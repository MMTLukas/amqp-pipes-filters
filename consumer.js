var amqp = require('amqplib');
var when = require('when');

var resultPipe = 'result';
amqp.connect('amqp://localhost').then(function (conn) {

  process.once('SIGINT', function () {
    conn.close();
  });

  var ok = conn.createChannel()
  ok = ok.then(function (channel) {
    return when.all([
      channel.assertQueue(resultPipe, {exclusive: false, durable: true, autoDelete: false}),
      channel.assertExchange(resultPipe, 'direct', {durable: false, autoDelete: true}),
      channel.bindQueue(resultPipe, resultPipe, ''),
      channel.consume(resultPipe, function (message) {
        console.log("Received message from pipe '" + resultPipe + "':", message.content.toString());
        channel.ack(message);
      })
    ]);
  });

  console.log("Waiting for messages on pipe '" + resultPipe + "'...");

  return ok;
}).then(null, console.warn);
