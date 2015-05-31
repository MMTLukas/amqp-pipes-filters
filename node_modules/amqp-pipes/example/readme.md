##Install & Run
To run the example, clone the repo and run

```javascript
$ npm install
```
in the example directory.

- Make sure your [RabbitMQ Server](https://www.rabbitmq.com/download.html) is running and all the Connection Settings are filled in the config.json file.
- Start consumer.js & pipes-and-filters.js in seperate terminal windows.
- Run: "node publisher.js Your Message" to send a Message

##Example Explanation
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
