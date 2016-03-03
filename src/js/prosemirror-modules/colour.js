'use strict'

var Model = require('prosemirror/dist/model');

class Colour extends Model.MarkType {}
Colour.register('command', 'toggle', {
	derive: true,
	label: "Set Color",
	menu: {
		group: "inline", rank: 58,
		display: {
			type: 'icon',
			width: 512,
			height: 448,
			path: 'M234.667,0L117.333,298.667h48l24-64h133.334l24,64h48L277.333,0H234.667z M205.333,192L256,56.854L306.667,192H205.333zM0,362.667h512V448H0V362.667z'
		}
	}
});
Colour.register('parseMarkdown', 'color', {parse: 'mark'});
Colour.register('parseDOM', 'color', {parse: 'mark'});
Colour.prototype.openMarkdown = '*c*';
Colour.prototype.closeMarkdown = '*c*';
Colour.prototype.serializeDOM = function(node, b) {
	return b.elt('color', {style: 'color: #' + that.color + ';'})
};

exports.Colour = Colour