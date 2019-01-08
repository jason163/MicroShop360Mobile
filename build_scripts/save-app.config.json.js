/**
 * Created by jean.h.ma on 5/31/16.
 */

var fs=require("fs");
var path=require("path");
var releaseConfig=require("../deploy_config/app.config.release.json");

var appConfigPath=path.join(__dirname,"../src/config/app.config.json");
var appConfig=require(appConfigPath);

console.log("set release config ...");
for(var key in releaseConfig){
	appConfig[key]=releaseConfig[key];
}

console.log("save app.config.json ...");
// var oldAppConfigString=fs.readFileSync(appConfigPath,"utf-8");
// fs.writeFileSync("./build_scripts/app.config.temp.json",oldAppConfigString);

console.log("replace release app.config.json");
fs.writeFileSync(appConfigPath,JSON.stringify(appConfig));
