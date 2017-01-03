var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * IPaddress Model
 * ==========
 */

var IPaddress = new keystone.List('IPaddress', {
	label: 'IP地址扫描',
	singular: 'IP地址',
	plural: 'IP地址',
	map: { name: 'ip' },
	path: 'ipaddresses',
	autokey: { path: 'ipadd', from: 'scanId', unique: true }
});

IPaddress.add({
	scanid: { type: String, label:'扫描时间'},
	ip: { type: String, label:'IP地址'},
	timestamp: { type: String, label: '时间戳'},
	author: { type: Types.Relationship, ref: 'User', label:'操作员' },
	port: { type: String, label: '端口'},
	proto: { type: String, label: '协议'},
	status: { type: String, label: '状态'},
	reason: { type: String, label: '原因'},
	ttl: { type: String, label: '生存时间'}	
});

IPaddress.defaultColumns = 'ip|20%, port|10%, proto|10%, ttl|10%, scanid|20%, author|20%';
IPaddress.register();
