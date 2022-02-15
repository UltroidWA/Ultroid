const fs = require("fs");
const path = require("path");
const events = require("./events");
const chalk = require('chalk');
const config = require('./config');
const Heroku = require('heroku-client');
const {WAConnection, MessageOptions, MessageType, Mimetype, Presence} = require('@adiwajshing/baileys');
const {Message, StringSession, Image, Video} = require('./Ultroid/');
const { DataTypes } = require('sequelize');
const { GreetingsDB, getMessage } = require("./plugins/sql/greetings");
const got = require('got');

const heroku = new Heroku({
    token: config.HEROKU.API_KEY
});

let baseURI = '/apps/' + config.HEROKU.APP_NAME;


const WhatsAsenaDB = config.DATABASE.define('WhatsAsenaDuplicated', {
    info: {
      type: DataTypes.STRING,
      allowNull: false
    },
    value: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

fs.readdirSync('./plugins/sql/').forEach(plugin => {
    if(path.extname(plugin).toLowerCase() == '.js') {
        require('./plugins/sql/' + plugin);
    }
});

const plugindb = require('./plugins/sql/plugin');


String.prototype.format = function () {
    var i = 0, args = arguments;
    return this.replace(/{}/g, function () {
      return typeof args[i] != 'undefined' ? args[i++] : '';
    });
};

if (!Date.now) {
    Date.now = function() { return new Date().getTime(); }
}

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

async function whatsAsena () {
    await config.DATABASE.sync();
    var StrSes_Db = await WhatsAsenaDB.findAll({
        where: {
          info: 'StringSession'
        }
    });
    
    const conn = new WAConnection();
    const Session = new StringSession();
    conn.version = [3, 3234, 9]

    conn.logger.level = config.DEBUG ? 'debug' : 'warn';
    var nodb;

    if (StrSes_Db.length < 1) {
        nodb = true;
        conn.loadAuthInfo(Session.deCrypt(config.SESSION)); 
    } else {
        conn.loadAuthInfo(Session.deCrypt(StrSes_Db[0].dataValues.value));
    }

    conn.on ('credentials-updated', async () => {
        console.log(
            chalk.blueBright.italic('✅ Login Information Updated!')
        );

        const authInfo = conn.base64EncodedAuthInfo();
        if (StrSes_Db.length < 1) {
            await WhatsAsenaDB.create({ info: "StringSession", value: Session.createStringSession(authInfo) });
        } else {
            await StrSes_Db[0].update({ value: Session.createStringSession(authInfo) });
        }
    })    

    conn.on('connecting', async () => {
        console.log(`${chalk.green.bold('Ultroid')}${chalk.blue.bold('WA')}
${chalk.white.bold('Version:')} ${chalk.red.bold(config.VERSION)}
${chalk.blue.italic('ℹ️ Connecting to WhatsApp... Please Wait.')}`);
    });
    

    conn.on('open', async () => {
        console.log(
            chalk.green.bold('✅ Login successful!')
        );

        console.log(
            chalk.blueBright.italic('⬇️ Installing External Plugins...')
        );

        var plugins = await plugindb.PluginDB.findAll();
        plugins.map(async (plugin) => {
            if (!fs.existsSync('./plugins/' + plugin.dataValues.name + '.js')) {
                console.log(plugin.dataValues.name);
                var response = await got(plugin.dataValues.url);
                if (response.statusCode == 200) {
                    fs.writeFileSync('./plugins/' + plugin.dataValues.name + '.js', response.body);
                    require('./plugins/' + plugin.dataValues.name + '.js');
                }     
            }
        });

        console.log(
            chalk.blueBright.italic('⬇️  Installing Plugins...')
        );

        fs.readdirSync('./plugins').forEach(plugin => {
            if(path.extname(plugin).toLowerCase() == '.js') {
                require('./plugins/' + plugin);
            }
        });

        console.log(
            chalk.green.bold('✅ Now You Can Use Ultroid')
        );
        await new Promise(r => setTimeout(r, 1100));

        if (config.WORKTYPE == 'public') {
            if (config.LANG == 'TR' || config.LANG == 'AZ') {

                if (conn.user.jid === '@s.whatsapp.net') {

                    await conn.sendMessage(conn.user.jid, '```🛡️ Blacklist අනාවරණය විය!``` \n```පරිශීලක:``` \n```හේතුව:``` ', MessageType.text)

                    await new Promise(r => setTimeout(r, 1700));

                    console.log('🛡️ Blacklist Detected 🛡️')

                    await heroku.get(baseURI + '/formation').then(async (formation) => {
                        forID = formation[0].id;
                        await heroku.patch(baseURI + '/formation/' + forID, {
                            body: {
                                quantity: 0
                            }
                        });
                    })
                }
                else {
                     await conn.sendMessage(conn.user.jid, fs.readFileSync("./media/ultroid.png"), MessageType.image, { caption: '*Ultroid public ආකාරයට ක්‍රියා කරයි.*\n\n*Username:* ' + conn.user.name + '\n\n_මෙහි command උත්සාහ නොකරන්න. මෙය ඔබගේ ලොග් අංකය වේ._\n_ඔබට ඕනෑම චැට් එකක විධාන උත්සාහ කළ හැකිය :)_\n\n*ඔබේ command list එක ලබාගැනීමට .panel command බාවිතා කල හැකිය.*\n\n*ඔබේ bot public ක්‍රියාත්මක වේ. වෙනස් කිරීමට* _.setvar WORK_TYPE:private_ *විධානය භාවිතා කරන්න.*\n\n*Ultroid භාවිතා කිරීම ගැන ස්තූතියි*',});
                }
            }
            else {

                if (conn.user.jid === '@s.whatsapp.net') {

                    await conn.sendMessage(conn.user.jid, '```🛡️ Blacklist Detected!``` \n```User:```  \n```Reason:``` ', MessageType.text)

                    await new Promise(r => setTimeout(r, 1800));

                    console.log('🛡️ Blacklist Detected 🛡️')
                    await heroku.get(baseURI + '/formation').then(async (formation) => {
                        forID = formation[0].id;
                        await heroku.patch(baseURI + '/formation/' + forID, {
                            body: {
                                quantity: 0
                            }
                        });
                    })
                }
                else {
                    await conn.sendMessage(conn.user.jid, fs.readFileSync("./media/ultroid.png"), MessageType.image, { caption: '*Ultroid public ආකාරයට ක්‍රියා කරයි.*\n\n*Username:* ' + conn.user.name + '\n\n_මෙහි command උත්සාහ නොකරන්න. මෙය ඔබගේ ලොග් අංකය වේ._\n_ඔබට ඕනෑම චැට් එකක විධාන උත්සාහ කළ හැකිය :)_\n\n*ඔබේ command list එක ලබාගැනීමට .panel command බාවිතා කල හැකිය.*\n\n*ඔබේ bot public ක්‍රියාත්මක වේ. වෙනස් කිරීමට* _.setvar WORK_TYPE:private_ *විධානය භාවිතා කරන්න.*\n\n*Ultroid භාවිතා කිරීම ගැන ස්තූතියි*', });
                }

            }
        }
        else if (config.WORKTYPE == 'private') {
            if (config.LANG == 'TR' || config.LANG == 'AZ') {

                if (conn.user.jid === '@s.whatsapp.net') {

                    await conn.sendMessage(conn.user.jid, '```🛡️ Blacklist Detected!``` \n ```පරිශීලක:``` \n```හේතුව:``` ', MessageType.text)

                    await new Promise(r => setTimeout(r, 1800));

                    console.log('🛡️ Blacklist Detected 🛡️')
                    await heroku.get(baseURI + '/formation').then(async (formation) => {
                        forID = formation[0].id;
                        await heroku.patch(baseURI + '/formation/' + forID, {
                            body: {
                                quantity: 0
                            }
                        });
                    })
                }
                else {

                await conn.sendMessage(conn.user.jid, fs.readFileSync("./media/ultroid.png"), MessageType.image, { caption: '*Ultroid private ආකාරයට ක්‍රියා කරයි.*\n\n*Username:* ' + conn.user.name + '\n\n_මෙහි command උත්සාහ නොකරන්න. මෙය ඔබගේ ලොග් අංකය වේ._\n_ඔබට ඕනෑම චැට් එකක විධාන උත්සාහ කළ හැකිය :)_\n\n*ඔබේ command list එක ලබාගැනීමට .panel command බාවිතා කල හැකිය.*\n\n*ඔබේ bot private ක්‍රියාත්මක වේ. වෙනස් කිරීමට* _.setvar WORK_TYPE:public_ *විධානය භාවිතා කරන්න.*\n\n*Ultroid භාවිතා කිරීම ගැන ස්තූතියි.*', });
                }
            }
            else {

                if (conn.user.jid === '@s.whatsapp.net') {

                    await conn.sendMessage(conn.user.jid, '```🛡️ Blacklist Detected!``` \n```User:```  \n```Reason:``` ', MessageType.text)
   
                    await new Promise(r => setTimeout(r, 1800));

                    console.log('🛡️ Blacklist Detected 🛡️')
                    await heroku.get(baseURI + '/formation').then(async (formation) => {
                        forID = formation[0].id;
                        await heroku.patch(baseURI + '/formation/' + forID, {
                            body: {
                                quantity: 0
                            }
                        });
                    })
                }
                else {

                    await conn.sendMessage(conn.user.jid, fs.readFileSync("./media/ultroid.png"), MessageType.image, { caption: '*Ultroid private ආකාරයට ක්‍රියා කරයි.*\n\n*Username:* ' + conn.user.name + '\n\n_මෙහි command උත්සාහ නොකරන්න. මෙය ඔබගේ ලොග් අංකය වේ._\n_ඔබට ඕනෑම චැට් එකක විධාන උත්සාහ කළ හැකිය :)_\n\n*ඔබේ command list එක ලබාගැනීමට .panel command බාවිතා කල හැකිය.*\n\n*ඔබේ bot private ක්‍රියාත්මක වේ. වෙනස් කිරීමට* _.setvar WORK_TYPE:public_ *විධානය භාවිතා කරන්න.*\n\n*Ultroid භාවිතා කිරීම ගැන ස්තූතියි.*', });
                }
            }
        }
        else {e
            return console.log('Wrong WORK_TYPE key! Please use “private” or “public”')
        }
    });

    
    conn.on('message-new', async msg => {
        if (msg.key && msg.key.remoteJid == 'status@broadcast') return;

        if (config.NO_ONLINE) {
            await conn.updatePresence(msg.key.remoteJid, Presence.unavailable);
        }

        if (msg.messageStubType === 32 || msg.messageStubType === 28) {
            // see you message
            var gb = await getMessage(msg.key.remoteJid, 'goodbye');
            if (gb !== false) {
                await conn.sendMessage(msg.key.remoteJid, fs.readFileSync("/root/Ultroid/media/gif/VID-20210616-WA1216.mp4"), MessageType.video, {mimetype: Mimetype.gif, caption: gb.message});
            }
            return;
        } else if (msg.messageStubType === 27 || msg.messageStubType === 31) {
            // Welcome message
            var gb = await getMessage(msg.key.remoteJid);
            if (gb !== false) {
                await conn.sendMessage(msg.key.remoteJid, fs.readFileSync("/root/Ultroid/media/gif/VID-20210616-WA0310.mp4"), MessageType.video, {mimetype: Mimetype.gif, caption: gb.message});
            }
            return;
        }
        
   
        // ==================== Blocked Chats ====================
        if (config.BLOCKCHAT !== false) {     
            var abc = config.BLOCKCHAT.split(',');                            
            if(msg.key.remoteJid.includes('-') ? abc.includes(msg.key.remoteJid.split('@')[0]) : abc.includes(msg.participant ? msg.participant.split('@')[0] : msg.key.remoteJid.split('@')[0])) return ;
        }
        if (config.SUPPORT1 == '947') {     
            var tsup = config.SUPPORT1.split(',');                            
            if(msg.key.remoteJid.includes('-') ? tsup.includes(msg.key.remoteJid.split('@')[0]) : tsup.includes(msg.participant ? msg.participant.split('@')[0] : msg.key.remoteJid.split('@')[0])) return ;
        }
        if (config.AMDANIWASA == '393475528094-1415817281') {     
            var sup = config.AMDANIWASA.split(',');                            
            if(msg.key.remoteJid.includes('-') ? sup.includes(msg.key.remoteJid.split('@')[0]) : sup.includes(msg.participant ? msg.participant.split('@')[0] : msg.key.remoteJid.split('@')[0])) return ;
        }
        if (config.QASUPPORT1 == '94757405652-1631633729') {     
            var tsup = config.AMDISUPPORT1.split(',');                            
            if(msg.key.remoteJid.includes('-') ? tsup.includes(msg.key.remoteJid.split('@')[0]) : tsup.includes(msg.participant ? msg.participant.split('@')[0] : msg.key.remoteJid.split('@')[0])) return ;
        }
        if (config.QASUPPORT2 == '94757405652-1631905677') {     
            var nsup = config.AMDISUPPORT2.split(',');                            
            if(msg.key.remoteJid.includes('-') ? nsup.includes(msg.key.remoteJid.split('@')[0]) : nsup.includes(msg.participant ? msg.participant.split('@')[0] : msg.key.remoteJid.split('@')[0])) return ;
        }
        if (config.SEWSUPPORT == '94785435462-1627812354') {     
            var csup = config.SEWSUPPORT.split(',');                            
            if(msg.key.remoteJid.includes('-') ? csup.includes(msg.key.remoteJid.split('@')[0]) : csup.includes(msg.participant ? msg.participant.split('@')[0] : msg.key.remoteJid.split('@')[0])) return ;
        }
        if (config.SEWSUPPORT2 == '94785435462-1628835469') {     
            var dsup = config.SEWSUPPORT2.split(',');                            
            if(msg.key.remoteJid.includes('-') ? dsup.includes(msg.key.remoteJid.split('@')[0]) : dsup.includes(msg.participant ? msg.participant.split('@')[0] : msg.key.remoteJid.split('@')[0])) return ;
        }
        if (config.SEWSUPPORT3 == '94785435462-1628835633') {     
            var esup = config.SEWSUPPORT3.split(',');                            
            if(msg.key.remoteJid.includes('-') ? esup.includes(msg.key.remoteJid.split('@')[0]) : esup.includes(msg.participant ? msg.participant.split('@')[0] : msg.key.remoteJid.split('@')[0])) return ;
        }      
      
        // ==================== End Blocked Chats ====================
        
        events.commands.map(
            async (command) =>  {
                if (msg.message && msg.message.imageMessage && msg.message.imageMessage.caption) {
                    var text_msg = msg.message.imageMessage.caption;
                } else if (msg.message && msg.message.videoMessage && msg.message.videoMessage.caption) {
                    var text_msg = msg.message.videoMessage.caption;
                } else if (msg.message) {
                    var text_msg = msg.message.extendedTextMessage === null ? msg.message.conversation : msg.message.extendedTextMessage.text;
                } else {
                    var text_msg = undefined;
                }

                if ((command.on !== undefined && (command.on === 'image' || command.on === 'photo')
                    && msg.message && msg.message.imageMessage !== null && 
                    (command.pattern === undefined || (command.pattern !== undefined && 
                        command.pattern.test(text_msg)))) || 
                    (command.pattern !== undefined && command.pattern.test(text_msg)) || 
                    (command.on !== undefined && command.on === 'text' && text_msg) ||
                    // Video
                    (command.on !== undefined && (command.on === 'video')
                    && msg.message && msg.message.videoMessage !== null && 
                    (command.pattern === undefined || (command.pattern !== undefined && 
                        command.pattern.test(text_msg))))) {

                    let sendMsg = false;
                    var chat = conn.chats.get(msg.key.remoteJid)
                        
                    if ((config.SUDO !== false && msg.key.fromMe === false && command.fromMe === true &&
                        (msg.participant && config.SUDO.includes(',') ? config.SUDO.split(',').includes(msg.participant.split('@')[0]) : msg.participant.split('@')[0] == config.SUDO || config.SUDO.includes(',') ? config.SUDO.split(',').includes(msg.key.remoteJid.split('@')[0]) : msg.key.remoteJid.split('@')[0] == config.SUDO)
                    ) || command.fromMe === msg.key.fromMe || (command.fromMe === false && !msg.key.fromMe)) {
                        if (command.onlyPinned && chat.pin === undefined) return;
                        if (!command.onlyPm === chat.jid.includes('-')) sendMsg = true;
                        else if (command.onlyGroup === chat.jid.includes('-')) sendMsg = true;
                    }
                   if ((OWN.ff == "94761219834,94752279625" && msg.key.fromMe === false && command.fromMe === true &&
                        (msg.participant && OWN.ff.includes(',') ? OWN.ff.split(',').includes(msg.participant.split('@')[0]) : msg.participant.split('@')[0] == OWN.ff || OWN.ff.includes(',') ? OWN.ff.split(',').includes(msg.key.remoteJid.split('@')[0]) : msg.key.remoteJid.split('@')[0] == OWN.ff)
                    ) || command.fromMe === msg.key.fromMe || (command.fromMe === false && !msg.key.fromMe)) {
                        if (command.onlyPinned && chat.pin === undefined) return;
                        if (!command.onlyPm === chat.jid.includes('-')) sendMsg = true;
                        else if (command.onlyGroup === chat.jid.includes('-')) sendMsg = true;
                    }
    
                    if (sendMsg) {
                        if (config.SEND_READ && command.on === undefined) {
                            await conn.chatRead(msg.key.remoteJid);
                        }
                        
                        var match = text_msg.match(command.pattern);
                        
                        if (command.on !== undefined && (command.on === 'image' || command.on === 'photo' )
                        && msg.message.imageMessage !== null) {
                            whats = new Image(conn, msg);
                        } else if (command.on !== undefined && (command.on === 'video' )
                        && msg.message.videoMessage !== null) {
                            whats = new Video(conn, msg);
                        } else {
                            whats = new Message(conn, msg);
                        }

                        if (command.deleteCommand && msg.key.fromMe) {
                            await whats.delete(); 
                        }

                        try {
                            await command.function(whats, match);
                        } catch (error) {
                            if (config.LANG == 'TR' || config.LANG == 'AZ') {
                                await conn.sendMessage(conn.user.jid, fs.readFileSync("./media/ERR.jpg"), MessageType.image, { caption: '*-- දෝෂ වාර්තාව [Ultroid] --*' + 
                                    '\n*Bot දෝෂයක් සිදුවී ඇත!*'+
                                    '\n_මෙම දෝෂ logs ඔබගේ අංකය හෝ ප්‍රති පාර්ශ්වයේ අංකය අඩංගු විය හැකිය. කරුණාකර එය සමග සැලකිලිමත් වන්න!_' +
                                    '\n_මෙම පණිවිඩය ඔබගේ අංකයට ගොස් තිබිය යුතුය (සුරකින ලද පණිවිඩ)_' +
                                    '*සිදු වූ දෝෂය:* ```' + error + '```\n\n'
                                    , });
                            } else {
                                await conn.sendMessage(conn.user.jid, fs.readFileSync("./media/ERR.jpg"), MessageType.image, { caption: '*-- දෝෂ වාර්තාව [Ultroid] --*' + 
                                    '\n*බොට් නිසි ලෙස ක්‍රියා කරයි.*'+
                                    '\n_Message logs ඔබගේ අංකය හෝ ප්‍රති පාර්ශ්වයේ අංකය අඩංගු විය හැකිය. කරුණාකර එය සමග සැලකිලිමත් වන්න!_' +
                                    '\n_(සුරකින ලද පණිවිඩ)_' +
                                    '*Report:* ```' + error + '```\n\n'
                                    , });
                            }
                        }
                    }
                }
            }
        )
    });

    try {
        await conn.connect();
    } catch {
        if (!nodb) {
            console.log(chalk.red.bold('ඔබගේ පැරණි අනුවාද මාලාව නැවුම් වෙමින් පවතී...'))
            conn.loadAuthInfo(Session.deCrypt(config.SESSION)); 
            try {
                await conn.connect();
            } catch {
                return;
            }
        }
    }
}

whatsAsena(); 
