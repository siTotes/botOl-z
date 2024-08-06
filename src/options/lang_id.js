//━━━[ Bahasa sehari hari ]━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\
exports.contoh = (prefix, command, style, style2 = "query") => {
    return `Contoh penggunaan: \n${prefix + command} ${style2}\n\n${prefix + command} ${style}`
}
exports.wait = () => {
    return `⏳ Mohon tunggu sebentar`
}
exports.ok = () => {
    return `✅ Done.`
}
exports.sending = (pe) => {
    if (pe) {
        return 'Sedang Mengirim → ✈️' + `\n${pe}`
    } else {
        return 'Sedang Mengirim → ✈️'
    }
}

exports.doneErr = (pe) => {
    if (pe) {
        return `Convert Berhasil. Tetapi bot Gagal Mengirim ${pe} ke anda. Coba ulang`
    } else {
        return `Convert Berhasil. Tetapi bot Gagal Mengirim File ke anda. Coba ulang`
    }
}

exports.waitt = () => {
    return '⏳'
}
exports.sendingg = () => {
    return '✈️'
}
exports.okk = () => {
    return `✅`
}


//━━━[ Kusus Grub ]━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\
exports.bukanadmin = () => {
    return 'Tolong Jadikan Admin grub untuk menggunakan fitur ini😉'
}

exports.adminOnly = () => {
    return 'Fitur ini khusus admin saja😉'
}

exports.targetkick = () => {
    return `Kirim nomer/tag/reply target yang ingin di kick !`
}

exports.nokickpemilik = () => {
    return `Kamu tidak dapat mengeluarkan SiTotes dan Pembuat grub`
}


exports.useradd = () => {
    return `Kirim nomer yang ingin di tambahkan !`
}


exports.userpromot = () => {
    return `Kirim nomer yang ingin di naikkan jabatannya / di jadikan admin !`
}

exports.userdemot = () => {
    return `Kirim nomer yang ingin di turunkan jabatannya / di jadikan member atau bukan admin !`
}

//━━━[ Sticker ]━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\
exports.SmemeErr = (prefix, command) => {
    return `Kirim/Reply Foto Dengan Caption ${prefix + command} *teks nya*`
}
exports.NoToStik = (prefix, command) => {
    return `Kirim/Reply Gambar/Video Dengan Caption ${prefix + command}\n\nDurasi Sticker Video 1-9 Detik`
}

