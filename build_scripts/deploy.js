/**
 * Created by youkai on 16/6/2.
 */
var fs = require('fs'),
    path = require('path'),
    util = require('util');

var ftpClient = require('ftp'),
    sshConn = require('ssh2').Client(),
    iconv = require('iconv-lite'),
    args = require("yargs").argv,
    archiver = require('archiver');

var appConfig = require('../deploy_config/app.config.release.json');

console.log('Current NODE_ENV = ' + process.env.NODE_ENV);

var siteType = args.type || "msite";

var config = {
    qa: {
        hosts: ['118.178.18.118'],//服务器
        servicePath: 'E:\\qa\\msite\\m\\',//代码运行路径
        deployPath: 'E:\\deploy_ftp\\',//发布包上传路径
        backupPath: 'E:\\backup\\qa\\'//代码备份目录
    },
    production: {
        hosts: ['118.178.18.118'],//服务器
        servicePath: 'E:\\msite\\m\\',//代码运行路径
        deployPath: 'E:\\deploy_ftp\\',//发布包上传路径
        backupPath: 'E:\\backup\\prd\\'//代码备份目录
    }
};

var envConfig = config[process.env.NODE_ENV || 'dev'];
var hosts = envConfig.hosts;
var hostsCount = hosts.length;
var curHostIndex = 0;

var servicePath = util.format(envConfig.servicePath);
var deployPath = envConfig.deployPath;
var backupPath = util.format(envConfig.backupPath);

var version = appConfig.version;
var zipFilePath = util.format("match_%s_release_%s", siteType, version);
var packageName = zipFilePath + '.zip';

var archiveDist = function (cb) {
    var output = fs.createWriteStream(packageName);
    var archive = archiver('zip');

    archive.on('error', function (err) {
        throw err;
    });
    archive.on('end', function () {
        cb();
    });

    archive.pipe(output);
    //压缩dist目录
    archive.directory('./dist', zipFilePath);
    archive.finalize();
};

var upload = function () {
    var tempFtpClient = ftpClient();
    tempFtpClient.on('ready', function () {
        var self = this;
        console.log(this.options.host + " connectted");
        //上传发布包到FTP
        var localPath = path.join(__dirname, "../", packageName);
        var remotePath = '/' + packageName;

        console.log(packageName + " uploading.......");

        this.put(localPath, remotePath, function (err) {
            if (err) throw err;
            console.log(self.options.host + " upload successfully");
            var curHost = self.options.host;
            self.end();
            batchExeCmd(curHost);
        });
    });
    console.log('connectting to ftp server ' + hosts[curHostIndex] + "..........");
    tempFtpClient.connect({host: hosts[curHostIndex],port:2121,user:"yanghuo",password:"Yanghuo@123"});
};

var cmds = [
    {
        cmd: "powershell cd " + deployPath,
        desc: "定位到" + deployPath
    }, {
        cmd: "cmd /c zip.exe -r " + backupPath + "\\" + version + ".zip" + " " + servicePath,
        desc: "备份代码"
    }, {
        cmd: "cmd /c unzip.exe -u " + packageName,
        desc: "解压发布包"
    }, {
        cmd: "cp -r -Force " + path.basename(packageName, '.zip') + "/*.* " + servicePath,
        desc: "拷贝发布文件到网站部署路径"
    }, {
        cmd: "rm -r " + path.basename(packageName, '.zip'),
        desc: "删除解压后的发布文件"
    }
];

var cmdCount = cmds.length;
var execCount = 1;

sshConn.on('ready', function () {
    console.log('ssh2 client ready');
    execCmd(cmds[execCount]);
});

sshConn.on('end', function () {
    console.log('ssh2 client end');
});

//在服务器上执行命令
var batchExeCmd = function (host) {
    sshConn.connect({
        host: host,
        port: 22,
        username: 'yanghuo',
        password: 'Yanghuo@123'
    });
};

var execCmd = function (cmd) {
    sshConn.exec(cmds[0].cmd + "\n" + cmd.cmd + "\n", function (err, stream) {
        console.log(sshConn.config.host + ":" + cmd.desc);
        stream.on('close', function () {
            //console.log('Stream :: close');
            execCount++;
            if (execCount >= cmdCount) {
                console.log('全部执行完成');
                execCount = 1;
                sshConn.end();

                curHostIndex++;
                //全部服务器执行完成后,删除本地的包
                if (curHostIndex >= hostsCount) {
                    console.log("delete local package: " + packageName);
                    fs.unlink(packageName);
                } else {
                    //继续处理下一个服务器
                    upload();
                }
            } else {
                execCmd(cmds[execCount]);
            }
        }).on('data', function (data) {
            console.log('STDOUT: ' + iconv.decode(data, 'GBK'));
        }).stderr.on('data', function (data) {
            console.log('STDERR: ' + data);
        }).on('error', function (err) {
            console.log(err);
            sshConn.end();
        })
    });
};

//压缩文件,完成后上传
archiveDist(upload);
