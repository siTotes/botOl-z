const home = (path) => __base + path
const _lib = (path) => home("./lib/" + path)
const _srop = (path) => home("./src/options/" + path)
require(_srop('settings'))

//━━━[ ALL MODULE ]━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\
const fs = require('fs')
const moment = require("moment-timezone")
const util = require('util');


//━━━[ @SITOTES LIB ]━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\
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
    sleeps
} = require(_lib('sitotesFunc'))
const lang = require(_srop('lang_id'))

//━━━[  ]━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\
const {
    Downloader
} = require("@tobyg74/tiktok-api-dl")
const tiktokdl = Downloader

//━━━[ DATA BASE ]━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\


//━━━[ If user chat download-media ]━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\
module.exports = onic = async (onic, m, command, mek) => {
    await onic.presence(3)
    try {
        var body = (m.mtype === 'conversation') ? m.message.conversation : (m.mtype == 'imageMessage') ? m.message.imageMessage.caption : (m.mtype == 'videoMessage') ? m.message.videoMessage.caption : (m.mtype == 'extendedTextMessage') ? m.message.extendedTextMessage.text : (m.mtype == 'buttonsResponseMessage') && m.message.buttonsResponseMessage.selectedButtonId ? m.message.buttonsResponseMessage.selectedButtonId : (m.mtype == 'listResponseMessage') && m.message.listResponseMessage.singleSelectReply.selectedRowId ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (m.mtype == 'templateButtonReplyMessage') && m.message.templateButtonReplyMessage.selectedId ? m.message.templateButtonReplyMessage.selectedId : (m.mtype == 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text) : ""
        var budy = (typeof m.text == 'string' ? m.text : '')
        const type = Object.keys(mek.message)[0];
        const isCmd = mek.key.fromMe ? /^[$]/.test(body) : /^[°•π÷×¶∆£¢€¥®™�✓_=|~!?#/$%^&.+-,\\\©^]/.test(body)
        const prefix = isCmd ? budy[0] : ''
        const salam = moment(Date.now()).tz(timezone).locale('id').format('a')
        const pushname = m.pushName || "No Name"
        const botNumber = await onic.decodeJid(onic.user.id)
        const args = body.trim().split(/ +/).slice(1)
        var text = q = args.join(" ")
        const nrgs = args[0]
        const reply = onic.reply
        const replyEmo = onic.replyEmo
        const react = onic.react
        const presence = onic.presence




        switch (command) {
            case 'tt':
            case 'downloadtiktok':
            case 'tiktokunduh':
            case 'tiktok': {
                if (!text) {
                    await react('❓')
                    return reply(lang.contoh(prefix, command, 'Url / link Video Tiktok'))
                }
                if (!isUrl(nrgs) && !nrgs.includes('tiktok.com')) {
                    await react('❓')
                    return reply(lang.contoh(prefix, command, text + ' 👈Ini bukan Url / Link Video tiktok'))
                }

                await react('⏳')
                let noerr = {
                    s: true,
                    l: ''
                }
                await tiktokdl(nrgs, {
                    version: "v3"
                }).then(async (tiktok) => {
                    console.log('tt respons:', JSON.stringify(tiktok, null, 2), '\n', nrgs)
                    tiktok = tiktok.result
                    await react('✈️')
                    if (tiktok.images) {
                        for (let i = 0; i < tiktok.images.length; i++) {
                            let url = tiktok.images[i]
                            await onic.sendImageUrl(m.chat, url, '', m).catch(async _ => {
                                await react('🤔')
                                await onic.sendImageUrl(m.chat, url, '', m).catch(async _ => {
                                    await react('❌')
                                    await onic.sendPesan(m.chat, {
                                        text: '*Terjadi kesalahan Coba ulang kak,*\n*jika masih tidak bisa, tolong bagikan ke owner:*\n\n```' + _ + '```'
                                    }, {
                                        quoted: m
                                    })
                                    return ''
                                })
                            })
                        }
                    } else if (tiktok.video_hd) {
                        let url = tiktok.video_hd
                        await onic.sendVideoUrl(m.chat, url, false, '', m).then(_ => i = 1000).catch(async _ => {
                            await react('🤔')
                            await onic.sendVideoUrl(m.chat, url, false, '', m).then(_ => i = 1000).catch(async _ => {
                                await react('❌')
                                await onic.sendPesan(m.chat, {
                                    text: '*Terjadi kesalahan mengirim kan ke anda Coba ulang kak,*\n*jika masih tidak bisa, tolong bagikan ke owner:*\n\n```' + _ + '```'
                                }, {
                                    quoted: m
                                })
                                return ''
                            })
                        })
                    } else {
                        await replyEmo('Saya belum bisa mendownload Format\n\n' + JSON.stringify(tiktok, null, 2) + '\n\n ini', '😔')
                    }

                    await onic.sendPesan(m.chat, {
                        audio: {
                            url: tiktok.music
                        },
                        mimetype: 'audio/mpeg',
                        ptt: false,
                    }, {
                        quoted: m
                    })


                    await react('✅')

                }).catch(async _ => {
                    await react('❌')
                    await onic.sendPesan(m.chat, {
                        text: '*Terjadi kesalahan Coba ulang kak,*\n*jika masih tidak bisa periksa link di web,*\n*tolong bagikan ke owner:*\n\n```' + _ + '```'
                    }, {
                        quoted: m
                    })
                })
            }
            break
        }



    } catch (err) {
        await onic.sendPesan(onic.user.id, {
            text: '*Error*\n> ' + __filename.replace('/data/data/com.termux/files/home', '.') + '\n\n`' + util.format(err) + '`'
        })
        console.log(util.format(err))
    } finally {
        await onic.presence(0)
        console.log(__filename.replace('/data/data/com.termux/files/home', '.'), '→ Save');
    }
}