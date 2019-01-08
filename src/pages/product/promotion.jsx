import PageLayout from "components/page-layout.jsx";
import {Header} from "components/header.jsx";
import {Link} from "react-router";
import CountdownService from "service/promotion.service.jsx";


require("assets/css/base.css");
require("assets/css/product.css");
export default class PromotionPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            DefaultImage: '',
            Name:"促销活动",
            Items: []
        }
    }

    static get propTypes() {
        return {
            params: React.PropTypes.object
        }
    }

    static get contextTypes() {
        return {
            router: React.PropTypes.object
        }
    }

    componentDidMount() {
        let sysno = this.props.params.id;
        CountdownService.getPromotionTemplate(sysno).then((result)=> {
            debugger;
            let newState = Object.assign({}, this.state);
            newState.Name = result.Name;
            newState.DefaultImage = result.DefaultImage;
            newState.Items = result.Items;
            this.setState(newState);
        });
    }

    render() {
        debugger;
        return (
            <PageLayout>
                <Header>{this.state.Name}</Header>
                <section className="sales_activity">
                    <div className="act_banner">
                        {this.state.DefaultImage.length > 0 && <img src={this.state.DefaultImage}/>}
                    </div>
                    {
                        this.state.Items.map((item, index)=> {
                            return (
                                <div key={index} className="act_floor">
                                    <div className="tit">
                                        <h3>{item.Name}</h3>
                                    </div>
                                    <div className="act_pro">
                                        <ul>
                                            {item.Products.map((prd, idx)=> {
                                                return (
                                                    <li key={idx}>
                                                        <Link to={`/product/${prd.ProductSysNo}`}>
                                                            <img className="img"
                                                                 style={{backgroundImage:`url(${prd.ProductImage})`}}/>
                                                            <p className="name">{prd.ProductName}</p>
                                                            <p className="price"><span
                                                                className="mr5"><em>{prd.CurrentPrice}</em></span></p>
                                                            <p>
                                                                <del className="fontsize12 colorGrey">
                                                                    ￥{prd.MarketPrice}</del>
                                                            </p>
                                                        </Link>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    </div>
                                </div>
                            )
                        })
                    }
                </section>
            </PageLayout>
        )
    }
}

export class GetCoupon extends React.Component {
    static get propTypes() {
        return {
            params: React.PropTypes.object
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            coupon: [],
            hasGot: false,
            gotMsg: '领取成功'
        }
        this.IsFirstLoad=true;
    }

    componentDidMount() {
        let sysno = this.props.params.id;
        CountdownService.getcouponinfo(sysno).then((result)=> {
            let newState = Object.assign({}, this.state);
            newState.coupon = result;
            if(result.HasReceived===1)
            {
                newState.hasGot = true;
                newState.gotMsg = "已领取";
            }
            this.IsFirstLoad=false;
            this.setState(newState);
        });
    }

    ReceiveCoupons() {
        let sysno = this.props.params.id;
        CountdownService.receivecoupon(sysno).then((res)=> {
            if(res.body.Success){
                let newState = Object.assign({}, this.state);
                newState.hasGot = true;                
                newState.gotMsg = "领取成功";
                this.setState(newState)
            }
            else {
                showMessage(res.body.Message);
            }
        });
    }

    render() {
        let receivebtn;
        if(!this.IsFirstLoad)
        {
            receivebtn = <p className="lq" style={{ 'display': !this.state.hasGot ? '' : 'none' }}><a onClick={()=>{
                                    this.ReceiveCoupons(this.state.SysNo);
                                }} className="djlq">点击领取</a></p>
        }
        return (
            <PageLayout>
                <Header>{this.state.coupon.CouponName}</Header>
                <section className="get_coupon">
                    <div className="coupon_banner"><img src={require("assets/img/coupon_bg1.jpg")}/></div>
                    <div className="g_coupon_mid">
                        <div className="g_coupon_con">
                            {receivebtn}
                            <p className="lq" style={{ 'display': this.state.hasGot ? '' : 'none' }}>
                                <span>{this.state.gotMsg}</span> <Link to="/mine/coupon"
                                                                       className="qsy">查看</Link>
                            </p>
                            <p className="yhq">
                                <span className="g_price"><em>￥</em>{this.state.coupon.FaceValue}</span>
                                <span>元优惠券</span>
                            </p>
                        </div>
                        <div
                            className="g_coupon_text" style={{'display': this.state.coupon.Remark ? '' : 'none'}}>
                            <b className="bt"><span>规则说明：</span></b>
                            <p>
                                {this.state.coupon.Remark}</p>
                        </div>
                    </div>
                </section>

            </PageLayout>
        )
    }
}