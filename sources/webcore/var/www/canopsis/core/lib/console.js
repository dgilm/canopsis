define(['consolejs'], function(Ember) {

    delete console['init'];

	return console;
});