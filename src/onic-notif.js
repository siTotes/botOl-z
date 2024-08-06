const home = (path) => __base + path
const _lib = (path) => home("./lib/" + path)
const _srop = (path) => home("./src/options/" + path)

const {
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    generateForwardMessageContent,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    generateMessageID,
    getAggregateVotesInPollMessage,
    downloadContentFromMessage,
    makeInMemoryStore,
    WAMessageContent,
    jidDecode,
    proto,
    makeCacheableSignalKeyStore,
    PHONENUMBER_MCC,
    WAMessageKey,
} = require(sitotesBaileys)
const {
    getBuffer,
    fetchJson,
    sleeps
} = require(_lib('sitotesFunc'))
const fs = require('fs')

module.exports = onic = async (onic, store, state, saveCreds, version, isLatest) => {
    function nocache(module, cb = () => {}) {
        fs.watchFile(require.resolve(module), async () => {
            await uncache(require.resolve(module))
            cb(module)
        })
    }

    function uncache(module = '.') {
        return new Promise((resolve, reject) => {
            try {
                delete require.cache[require.resolve(module)]
                resolve()
            } catch (e) {
                reject(e)
            }
        })
    }

    try {
        nocache('./slebeww', module => console.log(` "${module}" Telah diupdate!`))
        // nocache('./storyReplay', module => console.log(` "${module}" Telah diupdate!`))

        // nocache('./commands/convert-menu')
        // nocache('./commands/download-media')
        // nocache('./commands/game-rpg')
        // nocache('./commands/google-it')
        // nocache('./commands/group-only')
        // nocache('./commands/openai-gpt')
        // nocache('./commands/wibu-docpusat')

        var smgmsusu = require(_lib('sitotesFunc'))
        var smsg = smgmsusu.smsg
        nocache(_lib('sitotesFunc'), async module => {
            smgmsusu = require(module)
            smsg = smgmsusu.smsg
        })

        onic.ev.on('messages.upsert', async chatUpdate => {
            // console.log()
            // console.log()
            // console.log(JSON.stringify(chatUpdate ,null , 2))
            // console.log()
            // console.log()
            try {
                const {
                    default: PQueue
                } = await import('p-queue');
                const queue = new PQueue({
                    concurrency: 1
                });

                mek = chatUpdate.messages[0]
                if (!mek.message) return
                mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
                if (!onic.public && !mek.key.fromMe && chatUpdate.type === 'notify') return
                if (mek.key.id.startsWith('3EB0') && mek.key.id.length === 22) return
                if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return
                m = smsg(onic, mek, store)
                if (m.id == __nbl.chekid[m.chat]) return console.log('dobel detek')
                if (m.mtype == 'pollUpdateMessage') return
                __nbl.chekid[m.chat] = m.id

                if (mek.key && mek.key.remoteJid === 'status@broadcast') return //require("./storyReplay")(onic, m, chatUpdate, mek, store)
                queue.add(() => processMessage(onic, m, chatUpdate, mek, store));
            } catch (err) {
                console.log(err)
            }
        })

        onic.ev.on('poll-recipient', async chatUpdate => {
            try {
                mek = chatUpdate.messages[0]
                if (!mek.message) return
                mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
                if (!onic.public && !mek.key.fromMe && chatUpdate.type === 'notify')
                    if (chatUpdate.typePoll ? false : true) return
                if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16)
                    if (chatUpdate.typePoll ? false : true) return
                m = smsg(onic, mek, store)
                if (m.mtype == 'pollUpdateMessage') return


                require("./slebeww")(onic, m, chatUpdate, mek, store)
            } catch (err) {
                console.log(err)
            }
        })

        onic.ev.on('schedule-trigger', async timeUpdate => {

        })

        onic.ev.on('messages.update', async chatUpdate => {
            try {
                for (const {
                        key,
                        update
                    }
                    of chatUpdate) {
                    if (update.pollUpdates && key.fromMe) {
                        const pollCreation = await getMessage(key)
                        if (pollCreation) {
                            let pollUpdate = getAggregateVotesInPollMessage({
                                message: pollCreation,
                                pollUpdates: update.pollUpdates,
                            })
                            // console.log(JSON.stringify(pollUpdate ,null , 2))
                            var getPoll
                            // for(let i = 0; i < pollUpdate.length; i++){
                            // if(pollUpdate[i].voters.length>0){
                            // getPoll = pollUpdate[i].name
                            // }
                            // }
                            var getPoll = (await pollUpdate.filter(v => v.voters.length !== 0)[0])?.name
                            // var getId = pollCreation.pollCreationMessage.name.match(/~🆔([a-z0-9A-Z]+)~/)?.[1]
                            // if (getId == undefined) getId = chatUpdate[0].key.id
                            if (getPoll == undefined) return

                            console.log('#' + getPoll)
                            // console.log('#' + getId)
                            await onic.appenPollMessage('#' + getPoll, chatUpdate)
                        }
                    }
                }
            } catch (err) {
                console.log(err)
            }
        })


        onic.ev.process(
            async (events) => {
                if (events['creds.update']) {
                    //await saveCreds()
                }

                if (events['labels.association']) {
                    // console.log(events['labels.association'])
                }


                if (events['labels.edit']) {
                    // console.log(events['labels.edit'])
                }

                if (events.call) {
                    // console.log('recv call event', events.call)
                }

                if (events['messaging-history.set']) {
                    // const { chats, contacts, messages, isLatest } = events['messaging-history.set']
                    // console.log(`recv ${chats.length} chats, ${contacts.length} contacts, ${messages.length} msgs (is latest: ${isLatest})`)
                }

                if (events['messages.upsert']) {
                    mek = events['messages.upsert'].messages[0]
                    if (!mek.message) return
                    mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
                    m = smsg(onic, mek, store)
                    if (m.mtype == 'pollUpdateMessage') return
                    if (m.mtype == 'reactionMessage') return

                    __nbl.infoMSG.push(JSON.parse(JSON.stringify(mek)))

                    fs.writeFileSync(home(__nbl.lcInfo), await onic.jsonFineFormated(__nbl.infoMSG))
                    try {
                        __nbl.infoMSG = JSON.parse(fs.readFileSync(home(__nbl.lcInfo)));
                    } catch (error) {
                        console.error("Error reading or parsing file __nbl.infoMSG: ", error);
                        __nbl.infoMSG = [];
                    }
                    if (__nbl.infoMSG.length === 5000) {
                        __nbl.infoMSG.splice(0, 3000)
                        // fs.writeFileSync(__nbl.lcInfo, JSON.stringify(__nbl.infoMSG, null, 2))

                        fs.writeFileSync(home(__nbl.lcInfo), await onic.jsonFineFormated(__nbl.infoMSG))
                        try {
                            __nbl.infoMSG = JSON.parse(fs.readFileSync(home(__nbl.lcInfo)));
                        } catch (error) {
                            console.error("Error reading or parsing file __nbl.infoMSG: ", error);
                            __nbl.infoMSG = [];
                        }
                    }



                    // const upsert = events['messages.upsert']
                    // console.log('recv messages ', JSON.stringify(upsert, undefined, 2))

                    // if(upsert.type === 'notify') {
                    //     for(const msg of upsert.messages) {
                    //         if(!msg.key.fromMe && doReplies) {
                    //             console.log('replying to', msg.key.remoteJid)
                    //             await onic?.readMessages([msg.key])
                    //         }
                    //     }
                    // }
                }

                if (events['messages.update']) {
                    // console.log(
                    //     JSON.stringify(events['messages.update'])
                    // )

                    // for(const { key, update } of events['messages.update']) {
                    //     if(update.pollUpdates) {
                    //         const pollCreation = await getMessage(key)
                    //         if(pollCreation) {
                    //             console.log(
                    //                 'got poll update, aggregation: ',
                    //                 getAggregateVotesInPollMessage({
                    //                     message: pollCreation,
                    //                     pollUpdates: update.pollUpdates,
                    //                 })
                    //             )
                    //         }
                    //     }
                    // }
                }

                if (events['message-receipt.update']) {
                    // console.log(events['message-receipt.update'])
                }

                if (events['messages.reaction']) {
                    // console.log(events['messages.reaction'])
                }

                if (events['presence.update']) {
                    await onic.sendPresenceUpdate('unavailable')
                    // console.log(events['presence.update'])
                }

                if (events['chats.update']) {
                    // console.log(events['chats.update'])
                }

                if (events['contacts.update']) {
                    // for(const contact of events['contacts.update']) {
                    //     if(typeof contact.imgUrl !== 'undefined') {
                    //         const newUrl = contact.imgUrl === null
                    //             ? null
                    //             : await onic?.profilePictureUrl(contact.id).catch(() => null)
                    //         console.log(
                    //             `contact ${contact.id} has a new profile pic: ${newUrl}`,
                    //         )
                    //     }
                    // }
                }

                if (events['chats.delete']) {
                    // console.log('chats deleted ', events['chats.delete'])
                }
            }
        )



        onic.decodeJid = (jid) => {
            if (!jid) return jid
            if (/:\d+@/gi.test(jid)) {
                let decode = jidDecode(jid) || {}
                return decode.user && decode.server && decode.user + '@' + decode.server || jid
            } else return jid
        }

        onic.public = true



        return onic

        async function getMessage(key) {
            if (store) {
                const msg = await store.loadMessage(key.remoteJid, key.id)
                return msg?.message || undefined
            }

            return proto.Message.fromObject({})
        }

        async function processMessage(onic, m, chatUpdate, mek, store) {
            try {
                await require('./slebeww')(onic, m, chatUpdate, mek, store);
            } catch (err) {
                console.log(err);
            }
        }

    } catch (err) {
        console.log(err.stack)
    } finally {
        // console.log(__filename.replace('/data/data/com.termux/files/home', '.'), '→ Save');
        let jsondata = {}
        jsondata[__filename.split('/')[__filename.split('/').length - 1]] = true
        console.log('Module =', jsondata, '\n\n')
    }
}