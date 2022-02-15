const Ultroid = require('../events');
const {MessageType} = require('@adiwajshing/baileys');
const M = "It sends version"
const N = "It sends version"
const Config = require('../config');



if (Config.WORKTYPE == 'private') {
Ultroid.addCommand({pattern: 'version', fromMe: true, deleteCommand: true, desc: M,}, (async (message, match) => {

    var r_text = new Array ();

    r_text[1] = "Ultroid Version 🧬\n\nInstalled version 🔗:\n4.0.0v - Public Edition\n\nCheck official github : https://github.com/UltroidWA/Ultroid";

    var i = Math.floor(2*Math.random())

    await message.client.sendMessage(
        message.jid,(r_text[i]), MessageType.text);

    }));


 

    }
    

    if (Config.WORKTYPE == 'public') {
        Ultroid.addCommand({pattern: 'version', fromMe: false, deleteCommand: true, desc: M,}, (async (message, match) => {
        
            var r_text = new Array ();
        
            r_text[1] = "Ultroid Version 🧬\n\nInstalled version 🔗:\n4.0.0v - Public Edition\n\nCheck official github : https://github.com/UltroidWA/Ultroid";
        
            var i = Math.floor(2*Math.random())
        
            await message.client.sendMessage(
                message.jid,(r_text[i]), MessageType.text);
        
            }));
        

            
                }));    
                Ultroid.addCommand({pattern: 'version', fromMe: true, deleteCommand: true,dontAddCommandList: true }, (async (message, match) => {
        
                    var r_text = new Array ();
                
                    r_text[1] = "Ultroid Version 🧬\n\nInstalled version 🔗:\n4.0.0v - Public Edition\n\nCheck official github : https://github.com/UltroidWA/Ultroid";
                    
                
                    var i = Math.floor(2*Math.random())
                
                    await message.client.sendMessage(
                        message.jid,(r_text[i]), MessageType.text);
                
                    }));
                
}   
