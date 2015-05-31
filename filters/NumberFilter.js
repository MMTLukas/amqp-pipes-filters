// This filter removes all number from a message

function NumberFilter(id) {
  this.id = id;
}

NumberFilter.prototype.process = function (message) {
  return message.replace(/\d/g, "");
};

module.exports = NumberFilter;