var types = {};

types.NAME_SET = 1;
types.CURSOR_POSITION = 2;
types.START = 3;
types.STOP = 4;
types.TEXT_MESSAGE = 5;
types.MARKDOWN_MESSAGE = 6;
types.IMAGE_MESSAGE = 7;
types.BOARD_IMAGE = 8;
types.LEAVE = 9;
types.COLOR = 10;
types.WEIGHT = 11;
types.JOIN = 12;

if (typeof module !== 'undefined') {
	module.exports = types;
} else if (typeof define !== 'undefined') {
	define('types', function () {
		return types;
	});
}