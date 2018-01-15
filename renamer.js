module.exports = function(langs, flangs) {

    const fs = require('fs');

    for(let i = 1; i < langs.length; i++) {
        fs.renameSync(`./translations/${langs[i]}.cfg`, `./translations/${flangs[langs[i]]} - ${langs[i].toUpperCase()}.cfg`)
    }
    

}