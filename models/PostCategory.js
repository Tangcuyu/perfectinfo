var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * PostCategory Model
 * ==================
 */

var PostCategory = new keystone.List('PostCategory', {
	label: '课程分类',
	singular: '课程分类',
	plural: '课程分类',
	autokey: { from: 'name', path: 'key', unique: true }
});

PostCategory.add({
	name: { type: String, required: true, label:'分类名称' }
});

PostCategory.relationship({ ref: 'Post', path: 'categories' });

PostCategory.register();
