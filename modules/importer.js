
const fs = require("fs");
const csv = require('csvtojson');

const Dirwatcher = require('./dirwatcher');

module.exports = class Importer {
     constructor (dirwatcher) {
        this.dirwatcher = dirwatcher;
     }

     startImport() {
         var self = this;
         self.dirwatcher.on("changed", (filePaths) => {
            this.import(filePaths).then(data => {
                    csv({
                        noheader:true, 
                        output:"line"
                    })
                    .fromString(data.toString("utf-8"))
                    .then((e) => {console.log(e)}, (jsonObj) => {
                        console.log(jsonObj);
                    });
                },
                errorData => {
                    console.log("Error" + errorData);
                });
        });
     };

     startImportSync() {
        var self = this;
        self.dirwatcher.on("changed", (filePaths) => {
            let fileData = this.importSync(filePaths);
            csv({
                noheader:true, 
                output:"line"
            })
            .fromString(fileData)
            .then(
                (e) => {console.log(e)}, 
                (jsonObj) => {console.log(jsonObj);
            });
        });
     }

     removeWatcher() {
         this.dirwatcher.stopWatch();
     };

     import(path) {
         return new Promise(function(resolve, reject) {
            fs.readFile(path, (err, data) => {
                err ? reject(err) : resolve(data);
            });
        });
     };
     
     importSync(path) {
        return fs.readFileSync(path, "utf-8");
     };
};
