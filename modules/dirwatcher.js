
const fs = require("fs") ;
const {EventEmitter} = require('events');

module.exports =  class DirWatcherthat extends EventEmitter {
    constructor(dirPath) {
        super();
        this.watchedTimestap = null;
        this.maxFilesToProcess = 5;
    };
    
    watch(path, delay) {
        var self = this;
        self.watchedTimestap = null;

        self.watchIntervalId = setInterval(function() {
            const watchedTimestamp = self.watchedTimestap;
            self.watchedTimestap = new Date();
            fs.readdir(path, (err, data) => {
                console.log("Data read:" + data);
                const watchedTime = Date.now();
                data.filter((el)=> {
                    return el.endsWith(".csv");
                })
                .slice(0, self.maxFilesToProcess)
                .forEach(file => {
                    const pathToFile = path + file;
                    fs.stat(pathToFile, (errStats, stats) => {
                        if (stats.mtime.getTime() > watchedTimestamp) {
                            console.log("Emit file:" + file);
                            self.emit("changed", pathToFile);
                        }
                    });
                });
            });
        }, delay);
    };

    stopWatch() {
        clearInterval(this.watchIntervalId);
    };

    setMaxFilesToProcess(numberOfFiles) {
        this.maxFilesToProcess = numberOfFiles;
    }

};