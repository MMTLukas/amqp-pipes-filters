var when = require('when');
var colors = require('colors/safe');

function Pipe(channel, from, to, filter) {
  this.channel = channel;
  this.from = from;
  this.to = to;
  this.filter = filter;
}

Pipe.prototype.start = function () {
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

  // Create queue, exchange and bind them together
  // Set maximum of messages to receive to one
  // Setup consumer callback
  return when.all([
    this.channel.assertQueue(this.from, optionsQueue),
    this.channel.assertExchange(this.from, 'direct', optionsExchange),
    this.channel.bindQueue(this.from, this.from),
    this.channel.prefetch(1),
    this.channel.consume(this.from, this.handleMessage.bind(this))
  ]);
};

Pipe.prototype.handleMessage = function (message) {

  var body = message.content.toString();
  console.log(colors.yellow("Filter " + this.filter.id + " '" + this.from + "'") + ": Received '" + body + "'");

  // Filter the data before relay
  var filteredData = this.filter.process(body);

  // OPTIONS PUBLISH
  // Persistent (message will survive broker restarts): true
  // Mandatory (message will be returned, if it is not routed to a queue): true
  var options = {persistent: true, mandatory:true};

  this.channel.publish(this.to, '', new Buffer(filteredData), options);
  console.log(colors.yellow("Filter " + this.filter.id + " '" + this.from + "'") + ": Sent '" + filteredData + "' to '" + this.to + "'");

  this.channel.ack(message)
};

module.exports = Pipe;