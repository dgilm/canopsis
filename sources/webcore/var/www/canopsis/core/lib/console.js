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

			local_storage_keys: ['grep', 'verbose', 'listen', 'collapsed'],
			old: baseConsole,
			count: 0,
			listenVariables: {},
			listen: false,
			grep: false,
			collapsed: true,
			verbose: true,

			help: function () {
				baseConsole.log('canopsis console avialables methods:\n\t'+
								' - console.setListen(boolean) to keep track of variables\n\t'+
								' - console.grep("string") filters all output and anly display string output that contains the given string parameter'+
								' - console.send_message("title", "message", "[info|warning|critical]") displays an alert message in the user interface');
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

					var i = printables.length,
						in_array = false;

					while (i--) {
						if (printables[i] === typeof args[argument]) {
							in_array = true;
						}
					}

					if (in_array) {
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
				sessionStorage.setItem("console_listen",listen);
			},

			set: function(property, value) {
				this[property] = value;
				this.save_to_local_storage();
			},

			load_local_storage: function() {

				//loads local storage stored values and set console with these values if they exists
				var key, params;

				//try {
					params = JSON.parse(sessionStorage.getItem('console'));
					this.log('params');
					this.log(params);
					for (key in params){
						this[key] = params[key];
					}
				/*
				} catch (e) {
					this.log('unable to load informations from local storage -> local storage is not reachable');
				}*/

			},

			save_to_local_storage: function(property) {
				//dumps console params to local storage
				var key, params = {};

				//try {
					for (key in this.local_storage_keys){
						params[key] = this[key];
					}
					localStorage.setItem('console', JSON.stringify(params));
				/*} catch (e) {
					this.log('unable to load informations from local storage -> local storage is not reachable');
				}*/
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
	console.load_local_storage();

});