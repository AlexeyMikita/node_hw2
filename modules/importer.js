
const fs = require("fs") ;
const Dirwatcher = require('./dirwatcher');

module.exports = class Importer {
     constructor (dirwatcher) {
        this.dirwatcher = dirwatcher;
     }

     startImport() {
         var self = this;
         self.dirwatcher.on("changed", (filePaths) => {
            // fs.readFile(filePaths, (err, data) => {
            //     console.log(err,data);
                
            // });
            import(filePaths).then(data => {
                    console.log("Imported" + data);
                },
                errorData => {
                    console.log("Error" + errorData);
                });
        });
     };

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
     
     importSyn(path) {

     };
};
