/**
 * Created by jean.h.ma on 5/31/16.
 */
console.log("restore app.config.json ...");

var fs=require("fs");
var path=require("path");

var appConfigPath=path.join(__dirname,"../src/config/app.config.json");
var appConfigTempPath="./build_scripts/app.config.temp.json";

var originalConfig=fs.readFileSync(appConfigTempPath,"utf-8");
fs.writeFileSync(appConfigPath,originalConfig);
fs.unlinkSync(appConfigTempPath);