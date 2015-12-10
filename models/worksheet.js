var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
	定义工单集合参数：wsheet 为工单号
*/
	
var worksheet = new keystone.List('worksheet',{
	label: '工单',
	singular: '工单',
	plural: '工单',
	path: 'worksheets',
	map: { name: 'title'},
	autokey: { from: '_id', path: 'wid', unique: true }
});

/**
	定义工单集合中文档包含的所有域
*/

worksheet.add({
	title: { type: String, required: true, initial: true, default: '概况描述本工单的主题：客户名称+支持类型', label:'标题' },
	username: { type: Types.Relationship, ref: 'Customer', label:'客户名称' },
	state: { type: Types.Select, options: '草稿, 发布, 归档', default: '发布', index: true, label:'工单状态' },
	author: { type: Types.Relationship, ref: 'User', index: true, label:'支持工程师' },
	Date: { type: Types.Datetime, index: true, label:'支持日期&时间' },
	image: { type: Types.CloudinaryImage, label:'图像' },
	content: {
		detail: { type: Types.Html, wysiwyg: true, height: 150, label:'故障描述' },
		result: { type: Types.Html, wysiwyg: true, height: 400, label:'处理结果' },
		},
	evaluate: {  type: Types.Select, options: '优秀, 良好, 一般, 很差', default: '优秀', index: true, label:'客户评价' },
	manhours: { type:Number, label:'工时', required: true, default:'1'}
});

/**
	在keystone.js中注册worksheet列表
*/
// worksheet.addPattern('standard meta');
worksheet.defaultColumns = 'title , username|30%, author|10%, Date|20%';
worksheet.register();