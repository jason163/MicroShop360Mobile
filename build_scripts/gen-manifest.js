/**
 * Created by jean.h.ma on 6/2/16.
 */
console.log("generate manifest ...");
var fs=require("fs");
var path=require("path");
var format = require("string-template");
var helper=require("./helper");
var dateFormat = require('dateformat');

var version=helper.getVersion();
var manifestTemplatePath=path.join(__dirname,"../deploy_config/manifest-template.txt");
var manifestTemplate=fs.readFileSync(manifestTemplatePath,"utf-8");
var manifestTemplateData={
	version:version,
	cache:"",
	network:"",
	fallback:"",
	date:dateFormat(new Date(),"yyyy-mm-dd HH:MM:ss")
};
//get all files
var distPath=path.join(__dirname,"../dist");
var distFiles=fs.readdirSync(distPath);
manifestTemplateData.cache=distFiles.join("\n");

var manifest=format(manifestTemplate,manifestTemplateData);

fs.writeFileSync(distPath+"/manifest.appcache",manifest);

var indexPath=path.join(__dirname,"../dist/index.html");
var indexString=fs.readFileSync(indexPath,"utf-8");
indexString=indexString.replace(/<html>/gmi,'<html manifest="manifest.appcache">');
fs.writeFileSync(indexPath,indexString);