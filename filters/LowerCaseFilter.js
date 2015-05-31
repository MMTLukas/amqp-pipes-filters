function LowerCaseFilter() {}

LowerCaseFilter.prototype.process = function (message) {
  var input = message;
  var result = input.toLowerCase();
  return result;
};

module.exports = LowerCaseFilter;