/**
 * Created by jean.h.ma on 5/31/16.
 */
var nodemailer = require('nodemailer');
var maillist=require("../deploy_config/maillist.json");
var path=require("path");
var format = require("string-template");
var fs=require("fs");
var args=require("yargs").argv;
var dateFormat = require('dateformat');
var helper=require("./helper.js");

var machinePath=path.normalize(__dirname+"/../../../../../../.ssh/machine.json");
var machine=require(machinePath);

// var mailGroup="default";
var mailGroup=args.group || "default";

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport("SMTP",{
	host: "115.29.54.253", // hostname
	secureConnection: false, // TLS requires secureConnection to be false
	port: 25, // port for secure SMTP
	auth: {
		user: machine.user,
		pass: machine.pwd
	}
});

// setup e-mail data with unicode symbols
var templatePath=path.join(__dirname,"../deploy_config/email_template",maillist[mailGroup].template);
var mailBodyTemplate=fs.readFileSync(templatePath,"utf-8");
var mailBodyData=maillist[mailGroup].templateData || {};
mailBodyData.date=dateFormat(new Date(),"yyyy-mm-dd HH:MM:ss");
mailBodyData.version=helper.getVersion();
var changelogPath=path.join(__dirname,"../changelog.log");
var changelogString=fs.readFileSync(changelogPath,"utf-8");
mailBodyData.changelog=changelogString.replace(/\n/g,"<br/>");

// var androidQRCode="";
// var iosQRCode="";

// var androidQRImagePath=path.join(__dirname,"../../labor-app/platforms/android/build/outputs/apk/fir-云筑劳务.png");
// var androidQRImageBase64=new Buffer(fs.readFileSync(androidQRImagePath),"binary").toString("base64");
// var androidQRImageDataUri=

var mailOptions = {
	from: maillist[mailGroup].from, // sender address
	to: maillist[mailGroup].to.join(","), // list of receivers
	subject: maillist[mailGroup].subject, // Subject line
	text: format(mailBodyTemplate,mailBodyData), // plaintext body
	html: format(mailBodyTemplate,mailBodyData) // html body
};
if(maillist[mailGroup].cc){
	mailOptions.cc=maillist[mailGroup].cc.join(",");
}

// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
	if(error){
		console.log("send email error");
		console.log(error);
	}
	console.log("send mail success");
	// var changelogHistoryPath=path.join(__dirname,"../deploy_config/history/"+dateFormat(new Date(),"yyyy-mm-dd HH:MM:ss")+".log");
	if(changelogString!=="") {
		// fs.writeFileSync(changelogHistoryPath, changelogString);
		fs.writeFileSync(changelogPath, "");
	}
	transporter.close();
});