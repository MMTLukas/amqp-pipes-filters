function IFilter(){}

IFilter.prototype.process = function(){
  throw new Error("Need to overwrite the process function!");
};

module.exports = IFilter;