import client from "utility/rest-client.jsx";
import wx from 'weixin-js-sdk';

const wxShare = function (json={},callback) {

    let signUrl = window.location.href.split('#')[0];
    let linkUrl = `https://m.great-land.net/wxShare.html?beautyRedirect=${encodeURIComponent(json.redirectUrl)}`

    let {feed_id,title,Desc,img_share}=json;
    let shareTitle = title || '四季美';
    let shareDesc = Desc;
    let shareImg = img_share || require('../assets/img/logo.png');
    client.get(`WeiXin/GetJSSDKConfig?url=${signUrl}`).then((res)=>{
alert(linkUrl);
        wx.config({
            debug:false,
            appId: res.body.Data.AppID,
            timestamp: res.body.Data.TimeStamp,
            nonceStr: res.body.Data.NonceStr,
            signature: res.body.Data.Signature,
            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });

        wx.ready(function () {
            //分享到朋友圈
            wx.onMenuShareTimeline({
                title: shareTitle, // 分享标题
                desc: shareDesc, // 分享描述
                link: linkUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: shareImg, // 分享图标
                success: function() {
                    // 用户确认分享后执行的回调函数
                    callback()
                },
                cancel: function() {
                    // 用户取消分享后执行的回调函数
                }
            })
            //分享给朋友
            wx.onMenuShareAppMessage({
                title: shareTitle, // 分享标题
                desc: shareDesc, // 分享描述
                link: linkUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: shareImg, // 分享图标
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function() {
                    // 用户确认分享后执行的回调函数
                    callback()
                },
                cancel: function() {
                    // 用户取消分享后执行的回调函数
                }
            })
        });
    })
}

export default wxShare;
