
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
        self.watchIntervalId = null;
        self.watchedTimestap = null;

        setInterval(function() {
            const timeStamp = new Date();
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
                            if (stats.mtime.getTime() > self.watchedTimestap) {
                                console.log("Emit file:" + file);
                                self.emit("changed", pathToFile);
                            }
                        });
                    }, ()=> {self.watchedTimestap = timeStamp});
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