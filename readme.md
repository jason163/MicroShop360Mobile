runtime说明:
    html5:   会使用html5 application cache,此方式会部署一个web网站,此网站会开启html5 application cache模式,客户端可以选择是否更新.
             html5的方式主要是为了给APP壳子使用,可以通过只更新html5的网站来直接更新APP,无需重新下载安装,同时在没有网络的情况下也能正常访问
             所有页面.后期还会加上离线数据缓存.此方式有个小的限制,application cache大小不能超过5M.
    APP:     APP是直接把所有的资源都打包到APP包中(APK),这种方式需要每次都打包APP,用户需要下载APP来更新APP.
    msite:   就是普通的msite站点,不会有任何的cache,就是和普通的网站一样.

    因此,如果是通过APP访问的话存在两种模式,一个是html5,一个是app.html5的方式可以应用于android,但是不能用于ios(审核不过),ios可以选择app
    的方式发布.

====config====
prd:
{
	"version":"0.0.57",
	"appid":"12CC32EC-6AD8-4345-9465-532F967AD725",
	"apihost": "http://lwapp.yzw.cn",
	"fileUploaderUrl": "http://lwres.yzw.cn/UploadHandler.ashx?appName=attachment",
	"contentSourceUrl": "http://lwres.yzw.cn/",
	"smsDelay": 120,
	"runtime":"app"
}

qa:
{
	"version":"0.0.55",
	"appid":"12CC32EC-6AD8-4345-9465-532F967AD725",
	"apihost": "http://172.16.0.246:8081",
	"fileUploaderUrl": "http://172.16.0.246:8201/UploadHandler.ashx?appName=attachment",
	"contentSourceUrl": "http://172.16.0.246:8201/",
	"smsDelay": 120,
	"runtime":"app"
}

====feature====
* 重构route config
  定义一个类似route.create的helper方法,所有的component都是异步方式,route是同步方式
* APP更新
  开发插件或者是使用现成插件实现live upgrade
* 实现离线数据
* 实现数据缓存
* 实现goback加载local 数据
* 实现页面状态保持
* 附件图片的查看页面
* 优化render,哪种只需要第一次计算的属性尽量在constructor中计算好,如果是service之后需要计算的也是提前在state中定义好一个默认值,
  service之后进行计算.
* msite prd发布工具
* app prd发布工具
* [已实现]配置文件改成json
* 添加app 统计信息

====compatible====
  中兴
    [app已解决]退出登录-->登录-->进入一个需要登录的页面-->返回,会返回到登录页面,仅出现一次;
    [app已解决]有时候文本框无法输入;
  三星
    [app已解决]上传文件不可以;
  IOS,android
    form表单键盘弹出的问题
  小米
    [app已解决]上传文件直接退出

====hold bugs====
清除历史路由;

