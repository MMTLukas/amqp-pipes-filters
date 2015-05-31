var amqp = require('amqplib');
var when = require('when');

var Pipe = require('./pipe');

module.exports = function(config) {

  // read config parameters
  var pipes = config.pipes;
  var connection = config.connection;
  var filterPath = config.filterPath;
  var AMQP_URL = 'amqp://'+connection.user+':'+connection.pwd+'@'+connection.host+':'+connection.port;

  // set up all pipes specified in the config file
  for (var i = 0, length = pipes.length; i < length; i++) {
    var pipe = pipes[i];
    var from = pipe.from;
    var to = pipe.to;
    var Filter = require(filterPath+pipe.filter);
    var filterInstance = new Filter();
    connectPipe(from, to, filterInstance);
  }

  function connectPipe(from, to, filter) {
    amqp.connect(AMQP_URL).then(function(conn) {
      process.once('SIGINT', function() { conn.close(); });
      var ok = conn.createChannel();
      ok = ok.then(function(channel) {
        var pipeInstance = new Pipe(from, to, channel, filter);
        pipeInstance.start();
      });
      return ok;
    }).then(null, console.warn);
  }
}
