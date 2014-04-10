define([], function() {
	//TODO annotations
	if(baseConsole === undefined) {
		var baseConsole = console;
		baseConsole.log('Type console.help() to get more information about canopsis features.');
	}
	initializeConsole= function(logAuthor)
	{
		if(baseConsole.registeredAuthors === undefined) {
			baseConsole.registeredAuthors = [];
		}
		baseConsole.registeredAuthors.push(logAuthor);
		var newConsole = {
			old: baseConsole,
			listen: false,
			count: 0,
			listenVariables: {},
			grep: false,
			saveList:['listen', 'count', 'listenVariables', 'grep'],//property item list that has to be savec between page loads

			help: function () {
				baseConsole.log('canopsis console avialables methods:\n\t'+
								' - console.setListen(boolean) to keep track of variables\n\t'+
								' - console.grep("string") filters all output and anly display string output that contains the given string parameter');
			},

			setGrep: function(string) {
				this.grep = string;
			},

			log: function(message) {

				if (typeof message === 'string') {
					if(baseConsole._filterAuthors === undefined || baseConsole._filterAuthors.contains(logAuthor)) {
						if(this.grep) {
							if(message.toLowerCase().indexOf(this.grep.toLowerCase()) !== -1) {
								baseConsole.log("%c  %c[" + logAuthor + "]%c " + message, 'width:16px; height:16px; background: url(http://goossens-chocolatier.com/wp-content/themes/goossens/images/info_icon.png) no-repeat;','background: #fcfcfc; color: #555', 'background: white; color: black');
							}
						} else {
							baseConsole.log("%c  %c[" + logAuthor + "]%c " + message, 'width:16px; height:16px; background: url(http://goossens-chocolatier.com/wp-content/themes/goossens/images/info_icon.png) no-repeat;','background: #fcfcfc; color: #555', 'background: white; color: black');

						}
					} else {
						baseConsole.log(message);
					}
				} else {
					baseConsole.log(message);
				}
				if (this.listen) {
					this.count++;
					this.listenVariables[this.count] = message;
					baseConsole.log('listenVariables[' + this.count + '] = ' + message)
				}
			},

			group:function(){
				baseConsole.group(arguments);
			},
			groupCollapsed: function(){
				baseConsole.groupCollapsed(arguments);
			},
			groupEnd: function(){
				baseConsole.groupEnd(arguments);
			},
			getVar: function (id) {
				if (this.listenVariables[id]) {
					baseConsole.log(this.listenVariables[id]);
				} else {
					baseConsole.log('no variable matches');
				}

			},

			filterAuthors: function(authors) {
				baseConsole._filterAuthors = authors;
			},

			listAuthors: function() {
				return baseConsole.registeredAuthors;
			},

			setListen: function(listen) {
				if (listen === false) {
					this.listenVariables = {}
					this.count = 0;
				}
				this.listen = listen;
			},


			//TODO grep
			//TODO persistance
			//TODO console debug mode with log id number displayed and stack trace included
		};

		return newConsole;
	}

	if(proxiedDefine == undefined) {
		var proxiedDefine = define; // Preserving original function
		cdefine = function() {
			if(arguments.length === 2)
			{
				//add module to args
				arguments[0].unshift("module");

				var proxiedCallback = arguments[1];

				arguments[1] = function() {
					//console = initializeConsole(arguments[0].id);

					console = initializeConsole(arguments[0].id);

					var args;
					if(typeof arguments == "object") {
						//transform object into array
						args = [];
						for (key in arguments) {
							args.push(arguments[key]);
						};
						args.shift();
					}

					return proxiedCallback.apply(this, args);
				};
			}
			return proxiedDefine.apply(this, arguments);
		}
	}

	// console.grep = function()
});