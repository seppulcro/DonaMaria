var Discord = require("discord.js");
var request = require("superagent");
const chalk = require('chalk');
const errorC = chalk.bold.red;
var botToken = "MTg0NDMwODYxMjA1MjQxODU4.CiUUwg.g7ez9ly0twKuEJ2f31mIcH1tu5k";
var SOUNDDIR = "sounds/"
var bot = new Discord.Client();

//when the bot is ready
bot.on("ready", function () {
	for (var channel of bot.channels){
		console.log(chalk.green("Bot joined:")+" "+channel.name+"@"+channel.server);
	}
});

//when the bot disconnects
bot.on("disconnected", function () {
	//alert the console
	console.log(errorC("Disconnected!"));
	//exit node.js with an error
	process.exit(1);
});

//when the bot receives a message
bot.on("message", function (msg) {

	// Sounds
	if(msg.content.startsWith("!som")){
		var rest = msg.content.split(" ");
		rest.splice(0,1);
		rest=rest.join(" ");
		var sound = SOUNDDIR+rest+".mp3"
		bot.joinVoiceChannel(msg.author.voiceChannel.id, function (err, con){
			if (err){ return console.log(err); }
			con.playFile(sound, function(err, intent){
				intent.on("end", function(){
					con.destroy();
				});
			});
		});
	}

	//List voice channels
	if (msg.content == "%listVoice"){
		for (var channel of msg.channel.server.channels) {
			if (channel instanceof Discord.VoiceChannel) {
				bot.reply(msg, channel.name + " - " + channel.id);
			}
		}
	}

	//Join voice channel
	if (msg.content.startsWith("&voice")) {
		var rest = msg.content.split(" ");
		rest.splice(0,1);
		rest=rest.join(" ");
		//bot.reply(msg, "Trying to join: " + channel.name + " " + channel.id);
		bot.joinVoiceChannel(rest).catch(error);
	}

});

// This function is used by &init to handle connection errors
function error(e) {
	console.log(errorC(e.stack));
	process.exit(0);
}

bot.loginWithToken(botToken);
