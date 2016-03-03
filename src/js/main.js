'use strict';

var $           = require('jquery');
var foundation  = require('foundation');
var ProseMirror = require('prosemirror/dist/edit').ProseMirror;
var Model       = require('prosemirror/dist/model');
var Menu        = require('prosemirror/dist/menu/menu');
require('prosemirror/dist/menu/menubar');
var Align       = require('./prosemirror-modules/alignment').Align;
var Underline   = require('./prosemirror-modules/underline').Underline;
var Schema      = Model.Schema;
var simpleSpec  = new Model.SchemaSpec({
		doc: Model.Doc,
		paragraph: Model.Paragraph,
		block: Model.Block,
		text: Model.Text,
		list_item: Model.ListItem,
		align_left: Align.LeftAlign,
		align_right: Align.RightAlign,
		center: Align.CenterAlign,
		justify: Align.Justify
	}, {
		em: Model.EmMark,
		strong: Model.StrongMark,
		underline: Underline
	});
var simpleSchema = new Schema(simpleSpec);

let pm = new ProseMirror({
	place: document.querySelector('body #prose'),
	doc: document.querySelector('#prosecontent'),
	schema: simpleSchema,
	docFormat: 'dom',
	menuBar: {content: [Menu.inlineGroup, Align.alignGroup]}
});

pm.on('flush', function() {
	$('#prosehtml .content').text(pm.getContent('html'))
})
$(document).foundation();

