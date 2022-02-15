const Ultroid = require('../events');
const {MessageType} = require('@adiwajshing/baileys');
const config = require('../config');
const Heroku = require('heroku-client');
const heroku = new Heroku({
    token: config.HEROKU.API_KEY
});
let baseURI = '/apps/' + config.HEROKU.APP_NAME;

const Language = require('../language');

var l_dsc = ''
    var alr_on = ''
    var alr_off = ''
    var succ_on = ''
    var succ_off = ''

    if (config.LANG == 'EN') {
        l_dsc = 'Activates the private, public tool.'
        alr_on = 'Type is already private!'
        alr_off = 'Type is currently public!'
        succ_on = 'Private Mode setted Successfully!'
        succ_off = 'Public Mode setted Successfully!'
    }

    Ultroid.addCommand({pattern: 'type ?(.*)', fromMe: true,  deleteCommand: false,  desc: l_dsc, usage: '.type self or public', dontAddCommandList: true }, (async (message, match) => {
        const anti_status = `${config.WORKTYPE}`
        if (match[1] == 'self') {
            if (anti_status == 'true') {
                return await message.client.sendMessage(message.jid, '' + alr_on + '', MessageType.text)
            }
            else {
                await heroku.patch(baseURI + '/config-vars', { 
                    body: { 
                        ['WORK_TYPE']: 'private'
                    } 
                });
                await message.client.sendMessage(message.jid, '' + succ_on + '', MessageType.text)
            }
        }
        else if (match[1] == 'public') {
            if (anti_status !== 'true') {
                return await message.client.sendMessage(message.jid, '' + alr_off + '', MessageType.text)
            }
            else {
                await heroku.patch(baseURI + '/config-vars', { 
                    body: { 
                        ['WORK_TYPE']: 'public'
                    } 
                });
                await message.client.sendMessage(message.jid, '' + succ_off + '', MessageType.text)
            }
        }
    }));
