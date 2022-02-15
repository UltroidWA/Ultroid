const Ultroid = require('../events');
const {MessageType, MessageOptions, Mimetype} = require('@adiwajshing/baileys');
const axios = require('axios');
const { errorMessage, infoMessage } = require('../helpers');
const Config = require('../config');
const Language = require('../language');
//language support____
const FONT_DESC = "It Send Live Cricket Details..."
const FONT_NEED = "Please Need Link"
const UP_BAR = "╔══════════════════"
const DOWN_BAR = "╚════════════════"
const CRT_TIT = "🏏Title-:"
const CRT_CUR = "Current-:"
const CRT_BTM = "Batsman-:"
const CRT_BTR = "Batsmanrun-:"
const CRT_BTF = "Ballsfaced-:"
const CRT_FOUR = "Fours-:"
const CRT_SIX = "Sixes-:"
const CRT_BOWL = "Bowler-:"
const CRT_BOO = "bowlerover-:"
const CRT_BOR = "bowlerruns-:"
const CRT_BOW = "bowlerwickets-:"
const CRT_REB = "recentballs-:"
const CRT_LAW = "lastwicket-:"
const CRT_RUR = "runrate-:"
const CRT_UP = "update-:"
const NO_RESULT = "*Can't Find Anything😔*"
//end language

if (Config.WORKTYPE == 'private') {

    Ultroid.addCommand({ pattern: 'cricket ?(.*)', fromMe: true, desc: FONT_DESC,  deleteCommand: false}, async (message, match) => {
        if (!match[1]) return await message.client.sendMessage(message.jid,FONT_NEED,MessageType.text)
       
        await axios
          .get(`https://cricket-mskian-whatsbot.vercel.app/cri.php?url=${match[1]}`)
          .then(async (response) => {
            const {//site datas
              title,
              current,
              batsman,
              batsmanrun,
              ballsfaced,
              fours,
              sixes,
              bowler,
              bowlerover,
              bowlerruns,
              bowlerwickets,
              recentballs,
              lastwicket,
              runrate,
              update,
            } = response.data.livescore
            const msg =`${UP_BAR}` + `\n` + `*${CRT_TIT}* ${title}` + `\n` +
                  `${DOWN_BAR}` + `\n\n` +
                  `*${CRT_CUR}* ${current}` + `\n` +                   
                  `*${CRT_BTM}* ${batsman}` + `\n` +
                  `*${CRT_BTR}* ${batsmanrun}` + `\n` +
                  `*${CRT_BTF}* ${ballsfaced}` + `\n` +
                  `*${CRT_FOUR}* ${fours}` + `\n` +
                  `*${CRT_SIX}* ${sixes}` + `\n` +
                  `*${CRT_BOWL}* ${bowler}` + `\n` +
                  `*${CRT_BOO}* ${bowlerover}` + `\n` +
                  `*${CRT_BOR}* ${bowlerruns}` + `\n` +
                  `*${CRT_BOW}* ${bowlerwickets}` + `\n` +
                  `*${CRT_LAW}* ${lastwicket}` + `\n` +
                  `*${CRT_UP}* ${update}` + `\n` +
                  `${CRT_RUR} + ${runrate}` + `\n`
                                                    
            await message.client.sendMessage(message.jid,msg ,MessageType.text)            
        })
        .catch(
          async (err) => await message.client.sendMessage(message.jid,`@2021`,MessageType.text, {quoted: message.data}),
        )
      },
    )
}

if (Config.WORKTYPE == 'public') {

    Ultroid.addCommand({ pattern: 'cricket ?(.*)', fromMe: false, desc: FONT_DESC,  deleteCommand: false}, async (message, match) => {
        if (!match[1]) return await message.client.sendMessage(message.jid,FONT_NEED,MessageType.text)
       
        await axios
          .get(`https://cricket-mskian-whatsbot.vercel.app/cri.php?url=${match[1]}`)
          .then(async (response) => {
            const {//site datas
              title,
              current,
              batsman,
              batsmanrun,
              ballsfaced,
              fours,
              sixes,
              bowler,
              bowlerover,
              bowlerruns,
              bowlerwickets,
              recentballs,
              lastwicket,
              runrate,
              update,
            } = response.data.livescore
            const msg =`${UP_BAR}` + `\n` + `*${CRT_TIT}* ${title}` + `\n` +
                  `${DOWN_BAR}` + `\n\n` +
                  `*${CRT_CUR}* ${current}` + `\n` +                   
                  `*${CRT_BTM}* ${batsman}` + `\n` +
                  `*${CRT_BTR}* ${batsmanrun}` + `\n` +
                  `*${CRT_BTF}* ${ballsfaced}` + `\n` +
                  `*${CRT_FOUR}* ${fours}` + `\n` +
                  `*${CRT_SIX}* ${sixes}` + `\n` +
                  `*${CRT_BOWL}* ${bowler}` + `\n` +
                  `*${CRT_BOO}* ${bowlerover}` + `\n` +
                  `*${CRT_BOR}* ${bowlerruns}` + `\n` +
                  `*${CRT_BOW}* ${bowlerwickets}` + `\n` +
                  `*${CRT_LAW}* ${lastwicket}` + `\n` +
                  `*${CRT_UP}* ${update}` + `\n` +
                  `${CRT_RUR} + ${runrate}` + `\n`
                                                    
            await message.client.sendMessage(message.jid,msg ,MessageType.text)            
        })
        .catch(
          async (err) => await message.client.sendMessage(message.jid,`@2021`,MessageType.text, {quoted: message.data}),
        )
      },
    )
}
