define([], function() {
	//TODO annotations
	if(baseConsole === undefined) {
		var baseConsole = console;
		baseConsole.log('Type console.help() to get more information about canopsis features.');
	}
	initializeConsole= function()
	{
		if(baseConsole.registeredAuthors === undefined) {
			baseConsole.registeredAuthors = [];
		}
		var newConsole = {
			old: baseConsole,
			listen: false,
			count: 0,
			listenVariables: {},
			grep: false,
			collapsed: true,
			verbose: true,
			saveList:['listen', 'count', 'listenVariables', 'grep'],//property item list that has to be savec between page loads

			help: function () {
				baseConsole.log('canopsis console avialables methods:\n\t'+
								' - console.setListen(boolean) to keep track of variables\n\t'+
								' - console.grep("string") filters all output and anly display string output that contains the given string parameter'+
								' - console.send_message("title", "message", "[info|warning|critical]") displays an alert message in the user interface');
			},

			setGrep: function(string) {
				this.grep = string;
			},

			log: function() {

				var args = Array.prototype.slice.call(arguments);

				//production mode
				if (!this.verbose) {
					return;
				}

				//gets call file
				var file_split = new Error().stack.split('\n')[2].split('/'),
					file_location = file_split[file_split.length - 1].replace(')',''),
					dump_args = false,
					message = '',
					argument,
					parsed_args = [],
					printables = ['string', 'boolean', 'number'];

				for (argument in args) {
					if (typeof args[argument] === 'object'){
						dump_args = true;
						break;
					}

					if ($.inArray(typeof args[argument], printables) !== -1) {
						parsed_args.push(args[argument]);
					}

				}

				if (!dump_args) {
					message = parsed_args.join();
					if(!this.grep || message.toLowerCase().indexOf(this.grep.toLowerCase()) !== -1) {
						baseConsole.log("%c  %c[" + file_location + "]%c " + message, 'width:16px; height:16px; no-repeat;','background: #fcfcfc; color: #555', 'background: white; color: black');
					}
				} else {
					baseConsole.log(args);
				}

				if (this.listen) {
					this.count++;
					this.listenVariables[this.count] = message;
					baseConsole.log('listenVariables[' + this.count + '] = ' + message)
				}
			},


			getVar: function (id) {
				if (this.listenVariables[id]) {
					baseConsole.log(this.listenVariables[id]);
				} else {
					baseConsole.log('no variable matches');
				}

			},

			setListen: function(listen) {
				if (listen === false) {
					this.listenVariables = {}
					this.count = 0;
				}
				this.listen = listen;
			},

			send_message: function(message) {
				Notify.message('title', message, 'info')
			},

			groupCollapsed:function () {
				if (this.verbose && this.collapsed) {
					var args = Array.prototype.slice.call(arguments);
					var file_split = new Error().stack.split('\n')[2].split('/'),
						file_location = file_split[file_split.length - 1];
					args.unshift('[' + file_location.replace(')','') + ']');

					baseConsole.groupCollapsed.apply(baseConsole, args);
				}
			},

			groupEnd: function () {
				if (this.verbose && this.collapsed) {
					baseConsole.groupEnd()
				}
			}

		};

		return newConsole;
	}
	console = initializeConsole();

});