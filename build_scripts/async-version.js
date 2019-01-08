/**
 * Created by jean.h.ma on 5/31/16.
 */

console.log("sync cordova version ...");

var fs=require("fs");
var path=require("path");

var appConfigPath=path.join(__dirname,"../deploy_config/app.config.release.json");
var appConfig=require(appConfigPath);
var version=appConfig.version;
console.log("app version : %s", version);

//rewrite version
var cordovaConfigPath=path.join(__dirname,"../../labor-app/config.xml")
var xmlStr=fs.readFileSync(cordovaConfigPath,"utf-8");
xmlStr=xmlStr.replace(/version=\"[0-9\.]+\"?/i,'version="'+version+'"');
fs.writeFileSync(cordovaConfigPath,xmlStr);
