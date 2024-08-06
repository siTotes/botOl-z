global.__base = __dirname + '/';
global.__nbl = {}
global.__dbl = '\n\n'
// require('./src/options/settings')

const {
    sitotesMakeSock,
    sleeps,
    startServerWeb
} = require('./lib/sitotesFunc')
const {
    Boom
} = require('@hapi/boom')
const NodeCache = require('node-cache')
const readline = require('readline')
const nodecron = require('node-cron')
const util = require('util');
const WebSocket = require('ws');
const wss = new WebSocket.Server({
    port: 3001
});

const {
    default: makeWASocket,
    AnyMessageContent,
    BinaryInfo,
    DisconnectReason,
    encodeWAM,
    delays,
    fetchLatestBaileysVersion,
    getAnggreVotesInPollMessage,
    makeCacheableSignalKeyStore,
    makeInMemoryStore,
    PHONENUMBER_MCC,
    proto,
    useMultiFileAuthState,
    WAMessageKey,
    jidNormalizedUser
} = require(sitotesBaileys)

const pino = require('pino')
const fs = require('fs')

// const logger = MAIN_LOGGER.child({})
// logger.level = 'trace'
const logger = pino().child({
    level: 'silent',
    stream: 'store'
})

const msgRetryCounterCache = new NodeCache()

const rl = __nbl.usePairingCode ? readline.createInterface({
    input: process.stdin,
    output: process.stdout
}) : ''
const question = (text) => new Promise((resolve) => __nbl.usePairingCode ? rl.question(text, resolve) : '')

const store = __nbl.useStore ? makeInMemoryStore({
    logger
}) : undefined


const {
    toBuffer,
    toDataURL
} = require('qrcode')

/*
try {
    store?.readFromFile('./src/session/baileys_store_multi.json')
} catch (error) {
    fs.writeFileSync('./src/session/baileys_store_multi.json', '{"chats":[],"contacts":{},"messages":{},"labels":[],"labelAssociations":[]}')
    //store?.readFromFile('./src/session/baileys_store_multi.json')
    throw new Error('Bot Crash → By sitotes anti loop')
}
setInterval(() => {
    store?.writeToFile('./src/session/baileys_store_multi.json')
}, 10000)
*/


// system database 2024 by sitotes


console.log(__dbl, 'SiTotes Bot Wait Running...')

