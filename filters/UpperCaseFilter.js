var IFilter = require("../classes/IFilter");

function UpperCaseFilter() {
  IFilter.call(this);
}

UpperCaseFilter.prototype.process = function (message) {
  var input = message;
  var result = input.toUpperCase();
  return result;
};

module.exports = UpperCaseFilter;