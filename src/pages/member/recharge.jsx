import PageLayout from "components/page-layout.jsx";
import {Header} from "components/header.jsx";
import OrderDetailService from "service/orderdetail.service.jsx";
import clientType from "utility/handler.jsx";
import * as cache from "utility/storage.jsx";
import keys from "config/keys.config.json";
import appConfig from "config/app.config.json";
import RouteStateManager from "utility/route-state-manager.jsx";

require("assets/css/base.css");
require("assets/css/shopping.css");
export default class Recharge extends React.Component {
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
                        window.location.href="/mine/rechargeList";
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

    /*
    * call pay In Iphone
    * */
    setupWebViewJavascriptBridge(callback) {
        if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
        if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
        window.WVJBCallbacks = [callback];
        let WVJBIframe = document.createElement('iframe');
        WVJBIframe.style.display = 'none';
        WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
        document.documentElement.appendChild(WVJBIframe);
        setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0);
        return null;
    }

    payClick(payType) {
        let payTypeID=payType;
        let soSysNo=this.props.params.sosysno;
        let token=cache.getCache(keys.token);
        OrderDetailService.updateRechargePayType(soSysNo,payTypeID).then((res)=>{
            if(res){
                //is Iphone
                if(clientType.isPhone){
                    console.log('it is iphone')
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
                    console.log('is wechat')
                    OrderDetailService.callWechatRechargePay(soSysNo).then((wechatres)=>{
                        this.wxjspay(wechatres.Data);
                    })
                }
                //is site
                else{
                    alert("请使用微信或APP下单");
                    // window.location.href=`${appConfig.apihost}/order/OnlinePay/${soSysNo}?token=${token}`;
                }
            }
       })

   }

    renderWechatPayType(){
        console.log(clientType.isWechat)
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


    componentDidMount() {
        //RouteStateManager.setPreviousPathname("/shoppingcart");
        let newState = Object.assign({}, this.state);
        let soSysno = this.props.params.sosysno;
        OrderDetailService.getRechargeOrderInfo(soSysno).then((res)=> {
            newState.order = res.Data;
            this.setState(newState);
        });
        RouteStateManager.setPreviousPathname("/recharge");
    }

    render() {
        return (
            <PageLayout>
                <Header onGoBack={()=>{ this.context.router.go(-this.state.backStep)}}>选择支付方式</Header>
                <section className="payment">
                    <ul>
                    <li className="amount box-line-t"><b className="fl">订单:
                        <span className="blue" onClick={()=>{
                            this.context.router.push({
                                pathname: `/mine/rechargeList`
                            });
                            }}>{this.state.order.SysNo}</span>金额</b><b className="colorRed fr">￥{this.state.order.RechargeAmount}</b></li>
                        {this.renderWechatPayType()}
                    </ul>
                    </section>
            </PageLayout>
    )
    }
}