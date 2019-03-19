
const Dirwatcher = require("./modules/dirwatcher");
const Importer = require("./modules/importer");

const dirw = new Dirwatcher();
const importer = new Importer(dirw);

dirw.watch("./data/", 2000);
importer.startImport();
//importer.startImportSync();