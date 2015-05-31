var when = require('when');

function Pipe(channel, from, to, filter) {
  this.channel = channel;
  this.from = from;
  this.to = to;
  this.filter = filter;
}

Pipe.prototype.start = function () {
  return when.all([
    this.channel.assertQueue(this.from, false, true, false, false),
    this.channel.assertExchange(this.from, 'direct', false, true, false),
    this.channel.bindQueue(this.from, this.from, ''),
    this.channel.prefetch(1),
    this.channel.consume(this.from, this.handleMessage.bind(this))
  ]);
};

Pipe.prototype.handleMessage = function (message) {
  var body = message.content.toString();

  console.log("Filter '" + this.from + "': Received '" + body + "' from '" + this.from + "'");

  var filteredData = this.filter.process(body);

  this.channel.publish(this.to, '', new Buffer(filteredData),{persistent: true});
  this.channel.ack(message);

  console.log("Filter '" + this.from + "': Sent '" + filteredData + "' to '" + this.to + "'");
};

module.exports = Pipe;