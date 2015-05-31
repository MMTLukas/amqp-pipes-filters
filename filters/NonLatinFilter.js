function NonLatinFilter(id) {
  this.id = id;
}

NonLatinFilter.prototype.process = function (message) {
  return message.replace(/\W/g, "");
};

module.exports = NonLatinFilter;