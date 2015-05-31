var amqp = require('amqplib');
var when = require('when');

module.exports = function Pipe(from, to, ch, filter) {

	this.start = function() {
  		return when.all([
			  ch.assertQueue(from, {exclusive: false, durable: true, autoDelete: false}),
			  ch.assertExchange(from, 'direct', {durable: true, autoDelete: false}),
			  ch.bindQueue(from, from, ''),
			  ch.prefetch(10),
			  ch.consume(from, handleMessage)
		]);
	}

	var handleMessage = function(msg) {
		var resultMsg = filter.process(msg.content);
    // persistant equals deliveryMode 2/true
    ch.publish(to, '', new Buffer(resultMsg), {persistent: true});
    ch.ack(msg);
    }
}
