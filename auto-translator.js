'use stric';
const translate = require('google-translate-api');
const languages = require('google-translate-api').languages;
var languageskeys = Object.keys(languages);
languageskeys.splice(languageskeys.indexOf("isSupported"), 1);
languageskeys.splice(languageskeys.indexOf("getCode"), 1);

const fs = require('fs');
const async = require('async');


console.log("Deleting old translations folder ... ");

if(fs.existsSync("./translations")) {
    deleteFolderRecursive("./translations");
}

fs.mkdirSync("./translations")

console.log("Reading base file ... ");

const array = fs.readFileSync("base.cfg").toString().split("\n");
console.log(array);
console.log("fin de la ejecicon");

console.log(languageskeys);

var allElements = [];
var line, lineSplit;

for(let i = 0; i < array.length; i++) {
    line = array[i];
    for(let x = 1; x < languageskeys.length; x++) {
        allElements.push({ text: line, lang: languageskeys[x] });
    }
}

console.log(allElements);


function translated(obj, callback) {
    let text = obj.text.split("# ");
    if(text.length >= 2) {
        
        console.log("Translating ... " + text[1] + " to: " + obj.lang);
        
        if(text[0].startsWith("_Description")) {
            text[1] = "Translation made with Daranix AutoTranslater";
        }

        translate(text[1], {from: 'en', to: obj.lang}).then((res) => {
            res.text = res.text.replace("'", "''");
            obj.text = obj.text.replace("%def%", res.text);

            fs.appendFileSync("./translations/" + obj.lang + ".cfg", obj.text);
            callback(false);
        }).catch((err) => {
            callback(err);
        });
    } else {
        callback(false);
    }

}

async.mapLimit(allElements, 400, translated, (err) => {
    if(err) throw err;
    console.log("Ejecicion terminada");
    require('./renamer.js')(languageskeys, languages);

});




function deleteFolderRecursive(path) {
    if (fs.existsSync(path)) {
      fs.readdirSync(path).forEach(function(file, index){
        var curPath = path + "/" + file;
        if (fs.lstatSync(curPath).isDirectory()) { // recurse
          deleteFolderRecursive(curPath);
        } else { // delete file
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(path);
    }
  };



