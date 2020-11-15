const Discord = require('discord.js');
const Ctoken = process.env.Ctoken;
const prefix = process.env.prefix;
const help = require('./commands.json');
const logolink = "https://i.imgur.com/jkaLM5L.png";
const client = new Discord.Client();
client.login(Ctoken);
client.on("ready",()=>{
    console.log("Questioning begins!");
});
var joiningservermsg = {"channel":null,"message":null,emoji:null};

client.on("message",(msg)=>{
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;
    //Debugging Checks
    const cmd = msg.content.slice(prefix.length).toLowerCase();
    if(cmd==="checkadd"){client.emit("guildMemberAdd", msg.member);}
    
    let Alit = msg.guild.roles.cache.find(role => role.name === "Alit");

//Commands
        //TAGS
    if(cmd==="tag bias"){
        msg.channel.send("Confirmation Bias :man_tipping_hand:");
    }
    if(cmd==="tag introduce") {msg.channel.send("Hi! I'm Revie :robot:. I'm Reverie's own Discord bot. \nYou can use ?help to see my commands. ")}
    //ADD MORE TAGS HERE
    


    if(msg.member.roles.cache.find(Alit)==Alit){
        //MOD COMMANDS
            //announce messages
        if(cmd.slice(0,"announce".length)==="announce"){ //Make announcements in announcement channel
            const embed = new Discord.MessageEmbed()
            .setTitle("Hey Everyone!",logolink)
            .setColor(0xff0000)
            .setDescription(msg.content.slice("announce  ".length))
            .setThumbnail(logolink);
            msg.guild.channels.cache.find(ch => ch.name === 'announcements').send(embed);
            msg.guild.channels.cache.find(ch => ch.name === 'announcements').send("@everyone");
        }

                //join server reaction roles
        if(cmd.slice(0,"join channel".length) === "join channel"){//Set Reaction role message Channel 
            joiningservermsg["channel"] = msg.guild.channels.cache.find(ch => ch.name === cmd.slice("join channel ".length));
            msg.channel.send(`Join Channel set to ${joiningservermsg["channel"]}`);
        }
        if(cmd.slice(0,"join msg".length) === "join msg"){//Set Reaction role message from channel
            if (joiningservermsg["channel"]==null) {msg.channel.send("Please set a channel first");return;}
            joiningservermsg["channel"].messages.fetch(cmd.slice("join msg ".length))
            .then(message => joiningservermsg["message"]=message)
            .catch(console.error);
            msg.channel.send(`Join Message set!`);
            //console.log(joiningservermsg[0]);
        }
        if(cmd.slice(0,"join emoji".length) === "join emoji"){//Set Reaction role emoji Channel 
            joiningservermsg["emoji"] = cmd.slice("join emoji ".length);
            msg.channel.send(`Join Emoji set to ${joiningservermsg["emoji"]}`);
        }
    }

    //HELP COMMAND
    if(cmd === "help"){
        var helpstring = "";
        for (cmdh in help){
            helpstring += "**"+cmdh + "** : " + help[cmdh] + "\n\n";
        }
        const embed = new Discord.MessageEmbed()
        .setTitle("Here's a list of commands for you")
        .setColor(0xff0000)
        .setDescription(helpstring)
        .setThumbnail(logolink);
        msg.channel.send(embed);
        
        //msg.channel.send(helpstring);
    }
    
});


//Welcome message
client.on('guildMemberAdd', member => {
    const channel = member.guild.channels.cache.find(ch => ch.name === 'welcome');
    const infochannel = member.guild.channels.cache.find(ch => ch.name === 'info');
    if (!channel) 
    {
        console.log("channel not found");
        return} ;
    channel.send(`Hi ${member} Welcome to Reverie! \nPlease head to ${infochannel} to know about the community server!`);
  });
  

//Setting up reaction role for joining
client.on('messageReactionAdd', (messageReaction,user)=>{
    if(messageReaction.message.id === joiningservermsg["message"].id){ //Reaction Role function
        if(joiningservermsg["emoji"]===null || (messageReaction.emoji.toString() === joiningservermsg.emoji.toString())){
            let roleToAdd = messageReaction.message.guild.roles.cache.find(role => role.name === "reverian");
            let addrole =  messageReaction.message.guild.member(user).roles.add(roleToAdd).catch(console.error);
        }
    }
});



