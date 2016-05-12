var keystone = require('keystone'),
    Types = keystone.Field.Types;
 
var gear = new keystone.List('Gear', {
    autokey: { path: 'slug', from: 'key', unique: true },
    map: { name: 'key' },
   
});
 
gear.add({
    key: { type: String, required: true },
    value:{type:Number}
});
 
//Post.defaultColumns = 'title, state|20%, author, publishedAt|15%'
gear.register();