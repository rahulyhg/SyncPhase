var types = {};

types.JOIN = 1;
types.LEAVE = 2;
types.CURSOR = 3;
types.BEGIN = 4;
types.END = 5;
types.COLOR = 6;
types.WEIGHT = 7;
types.NAME = 8;
types.MESSAGE = 9;
types.AUDIO = 10;
types.VIDEO = 11;
types.INIT = 12; 
types.LINE = 13; 

if (typeof module !== 'undefined') {
	module.exports = types;
} else if (typeof define !== 'undefined') {
	define(function () {
		return types;
	});
} else {
	window.types = types;
}