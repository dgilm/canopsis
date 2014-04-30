define(['consolejs'], function(Ember) {
    delete console.__proto__['constructor'];
    delete console.__proto__['isPrototypeOf'];
    delete console.__proto__['toLocaleString'];
    delete console.__proto__['valueOf'];
    delete console['init'];

	return console;
});