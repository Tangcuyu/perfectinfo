var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Customer Model
 * ==========
 */

var Customer = new keystone.List('Customer',{
	label: '客户管理',
	singular: '客户',
	plural: '客户',
	path: 'customers', //这个路径参数对应于keystone.js中的nav 中的相应键的值。在这里就是：'客户管理':'customers'
	map: { name: 'CustomerName'},
	autokey: { from: 'CustomerName', path: 'key', unique: true }
});

Customer.add({
	CustomerName: { type: String, required: true, initial: true, label: '客户名称', default: '有限责任公司' },
	Email: { type: Types.Email, required: true, default: 'test@126.com', label: '联系人邮箱'},
	Address: { type: String, required: true, default: '北京市朝阳区', label: '详细地址' },
	Telephone: { type: String, required: true, default: '010', label: '联系电话' },
	Industry:{ type:String, required: true, default: 'IT', label: '所属行业' },
	SignDate: { type: Types.Date, index: true, label: '签约日期'}
});


/**
 * Relationships
 */

Customer.relationship({ ref: 'worksheet', path: 'username' });
Customer.relationship({ ref: 'Candidate', path: 'precustomer' });


/**
 * Registration
 */

Customer.defaultColumns = 'CustomerName, Email, Telephone, Industry';
Customer.register();
