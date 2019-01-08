/**
 * Created by jean.h.ma on 6/2/16.
 */
console.log("update cordova config ...");
var fs=require("fs");
var path=require("path");
var args=require("yargs").argv;
var format = require("string-template");
var helper=require("./helper");

var version=helper.getVersion();

console.log("msite domain : %s",args.domain);
var runtime=args.runtime||"msite";
console.log("runtime : %s",runtime);

var cordovaConfigPath=path.join(__dirname,"../../labor-app/config.xml");
var cordovaConfig=fs.readFileSync(cordovaConfigPath,"utf-8");

var newCordovaConfig="";

switch(runtime){
	case "html5":
		newCordovaConfig=cordovaConfig.replace(/<content\s*src=\".*\"?\s*\/>/gmi,
			format('<content src="{domain}/index.html?as=html5&version={version}" />',{
				domain:args.domain,
				version:version
			}));
		break;
	case "msite":
		newCordovaConfig=cordovaConfig.replace(/<content\s*src=\".*\"?\s*\/>/gmi,
			format('<content src="{domain}/index.html?as=msite&version={version}" />',{
				domain:args.domain,
				version:version
			}));
		break;
	default:
		newCordovaConfig=cordovaConfig.replace(/<content\s*src=\".*\"?\s*\/>/gmi,
			format('<content src="index.html?as=app&version={version}" />',{
				version:version
			}));
}


fs.writeFileSync(cordovaConfigPath,newCordovaConfig);


