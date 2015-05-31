var amqp = require('amqplib');
var when = require('when');

/**
 * Sets up a publisher, that publishes messages to the pipes and filters
 * run: $ node publisher.js Message
 */

// publishPipe value has to be the same as "from" of the first pipe
// specified in the pipes and filters config.json file
var publishPipe = 'lovely';

var args = process.argv.slice(2);
var message = args.join(' ') || 'Hello World';

amqp.connect('amqp://localhost').then(function(conn) {
  return when(conn.createChannel().then(function(ch) {
        // create or assign an exchange to publish messages
        var ok = ch.assertExchange(publishPipe, 'direct',{durable: true, autoDelete: false});

        return ok.then(function() {
          // publish a message to the assigned exchange
          ch.publish(publishPipe, '', new Buffer(message), {persistent: true});
          console.log("[x] Sent: %s", message);
          return ch.close();
        });

      })).ensure(function() { conn.close(); });
}).then(null, console.warn);
