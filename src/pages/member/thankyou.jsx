import PageLayout from "components/page-layout.jsx";
import {Header} from "components/header.jsx";
import OrderDetailService from "service/orderdetail.service.jsx";
import clientType from "utility/handler.jsx";
import * as cache from "utility/storage.jsx";
import keys from "config/keys.config.json";
import RouteStateManager from "utility/route-state-manager.jsx";

require("assets/css/base.css");
require("assets/css/shopping.css");
export default class Thankyou extends React.Component {
    constructor(props) {
      super(props);
        this.WXPayDATA=[];
        let step =1;
        if(this.props.location.state!== null && typeof this.props.location.state.backStep!== "undefined")
        {
            step=this.props.location.state.backStep;
        }

        this.state={
            order:{},
            backStep:step
        }
    }
    static get propTypes(){
        return{
            params:React.PropTypes.object.isRequired
        };
    }

    static get contextTypes(){
        return{
            router:React.PropTypes.object.isRequired,
            history:React.PropTypes.object,
            location:React.PropTypes.object.isRequired
        }
    }
    /*
    * Call Pay In Wechat
    * */
    onBridgeReady() {
        if (this.WXPayDATA && this.WXPayDATA.length > 0) {
            WeixinJSBridge.invoke(
                "getBrandWCPayRequest", {
                    "appId": this.WXPayDATA[0],
                    "timeStamp": this.WXPayDATA[1],
                    "nonceStr": this.WXPayDATA[2],
                    "package": `prepay_id=${this.WXPayDATA[3]}`,
                    "signType": "MD5",
                    "paySign": this.WXPayDATA[4]
                },
                function (res) {
                    if (res.err_msg === "get_brand_wcpay_request:ok") {
                        window.location.href="/mine/orderlist";
                    } else {
                        throwError(res.err_msg);
                    }
                }
            );
        }
    }

    wxjspay(dataStr) {
        this.WXPayDATA = dataStr.split("|");
        if (typeof WeixinJSBridge === "undefined") {
            if (document.addEventListener) {
                document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady, false);
            } else if (document.attachEvent) {
                document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady);
                document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady);
            }
        } else {
            this.onBridgeReady();
        }
    }

    apiCloudPay(dataStr){
        var aliPay = api.require('aliPay');
        aliPay.payOrder({
            orderInfo: dataStr
        },function (ret,err) {
            api.alert({
                title: '支付结果',
                msg: ret.code,
                buttons: ['确定']
            });
            window.location.href="/mine/orderlist";
        });
    }

    /*
    * call pay In Iphone
    * */
    setupWebViewJavascriptBridge(callback) {
        if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
        if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
        window.WVJBCallbacks = [callback];
        let WVJBIframe = document.createElement('iframe');
        WVJBIframe.style.display = 'none';
        WVJBIframe.src = 'https://__bridge_loaded__';
        document.documentElement.appendChild(WVJBIframe);
        setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0);
        return null;
    }

    payClick(payType) {
        let payTypeID=payType;
        let soSysNo=this.props.params.sosysno;
        let token=cache.getCache(keys.token);
        OrderDetailService.updateOrderPayType(soSysNo,payTypeID).then((res)=>{
           if(res){
               // if(true){
               //     OrderDetailService.callOnlinePay(soSysNo).then((wechatres)=>{
               //         this.apiCloudPay(wechatres.Data);
               //     })
               // }
               //is Iphone
               if(clientType.isPhone){
                   this.setupWebViewJavascriptBridge(function (bridge) {
                       //bridge.registerHandler('JS Echo', function(data, responseCallback) {
                           //console.log("JS Echo called with:", data);
                           //responseCallback(data);
                       //});
                       bridge.callHandler('PayObjc', {'soSysNo':soSysNo,'payTypeId':payTypeID,'token':token,'successUrl':`/paysuccess/${soSysNo}`}, function responseCallback(responseData) {
                           console.log("JS received response:", responseData);
                       });
                   });
               }
               //is Android
              else if(clientType.isAndorid) {
                   try {
                       window.jsPayObj.pay(payTypeID.toString(), soSysNo.toString(),token,`/paysuccess/${soSysNo}`);
                   }
                   catch(ex) {
                        throwError(ex.message);
                   }
               }
               //is wechat
              else if(clientType.isWechat){
                   OrderDetailService.callWechatPay(soSysNo).then((wechatres)=>{
                       this.wxjspay(wechatres.Data);
                   })
               }
               //is site
               else{
                   window.location.href=`/order/OnlinePay/${soSysNo}?token=${token}`;
               }
           }
       })

   }

    renderWechatPayType(){
       if(clientType.isWechat)
       {
           return (
               <li className="weixin"><a onClick={()=>{
                    this.payClick(111)
               }}>微信支付</a></li>
           )
       }
       return null

   }

    renderAliPayType() {
        if(!clientType.isWechat){

            return (
                <li className="alipay"><a onClick={()=>{
                         this.payClick(110)
                }}>支付宝支付</a></li>
            )
        }
        return null;
    }

    renderPayTypes(){
        if(!clientType.isWechat){
            return (
                <li className="alipay"><a onClick={()=>{
                    this.payClick(110)
                }}>支付宝支付</a></li>
            )
        }
        if(clientType.isWechat){
            return (
                <li className="weixin"><a onClick={()=>{
                    this.payClick(111)
                }}>微信支付</a></li>
            )
        }

        return null;
    }

    componentDidMount() {
        //RouteStateManager.setPreviousPathname("/shoppingcart");
        let newState = Object.assign({}, this.state);
        let soSysno = this.props.params.sosysno;
        OrderDetailService.getOrderInfo(soSysno).then((res)=> {
            newState.order = res.Data;
            this.setState(newState);
        });
        RouteStateManager.setPreviousPathname("/thankyou");
    }

    //componentWillMount(){
    //    this.context.router.setRouteLeaveHook(
    //        this.context.route,
    //        this.routeWillLeave
    //    )
    //}

    //routeWillLeave(nextLocation){
    //    RouteStateManager.setPreviousPathname("/mine/orderlist");
    //}

    render() {
        return (
            <PageLayout>
                <Header onGoBack={()=>{ this.context.router.go(-this.state.backStep)}}>选择支付方式</Header>
                <section className="payment">
                    <ul>
                    <li className="amount box-line-t"><b className="fl">订单（<span className="blue" onClick={()=>{
                     this.context.router.push({
                                pathname: `/mine/orderdetail/${this.state.order.SysNo}`
                            });
                    }}>{this.state.order.SysNo}</span>）金额</b><b className="colorRed fr">￥{this.state.order.CashPayAbleAmount}</b></li>
                        {this.renderWechatPayType()}
                        {this.renderAliPayType()}
                    </ul>
                    </section>
            </PageLayout>
    )
    }
}