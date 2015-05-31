#AMQP Pipes and Filters

This is a small implementation of pipes and filters with the amqp.node ([amqplib](https://github.com/squaremo/amqp.node)) library for RabbitMQ.

##install
run

```javascript
$ npm install amqp-pipes
```
##How to
In order to use this library, you need to provide:

- A config file (.json) with all the connection and pipe/filter details
- Your own filter implementations
- A publisher with the first input
- A consumer taking the result

obviously a server instance of [RabbitMQ](https://www.rabbitmq.com/download.html) should be running.

##Example
your config file should look like this: (*these connection details are the unmodified RabbitMQ standard, so this should work for you if you just installed it*)

```javascript
{
  "connection": {
    "host": "localhost",
    "port": "5672",
    "user": "guest",
    "pwd": "guest"
  },
  "filterPath": "../../filters/",
  "pipes": [
    {
      "from": "lovely",
    "to": "greatness",
    "filter": "lovelyFilter.js"
    },
    {
      "from": "greatness",
      "to": "reinforce",
      "filter": "greatnessFilter.js"
    },
    {
      "from": "reinforce",
      "to": "result",
      "filter": "reinforceFilter.js"
    }
  ]
}

```

"**from**": specifies the exchange from which the messages get consumed
"**to**": specifies the exchange to which the messages get published
"**filter**": your filter implementation, which is applied on the content of the messages
***
All your filters require a **"process(body)"** function, in order to get accessed by the pipes.

```javascript
module.exports = function GreatnessFilter() {

  this.process = function(body) {
    var input = body.toString();

    var result = input.toUpperCase();

    return result;
  }
}
```

***
require **'amqp-pipes'** & your **config file** and simply run the module with your config file. This sets up all pipes and filters specified in your config.

```javascript
var pipes = require('amqp-pipes');
var filters = require('./config.json');

pipes(filters);
```
***

You can find a **full runnable example** in the **example directory** here:
[https://github.com/mfressdorf/AMQP-pipes-and-filters/example]()
