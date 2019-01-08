import PageLayout from "components/page-layout.jsx";
import {Header} from "components/header.jsx";
import keys from "config/keys.config.json";
import * as Cache from "utility/storage.jsx";
require("assets/css/base.css");
require("assets/css/shopping.css");

export default class PaySuccess extends React.Component {
    static get propTypes() {
        return {
            params: React.PropTypes.object
        }
    }

    constructor(props) {
        super(props);
    }

    static get contextTypes() {
        return {
            router: React.PropTypes.object
        }
    }

    render() {
        var id = this.props.params.sosysno;
        var redirectUrl = `/mine/orderdetail/${ this.props.params.sosysno}`;
        if(id % 2==0){
            redirectUrl = '/mine/rechargeList'
        }
        return (
            <PageLayout>
                <Header>支付成功</Header>
                <section className="paysuccess">
                    <div className="pay_tips">
                        <i style={{backgroundImage:`url(${require("assets/img/paysuccess.png")})`}}></i>
                        <p><b>支付成功！</b>请稍后在订单页面查看。感谢您的支持，我们将尽快为您发货。</p>
                        <div className="pay_btn"><a onClick={()=>{
                    Cache.setSessionCache(keys.tabPageActive, 0);
                    this.context.router.replace("/");
                }}>继续购物</a> <a onClick={() => { this.context.router.push({pathname: redirectUrl});
                                }}>查看详情</a></div>
                    </div>
                </section>
            </PageLayout>
        )
    }
}