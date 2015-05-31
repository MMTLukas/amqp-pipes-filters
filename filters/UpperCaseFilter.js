function UpperCaseFilter() {}

UpperCaseFilter.prototype.process = function (message) {
  var input = message;
  var result = input.toUpperCase();
  return result;
};

module.exports = UpperCaseFilter;