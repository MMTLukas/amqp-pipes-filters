var amqp = require('amqplib');
var when = require('when');

var resultPipe = 'result';
amqp.connect().then(function (conn) {

  process.once('SIGINT', function () {
    conn.close();
  });

  var ok = conn.createChannel()
  ok = ok.then(function (channel) {

    // OPTIONS EXCHANGE
    // Durable (exchange will survive broker restarts): false
    // Internal (don't publish message direct to exchange): false
    // AutoDelete (exchange will be destroyed after a specific number of messages): false
    var optionsExchange = {durable: false, internal: false, autoDelete: false};

    // OPTIONS QUEUE
    // Exclusive (scopes the queue to the connection): false
    // Durable (exchange will survive restart of broker): true
    // AutoDelete (exchange will be destroyed after a specific number of messages): false
    var optionsQueue = {exclusive: false, durable: true, autoDelete: false};

    return when.all([
      channel.assertQueue(resultPipe, optionsQueue),
      channel.assertExchange(resultPipe, 'direct', optionsExchange),
      channel.bindQueue(resultPipe, resultPipe),
      channel.consume(resultPipe, function (message) {
        console.log("Received message from pipe '" + resultPipe + "':", message.content.toString());
        channel.ack(message);
      })
    ]);
  });

  console.log("Waiting for messages on pipe '" + resultPipe + "'...");

  return ok;
}).then(null, console.warn);
