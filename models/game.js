var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Game Model
 * ==========
 */

var game = new keystone.List('game', {
	label: '游戏',
	singular: '游戏',
	plural: '游戏',
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true }
});

game.add({
	title: { type: String, required: true, label:'标题'},
	author: { type: Types.Relationship, ref: 'User', index: true, label:'作者' },
	publishedDate: { type: Types.Datetime, label:'发布日期', index: true, dependsOn: { state: 'published' } }
	
});



game.defaultColumns = 'title, author|20%, publishedDate|20%';
game.register();
