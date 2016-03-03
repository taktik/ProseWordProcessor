/*
	Credits to pboysen for this module:
	https://github.com/pboysen/prosemirror-widgets
*/

'use strict'

var Model = require('prosemirror/dist/model');
var Menu = require('prosemirror/dist/menu/menu');
var Dom = require('prosemirror/dist/dom');

function getAlignPos(pm, pos) {
	let node;
	for (;;) {
		node = pm.doc.path(pos.path);
		if (node.type instanceof Align || pos.depth == 0) return pos;
	    pos = pos.shorten();
	}
}

function findAlignWrapper(pm, align) {
	let from = pm.selection.from, to = pm.selection.to, isLeft = align.name == 'leftalign';
	let start = getAlignPos(pm, from);
	let parent = pm.doc.path(start.path);
	if (parent.type instanceof Align) {
		if (isLeft) {
			return pm.tr.lift(new Model.Pos(start.path, 0), new Model.Pos(start.path, parent.size)).apply(pm.apply.scroll);
		} else {
			return pm.tr.setNodeType(getPosInParent(pm, start.shorten(), parent), align, {class: align.style}).apply(pm.apply.scroll);
		}
	} else {
		if (isLeft) return false;  //left is default and doesn't need wrapper
		let end = from.cmp(to) ? getAlignPos(pm, to): start.move(1);
		return pm.tr.wrap(start, end, align, {class: align.style}).apply(pm.apply.scroll);
	}
}

class Align extends Model.Block {
	get attrs() { return {class: new Model.Attribute({default: 'widgets-leftalign'})} }
	get contains() { return 'block'; }
}

Align.prototype.serializeDOM = (node, s) => s.renderAs(node, 'div', node.attrs);

const alignGroup = new Menu.MenuCommandGroup('align');

class LeftAlign extends Align { get style() { return  'widgets-leftalign'}}
class CenterAlign extends Align { get style() { return 'widgets-centeralign'}}
class RightAlign extends Align { get style() { return  'widgets-rightalign'}}
class Justify extends Align { get style() { return  'widgets-justifyalign'}}

function defParser(type,tag,cls) {
	type.register("parseDOM", tag, {
		parse(dom, state) {
			if (!dom.classList.contains(cls)) return false;
		    let attrs = Object.create(null);
		    for (let name in this.attrs) attrs[name] = dom.getAttribute(name);
			state.wrapIn(dom,this,attrs);
		}
	})	
}

function getPosInParent(pm, pos, child) {
	let i = 0, parent = pm.doc.path(pos.path);
	parent.forEach((node,start) => { i = node == child ? start : 0 });
	return new Model.Pos(pos.path,i);
}

defParser(LeftAlign,'div','icons/leftalign.png');
defParser(CenterAlign,'div','widgets-centeralign');
defParser(RightAlign,'div','widgets-rightalign');
defParser(Justify,'div','widgets-justifyalign');

function alignApplies(pm,type) {
	let from = pm.selection.from, isLeft = type.name == 'leftalign'
	let start = getAlignPos(pm,from)
	let parent = pm.doc.path(start.path)
	if (isLeft && !(parent.type instanceof Align)) return true
	return parent.type.name == type.name
}

function defAlign(type, label, path) {
	type.register('command', 'align', {
		run(pm) { return findAlignWrapper(pm,this);},
		active(pm) { return alignApplies(pm, this);},
		label: label,
		menu: {
			group: 'align', rank: 51,
		    display: {
		      type: 'icon',
		      width: 512, height: 587.294,
		      path: path
		    }
		}
	}
);}

defAlign(LeftAlign, 'Left Align', 'M512,0H0v90.353h512V0z M451.765,496.941H0v90.353h451.765V496.941z M286.117,331.294H0v90.354h286.117V331.294z   M376.471,165.647H0V256h376.471V165.647z');
defAlign(CenterAlign, 'Center Align', 'M0,0h512v80.842H0V0z M40.421,444.632h431.158v80.842H40.421V444.632z M134.737,296.421h242.525v80.842H134.737V296.421z   M80.842,148.211h350.316v80.842H80.842V148.211z');
defAlign(RightAlign, 'Right Align', 'M0,0h512v90.353H0V0z M60.235,496.941H512v90.353H60.235V496.941z M225.883,331.294H512v90.354H225.883V331.294z   M135.529,165.647H512V256H135.529V165.647z');
defAlign(Justify, 'Right Align', 'M512,525.474H0v-80.842h512V525.474z M512,80.842H0V0h512V80.842z M512,229.053H0v-80.842h512V229.053z M512,377.263H0  v-80.842h512V377.263z');

Dom.insertCSS('' + 
	'div.widgets-leftalign {   ' +
	'	text-align: left;      ' +
	'}                         ' +
	'div.widgets-centeralign { ' +
	'	text-align: center;    ' +
	'}                         ' +
	'div.widgets-rightalign {  ' +
	'	text-align: right;     ' +
	'}                         ' +
	'div.widgets-justifyalign {' +
	'	text-align: justify;   ' +
	'}'
);

exports.Align = {
	LeftAlign: LeftAlign,
	RightAlign: RightAlign,
	CenterAlign: CenterAlign,
	Justify: Justify,
	alignGroup: alignGroup
}