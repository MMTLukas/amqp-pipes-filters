module.exports = function GreatnessFilter() {

  this.process = function(body) {
    var input = body.toString();

    var result = input.toUpperCase();

    return result;
  }
}
