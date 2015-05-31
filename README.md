# AMQP Pipes-and-Filters

This repository is for the final assignment for the lecture "Scalable Web Architectures" at the University of Applied Science.

## Pattern

![](http://www.eaipatterns.com/img/PipesAndFilters.gif)

Example usage of the pipes and filter pattern from http://www.eaipatterns.com/PipesAndFilters.html

## How to use
First terminal:
```
git clone https://github.com/MMTLukas/amqp-pipes-filters.git
cd amqp-pipes-filters
npm install
node main.js
```
The main.js function setups all filters (and their pipes) of the config.json file.

Second terminal:
```
node consumer.js
```
Third terminal:
```
node publisher.js [message]
```
## Adapt
You can edit the config.json file, implement more filters and add them.

### Configuration
Add and remove filters from the config.json file.

```
{
  [filtername]: {
    "from": [filtertype of sender],
    "to": [filtertype of receiver],
    "filter": [relative path to filter]
  },
  ...
```

### New filters
Create own files and put them into the 'filters' directory. The filter should have following structure:
```
function Filter(id) {
  this.id = id;
}

Filter.prototype.process = function (message) {
  // TO SOMETHING WITH MESSAGE
  return message;
};

module.exports = Filter;
```
