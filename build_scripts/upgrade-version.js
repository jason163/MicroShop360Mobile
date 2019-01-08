/**
 * Created by jean.h.ma on 6/2/16.
 */
// var helper=require("./helper");
var fs=require("fs");
var path=require("path");
// var args=require("yargs").argv;
// var format = require("string-template");
var appReleaseConfigPath=path.join(__dirname,"../deploy_config/app.config.release.json");
var appReleaseConfig=require(appReleaseConfigPath);

var oldVersion=appReleaseConfig.version;

var versions=oldVersion.split(".");

console.log("upgrade react version ...");
var releaseVersion=parseInt(versions[2]);
releaseVersion++;
versions[2]=releaseVersion;

// if(args.release){
// 	console.log("upgrade release version ...");
// 	var releaseVersion=parseInt(versions[2]);
// 	releaseVersion++;
// 	versions[2]=releaseVersion;
// }
// else{
// 	console.log("upgrade debug version ...");
// 	var lastVersion=parseInt(versions[3]);
// 	lastVersion++;
// 	versions[3]=lastVersion;
// }


console.log("react version is : %s",versions.join("."));
appReleaseConfig.version=versions.join(".");

// var appConfigPath=path.join(__dirname,"../src/config/app.config.json");
// var appConfigString=fs.readFileSync(appConfigPath,"utf-8");
// var replaceString=format('"version":"{version}"',{
// 	version:versions.join(".")
// });
// appConfigString=appConfigString.replace(/\"version\":\s*\"[0-9\.]+\"?/gi,replaceString);

fs.writeFileSync(appReleaseConfigPath,JSON.stringify(appReleaseConfig));

var srcAppConfigPath=path.join(__dirname,"../src/config/app.config.json");
var srcAppConfig=require(srcAppConfigPath);
srcAppConfig.version=versions.join(".");
fs.writeFileSync(srcAppConfigPath,JSON.stringify(srcAppConfig));
console.log("react version update success");