module.exports = function LovelyFilter() {

  this.process = function(body) {
    var input = body.toString();

    var result = input
            .split(' ')
            .map(function(x) { return x+'ly'; })
            .join(' ');

    return result;
  }
}
