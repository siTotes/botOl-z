const home = (path) => __base + path
const _lib = (path) => home("./lib/" + path)
const _srop = (path) => home("./src/options/" + path)

require('./options/settings')
const {
    BufferJSON,
    WA_DEFAULT_EPHEMERAL,
    generateWAMessageFromContent,
    proto,
    generateWAMessageContent,
    generateWAMessage,
    prepareWAMessageMedia,
    areJidsSameUser,
    getContentType
} = require(sitotesBaileys)


const {
    toAudio,
    toPTT
} = require(_lib('converter'))

const fs = require('fs');
const util = require('util');
const moment = require('moment-timezone');
const {
    getBuffer,
    hitungmundur,
    bytesToSize,
    checkBandwidth,
    runtime,
    fetchJson,
    getGroupAdmins,
    msToDate,
    isUrl,
    tanggal,
    smsg,
    sleeps
} = require(_lib('sitotesFunc'))
const {
    TelegraPh
} = require(_lib('uploader'))

const lang = require(_srop('lang_id'))
const axios = require('axios')


module.exports = onic = async (onic, m, chatUpdate, mek, store) => {
    try {
        var body = (m.mtype === 'conversation') ? m.message.conversation : (m.mtype == 'imageMessage') ? m.message.imageMessage.caption : (m.mtype == 'videoMessage') ? m.message.videoMessage.caption : (m.mtype == 'extendedTextMessage') ? m.message.extendedTextMessage.text : (m.mtype == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : (m.mtype == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (m.mtype == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : (m.mtype === 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text) : '' //omzee
        var budy = (typeof m.text == 'string' ? m.text : '')
        var isCmd = /^[°•π÷×¶∆£¢€¥®™�✓_=|~!?#/$%^&.+-,\\\©^]/.test(body)
        // const isCmd = /≈/.test(body)
        const prefix = isCmd ? budy[0] : ''
        var command = isCmd ? body.slice(1).trim().split(' ').shift().toLowerCase() : ''
        var cimmind = isCmd ? body.slice(1).trim().split(' ').shift().toLowerCase() : body.trim().split(' ').shift().toLowerCase()
        var args = body.trim().split(/ +/).slice(1)
        const pushname = m.pushName || "No Name"
        const botNumber = await onic.decodeJid(onic.user.id)
        const tanggal = moment().tz("Asia/Makassar").format("dddd, ll")
        const jam = moment(Date.now()).tz('Asia/Makassar').locale('id').format('HH:mm:ss z')
        const salam = moment(Date.now()).tz("Asia/Makassar").locale('id').format('a')
        const isCreator = [botNumber, ...global.ownno].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
        var text = q = args.join(" ")
        const quoted = m.quoted ? m.quoted : m
        const from = m.chat
        const mime = (quoted.msg || quoted).mimetype || ''
        const isMedia = /image|video|sticker|audio/.test(mime)
        const groupMetadata = m.isGroup ? await onic.groupMetadata(m.chat).catch(e => {}) : ''
        const groupName = m.isGroup ? groupMetadata.subject : ''
        const participants = m.isGroup ? await groupMetadata.participants : ''
        const groupAdmins = m.isGroup ? await getGroupAdmins(participants) : ''
        const isBotAdmins = m.isGroup ? groupAdmins.includes(botNumber) : false
        const isAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false
        const time = moment(Date.now()).tz('Asia/Jakarta').locale('id').format('HH:mm:ss z')
        const timestamp = m.messageTimestamp




        const reply = onic.reply
        const replyEmo = onic.replyEmo
        const react = onic.react
        const presence = onic.presence

        const casee = (lib) => './cmd-group/' + lib
        const runCase = async (runto, perfic = true, ...allin) => {
            if (perfic) {
                if (isCmd) await require(casee(runto))(onic, m, command, mek, ...allin)
            } else {
                if (!isCmd) await require(casee(runto))(onic, m, cimmind, mek, ...allin)
            }

        }


        console.log(
            '\n\n _  ____ ____ ____',
            '\n | MSG (' + moment(timestamp * 1000).format(`HH:mm: s`) + ' ↑ ' + ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jum\'at', 'Sabtu', 'Minggu'][Number(moment(timestamp * 1000).format(`E`))] + ', ' + moment(timestamp * 1000).format(`DD MMMM y`) + `)-> fromMe(${m.key.fromMe? 'T':'F'})`,
            `\n ${budy || m.mtype} `,
            `\n | ${pushname} • (${m.sender.replace(/[^\d]/g, '')})`,
            `\n | ${m.isGroup ? groupName : 'Private Chat'} • ${m.chat}`
        )
        __nbl.welog += '\n\n _  ____ ____ ____' + '\n | MSG (' + moment(timestamp * 1000).format(`HH:mm: s`) + ' ↑ ' + ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jum\'at', 'Sabtu', 'Minggu'][Number(moment(timestamp * 1000).format(`E`))] + ', ' + moment(timestamp * 1000).format(`DD MMMM y`) + `)-> fromMe(${m.key.fromMe? 'T':'F'})` + `\n ${budy || m.mtype} ` + `\n | ${pushname} • (${m.sender.replace(/[^\d]/g, '')})` + `\n | ${m.isGroup ? groupName : 'Private Chat'} • ${m.chat}`

        if (m.message) {
            await sleeps(1)
            await onic.readMessages([m.key])
        }

        // return

























        switch (m.isGroup ? command : cimmind) {
            case 'u':
            case 'test':
            case 'status':
            case 'p':
            case 'Runtime':
            case 'Uptime': {
                await reply(`Halo Saya Bot SiTotes, server saya terakhir restart ( ${runtime(process.uptime())} ) yang lalu`)
            }
            break
            case 'but': {
                let msg = generateWAMessageFromContent(m.chat, {
                    viewOnceMessage: {
                        message: {
                            "messageContextInfo": {
                                "deviceListMetadata": {},
                                "deviceListMetadataVersion": 2
                            },
                            interactiveMessage: proto.Message.InteractiveMessage.create({
                                body: proto.Message.InteractiveMessage.Body.create({
                                    text: `Selamat datang di Bot Asisten!\n\nSaya, SiTotes Bot, Diciptakan Oleh     ${"```m.saiful.anam.r.```"}\n\nAyo mulai petualanganmu dengan mengetik *#menu*. Stay awesome! 🚀`
                                }),
                                footer: proto.Message.InteractiveMessage.Footer.create({
                                    text: ''
                                }),
                                header: proto.Message.InteractiveMessage.Header.create({
                                    title: `${greetingsChat}, *${pushname}*!`,
                                    hasMediaAttachment: false
                                }),
                                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                    buttons: [{
                                            "name": "single_select",
                                            "buttonParamsJson": JSON.stringify({
                                                "title": "ALOK MENU",
                                                "sections": [{
                                                        "title": "Ai Google",
                                                        "highlight_label": "Bard Ai",
                                                        "rows": [{
                                                                "header": "📓 Bard Google",
                                                                "title": "• ketik bard pertanyaan",
                                                                "description": "gunakan prefix",
                                                                "id": ".play"
                                                            },
                                                            {
                                                                "header": "📓 Gemini",
                                                                "title": "• ketik gemini pertanyaan",
                                                                "description": "gunakan prefix",
                                                                "id": ".play"
                                                            },
                                                            {
                                                                "header": "📓 Asisten Google",
                                                                "title": "• ketik Asisten pertanyaan",
                                                                "description": "gunakan prefix",
                                                                "id": ".play"
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "title": "Chat GPT",
                                                        "highlight_label": "GPT AI",
                                                        "rows": [{
                                                                "header": "📓 Gpt 0.3.5",
                                                                "title": "• ketik bot pertanyaan",
                                                                "description": "Tanpa prefix",
                                                                "id": ".play"
                                                            },
                                                            {
                                                                "header": "📓 GPT 4 PRO",
                                                                "title": "• ketik gpt pertanyaan",
                                                                "description": "gunakan prefix",
                                                                "id": ".play"
                                                            },
                                                            {
                                                                "header": "📓 Gpt Image",
                                                                "title": "• ketik botimg pertanyaan",
                                                                "description": "gunakan prefix",
                                                                "id": ".play"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            })
                                        },
                                        {
                                            "name": "cta_url",
                                            "buttonParamsJson": "{\"display_text\":\"CHAT OWNER\",\"url\":\"https://wa.me/+6289654057716?text=Halo+Bang\",\"merchant_url\":\"https://www.google.com\"}"
                                        },
                                        {
                                            "name": "quick_reply",
                                            "buttonParamsJson": `{"display_text":"MENAMPILKAN ALLMENU","id":"${prefix}allmenu"}`
                                        },
                                        {
                                            "name": "cta_copy",
                                            "buttonParamsJson": `{\"display_text\":\"Username\",\"id\":\"123456789\",\"copy_code\":\"ALokUserName\"}`
                                        }
                                    ],
                                })
                            })
                        }
                    }
                }, {})
                await onic.relayMessage(msg.key.remoteJid, msg.message, {
                    messageId: msg.key.id
                }, {
                    quoted: m
                })
            }
            break
            case 'pin': {
                await onic.sendMessage(m.chat, {
                    react: {
                        text: "🔎",
                        key: m.key,
                    }
                })
                async function createImage(url) {
                    const {
                        imageMessage
                    } = await generateWAMessageContent({
                        image: {
                            url
                        }
                    }, {
                        upload: onic.waUploadToServer
                    });
                    return imageMessage;
                }

                function shuffleArray(array) {
                    for (let i = array.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [array[i], array[j]] = [array[j], array[i]];
                    }
                }

                let push = [];
                let {
                    data
                } = await axios.get(`https://www.pinterest.com/resource/BaseSearchResource/get/?source_url=%2Fsearch%2Fpins%2F%3Fq%3D${text}&data=%7B%22options%22%3A%7B%22isPrefetch%22%3Afalse%2C%22query%22%3A%22${text}%22%2C%22scope%22%3A%22pins%22%2C%22no_fetch_context_on_resource%22%3Afalse%7D%2C%22context%22%3A%7B%7D%7D&_=1619980301559`);
                let res = data.resource_response.data.results.map(v => v.images.orig.url);

                shuffleArray(res);
                let ult = res.splice(0, 10);
                let i = 1;

                for (let lucuy of ult) {
                    push.push({
                        body: proto.Message.InteractiveMessage.Body.fromObject({
                            text: `• bot whatsapp\n• pinterest`
                        }),
                        footer: proto.Message.InteractiveMessage.Footer.fromObject({
                            text: ownername
                        }),
                        header: proto.Message.InteractiveMessage.Header.fromObject({
                            title: `M.Saiful Anam.R`,
                            hasMediaAttachment: true,
                            imageMessage: await createImage(lucuy)
                        }),
                        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                            buttons: [{
                                "name": "cta_url",
                                "buttonParamsJson": `{"display_text":"SOURCE","url":"https://www.pinterest.com/search/pins/?rs=typed&q=${text}","merchant_url":"https://www.pinterest.com/search/pins/?rs=typed&q=${text}"}`
                            }]
                        })
                    });
                }

                const bot = generateWAMessageFromContent(m.chat, {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: {
                                deviceListMetadata: {},
                                deviceListMetadataVersion: 2
                            },
                            interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                                body: proto.Message.InteractiveMessage.Body.create({
                                    text: "SiTotes: Berhasil Menemukan Gambar " + text
                                }),
                                footer: proto.Message.InteractiveMessage.Footer.create({
                                    text: 'DARI PINTEREST'
                                }),
                                header: proto.Message.InteractiveMessage.Header.create({
                                    hasMediaAttachment: false
                                }),
                                carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                                    cards: [
                                        ...push
                                    ]
                                })
                            })
                        }
                    }
                }, {});

                await onic.relayMessage(m.chat, bot.message, {
                    messageId: bot.key.id
                });
            }
            break
        }










































        async function swicherCommand(alokk) {

            // switch (false){
            switch (alokk) {
                case 'tt':
                case 'downloadtiktok':
                case 'tiktokunduh':
                case 'tiktok': {
                    await runCase('download-media', true)
                }
                break
                case '*':
                case '×':
                case '🌟': {
                    if (!quoted) return
                    await onic.sendMessageJson(onic.user.id, (quoted.msg || quoted).fakeObj)
                }
                break
                case '2x': {
                    if (!quoted) return await reply('Tidak mereply apapun, reply media')
                    await onic.sendReaction(m.chat, m.key, '🦶')
                    let vnot = (quoted.msg || quoted).fakeObj
                    let so = (m.quoted.mtype == 'viewOnceMessageV2Extension' || 'viewOnceMessageV2' || 'viewOnceMessage' ? vnot.message[m.quoted.mtype].message[getContentType(vnot.message[m.quoted.mtype].message)] : vnot.message[m.quoted.mtype])
                    so.viewOnce = false
                    console.log(JSON.stringify(vnot, null, 2))
                    await onic.sendMessageJson(m.chat, vnot)
                }
                break
            }

        }

        await swicherCommand(cimmind)
    } catch (err) {
        await onic.sendPesan(onic.user.id, {
            text: '*Error*\n> ' + __filename.replace('/data/data/com.termux/files/home', '.') + '\n\n`' + util.format(err) + '`'
        })
        console.log(util.format(err))
    } finally {
        console.log(__filename.replace('/data/data/com.termux/files/home', '.'), '→ Save');
    }
}