function LowerCaseFilter(id) {
  this.id = id;
}

LowerCaseFilter.prototype.process = function (message) {
  return message.toLowerCase();
};

module.exports = LowerCaseFilter;