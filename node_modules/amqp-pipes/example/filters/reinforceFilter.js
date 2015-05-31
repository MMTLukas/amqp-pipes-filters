module.exports = function StrongarmFilter() {

    this.process = function(body) {
        var input = body.toString();

        var result = input + ' !!!';

        return result;
    }
}
