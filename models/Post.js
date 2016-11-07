var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Post Model
 * ==========
 */

var Post = new keystone.List('Post', {
	label: '课程',
	singular: '课程',
	plural: '课程',
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
	drilldown: 'author categories'
});

Post.add({
	title: { type: String, required: true, label:'标题'},
	state: { type: Types.Select, options: [{value:'draft',label:'草稿'},{value:'published',label:'发布'},{value:'archived',label:'归档'}], default: 'draft', index: true, label:'状态' },
	author: { type: Types.Relationship, ref: 'User', index: true, label:'作者' },
	publishedDate: { type: Types.Datetime, label:'发布日期', index: true, dependsOn: { state: 'published' } },
	image: { type: Types.CloudinaryImage, label:'图像' },
	content: {
		brief: { type: Types.Html, wysiwyg: true, height: 150 },
		extended: { type: Types.Html, wysiwyg: true, height: 400 }
	},
	categories: { type: Types.Relationship, ref: 'PostCategory', many: true, label:'分类' }
});

Post.schema.virtual('content.full').get(function() {
	return this.content.extended || this.content.brief;
});

Post.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
Post.register();
