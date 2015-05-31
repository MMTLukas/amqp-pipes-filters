var IFilter = require("../classes/IFilter");

function LowerCaseFilter() {
  IFilter.call(this);
}

LowerCaseFilter.prototype.process = function (message) {
  var input = message;
  var result = input.toLowerCase();
  return result;
};

module.exports = LowerCaseFilter;