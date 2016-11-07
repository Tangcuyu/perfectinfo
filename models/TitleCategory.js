var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * TitleCategory Model
 * ==================
 */

var TitleCategory = new keystone.List('TitleCategory', {
	label: '职位名称',
	singular: '职位分类',
	plural: '职位分类',
	autokey: { from: 'name', path: 'key', unique: true }
});

TitleCategory.add({
	name: { type: String, required: true, label:'职位分类' }
});

TitleCategory.relationship({ ref: 'Candidate', path: 'title' });

TitleCategory.register();
