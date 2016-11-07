var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * HR Model
 * ==========
 */

var Candidate = new keystone.List('Candidate',{
	label: '候选人',
	singular: '候选人',
	plural: '候选人',
	autokey: { path: 'candid', from: 'name', unique: true },
	drilldown: 'title',
	map: { name: 'name' },
	sortable: true
});

Candidate.add({
	name: { type: Types.Name, required: true, index: true, label:'姓名' },
	age: { type: Types.Number, index: true , min:18, max:60, label:'年龄'},
    sex: { type: Types.Select, options: '男,女' , label:'性别'},
    image: { type: Types.CloudinaryImage, label:'照片' },
    state: { type: Types.Select, options: [{value:'draft',label:'未面试'},{value:'published',label:'初次面试'},{value:'archived',label:'入职'}], default: 'draft', index: true, label:'面试状态' },
    publishedDate: { type: Types.Datetime, label:'面试日期', index: true, dependsOn: { state: 'published' } },
    address: {type: String , label: '家庭住址'},
    hometown: {type: String , width: 'medium', label: '家乡'},
    title: {type: Types.Relationship, ref:'TitleCategory', width: 'short', label: '应聘职位'},
    skills: { type: Types.Relationship, ref: 'SkillCategory', many: true, label:'专业技能' },
    level: { type: Types.Select, options: '高级,中级,初级' , label:'级别'},
    rsalary: {type: Types.Money, label:'薪资要求'},
    school: {type: String , width:'short', label: '毕业院校'},
    eduction: {type: Types.Select, options: '博士,硕士,本科,专科,高中', label: '学历'},
    experience: {type: Types.Number, label: '工作经验'},
    mobile: {type: Types.Number, label:'手机号码'},
    period: { type: Types.Select, options: [{value:'draft',label:'待定'},{value:'week',label:'一周之内'},{value:'month',label:'一月之内'},{value:'ontime',label:'随时'}], label:'预计入职时间'},
    evaluate: {type: Types.Html, wysiwyg: true, height: 150, label:'初试评价' },
    precustomer: {type: Types.Relationship, required: true, default:'未推荐', ref: 'Customer', label:'推荐客户'}
	
});

// Provide access to Keystone
Candidate.schema.virtual('canAccessKeystone').get(function() {
	return this.isAdmin;
});


/**
 * Relationships
 */

Candidate.relationship({ ref: 'Post', path: 'author' });
Candidate.relationship({ ref: 'Customer', path: 'author' });



/**
 * Registration
 */

Candidate.defaultColumns = 'name, title, experience, precustomer|20%, rsalary';
Candidate.register();
