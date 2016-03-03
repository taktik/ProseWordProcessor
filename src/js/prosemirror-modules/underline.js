'use strict'

var Model = require('prosemirror/dist/model');

class Underline extends Model.MarkType {}
Underline.register('parseDOM', 'span', {parse: 'mark'})
Underline.prototype.serializeDOM = function(node, b) {
	return b.elt('span', {style: 'text-decoration: underline;'})
}
Underline.register('command', 'toggle', {
	derive: true,
	label: 'Underline',
	menu: {
		group: 'inline', rank: 57,
		display: {
			type: 'icon',
			width: 512, height: 658.286,
			path: 'M256,512c121.232,0,219.429-98.196,219.429-219.429V0H384v292.571c0,70.768-57.232,128-128,128s-128-57.232-128-128V0  H36.571v292.571C36.571,413.804,134.768,512,256,512z M0,585.143v73.144h512v-73.144H0z'
		}
	},
	keys: ['Mod-U']
})

exports.Underline = Underline