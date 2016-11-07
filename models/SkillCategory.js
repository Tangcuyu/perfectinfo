var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * SkillCategory Model
 * ==================
 */

var SkillCategory = new keystone.List('SkillCategory', {
	label: '专业技能',
	singular: '专业技能',
	plural: '专业技能',
	autokey: { from: 'name', path: 'key', unique: true }
});

SkillCategory.add({
	name: { type: String, required: true, label:'专业技能名称' }
});

SkillCategory.relationship({ ref: 'Candidate', path: 'skills' });

SkillCategory.register();