async function sitotesBoot() {
    const {
        state,
        saveCreds
    } = await useMultiFileAuthState('./src/session/creds-file')
    const {
        version,
        isLatest
    } = await fetchLatestBaileysVersion()

    const onic = await sitotesMakeSock(makeWASocket, pino, version, isLatest, getMessage, msgRetryCounterCache, state)

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


    if (__nbl.usePairingCode && !onic.authState.creds.registered) {
        if (__nbl.useMobile) throw new Error('Cannot use pairing code with mobile api')

        var phoneNumber = await question('SI TOTES:   Ketik nomor whatsapp kamu:\n')
        phoneNumber = phoneNumber.replace(/[^0-9]/g, '')
        if (!Object.keys(PHONENUMBER_MCC).some(v => phoneNumber.startsWith(v))) {
            console.log('SI TOTES:  Mulain dengan kode negara contoh : 62xxx')

            phoneNumber = await question('SI TOTES:   Ketik nomor whatsapp kamu:\n')
            phoneNumber = phoneNumber.replace(/[^0-9]/g, '')
            rl.close()
        }
        const code = await onic.requestPairingCode(phoneNumber)
        console.log(`Pairing code: ${code}`)
    }



    if (onic.user && onic.user.id) onic.user.jid = jidNormalizedUser(onic.user.id)

    onic.ev.on('connection.update', async (update) => {
        // console.log('connection update', update)
        const {
            connection,
            lastDisconnect,
            qr
        } = update
        if (!__nbl.usePairingCode && qr) {
            try {
                __nbl.qrBuffer = await toBuffer(qr)
                console.log(qr)
                WebSitotesUpdate()
            } catch (err) {
                console.error('Error updating QR:', err);
            }
        }
        if (connection === 'close') {
            __nbl.ttlerr++
            let reason = new Boom(lastDisconnect?.error)?.output.statusCode
            if (reason === DisconnectReason.badSession) {
                console.log(`SENDER → File Sesi Buruk, Harap Hapus Sesi dan Pindai Lagi`)
                setTimeout(sitotesBoot, 10000)
                // throw new Error('Bot Crash → By sitotes anti Stuck reload')
            } else if (reason === DisconnectReason.connectionClosed) {
                console.log("SENDER → Koneksi ditutup, menghubungkan kembali....")
                //setTimeout(sitotesBoot, 10000)
                stuckme(10)
                //throw new Error('Bot Crash → By sitotes anti Stuck reload')
            } else if (reason === DisconnectReason.connectionLost) {
                console.log("SENDER → Koneksi Hilang dari Server, menyambungkan kembali...")
                //setTimeout(sitotesBoot, 10000)
                stuckme(10)
                //throw new Error('Bot Crash → By sitotes anti Stuck reload')
            } else if (reason === DisconnectReason.connectionReplaced) {
                console.log("SENDER → Koneksi Diganti, Sesi Baru Lain Dibuka, menghubungkan kembali...")
                setTimeout(sitotesBoot, 10000)
            } else if (reason === DisconnectReason.loggedOut) {
                console.log(`SENDER → Perangkat Keluar, Harap Pindai Lagi Dan Jalankan.`)
                setTimeout(sitotesBoot, 10000)
            } else if (reason === DisconnectReason.restartRequired) {
                console.log("SENDER → Restart Diperlukan, Restart...")
                setTimeout(sitotesBoot, 10000)
            } else if (reason === DisconnectReason.timedOut) {
                console.log("SENDER → Koneksi Habis, Menghubungkan...")
                setTimeout(sitotesBoot, 10000)
            } else onic.end(`SENDER → Alasan Putus Tidak Diketahui: ${reason}|${connection}`)

            if (__nbl.ttlerr > 3) {
                console.log('Crash by → Connection Loop')
                throw new Error('Bot Crash → By sitotes anti loop')
            }
        }
        if (update.connection == "open" || update.receivedPendingNotifications == "true") {
            // await store.chats.all()
            __nbl.qrBuffer = null;
            WebSitotesUpdate()
            console.log(`${__dbl}Menghubungkan Ke whatsapp =`, JSON.parse(JSON.stringify(onic.user, null, 2)), "\n")
            await onic.sendPresenceUpdate('unavailable')
            if (update.receivedPendingNotifications && !onic.authState.creds?.myAppStateKeyId) {
                onic.ev.flush()
            }
        }
        if (update.receivedPendingNotifications) {

            console.log('Terhubung = ', JSON.parse(JSON.stringify({
                account: onic.user.jid.replace('@s.whatsapp.net', ' • ') + onic.user.name,
                receivedPendingNotifications: true
            }, null, 2)), __dbl)
        }
    })

    onic.ev.on('creds.update', saveCreds)
    store?.bind(onic.ev)




    require('./src/onic-func')(onic, store)
    nocache('./src/onic-func', module => {
        require(module)(onic, store)
        console.log(` "${module}" Telah diupdate!`)
    })

    require('./src/onic-notif')(onic, store, state, saveCreds, version, isLatest)
    nocache('./src/onic-notif', async module => {
        onic.ev.removeAllListeners('messages.upsert');
        onic.ev.removeAllListeners('messages.update');
        onic.ev.removeAllListeners('poll-recipient');
        onic.ev.removeAllListeners('schedule-trigger');
        require(module)(onic, store, state, saveCreds, version, isLatest)
        console.log(` "${module}" Telah diupdate!`)
    })








    return onic

    async function getMessage(key) {
        if (store) {
            const msg = await store.loadMessage(key.remoteJid, key.id)
            return msg?.message || undefined
        }

        return proto.Message.fromObject({})
    }
}






fs.readdir('./src/session/creds-filem/', (err, files) => {
    if (err) return;
    files.filter(file => file.startsWith('session-')).forEach(file => file.includes('6288989781626') ? '' : fs.unlink(`./src/session/creds-file/${file}`, err => ''))
    files.filter(file => file.startsWith('sender-key')).forEach(file => file.includes('6288989781626') ? '' : fs.unlink(`./src/session/creds-file/${file}`, err => ''))
});

async function stuckme(dd) {
    await sleeps(dd)
    console.log('Bot Crash → By sitotes anti Stuck, reload...')
    await sleeps(3)
    process.exit(1)
}

sitotesBoot()
startServerWeb()





function WebSitotesUpdate() {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send('update');
        }
    });
}