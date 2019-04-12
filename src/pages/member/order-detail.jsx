import {Header} from "components/header.jsx";
import service from "service/orderdetail.service.jsx";
import {SOItemCell} from "bm/list-view.jsx"
import {Link} from "react-router"
import PageLayout from "components/page-layout.jsx";
import OrderService from "service/order.service.jsx";
import RouteStateManager from "utility/route-state-manager.jsx";

export class OrderDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            order: [],
            items: []
        };
    }



    static get propTypes() {
        return {
            params: React.PropTypes.object.isRequired
        };
    }
    static get contextTypes() {
        return {
            router: React.PropTypes.object.isRequired
        }
    }

    componentDidMount() {
        service.getOrderInfo(this.props.params.sosysno).then((res)=> {
            let newState = Object.assign({}, this.state);
            newState.order = res.Data;
            newState.items = res.Data.Items;
            this.setState(newState);
        });
    }

    render() {
        let action = "";
        if (this.state.order.SOStatus===10||this.state.order.SOStatus === 0) {
            action = <section className="c_btn box-line-t">
                    <a className="bntlinered ml10" onClick={()=>{
                        confirmBox({
                                message: '真的不买了吗？',
                                onConfirm:()=>{
                                      OrderService.voidso(this.state.order.SysNo).then(response=> {
                                                        confirmBox({});
                                                        document.body.scrollTop=0;
                                                        let newState = Object.assign({}, this.state);
                                                        newState.order.SOStatus = -1;
                                                        newState.order.SOStatusStr = "已作废";
                                                        this.setState(newState);
                                           });
                                },
                                onCancel:()=>{confirmBox({});}
                            });
                    }}>取消订单</a>
                {this.state.order.SOStatus === 0
                    &&<Link to={`/thankyou/${this.state.order.SysNo}`} className="bntlinered ml10">立即付款</Link>
                }
            </section>
        }
        // else if (this.state.order.SOStatus === 100) {
        //     action = <section className="c_btn box-line-t">
        //         <Link to={`/mine/comment`} className="bntlinered ml10">评价晒单</Link>
        //     </section>
        // }
        else if(this.state.order.SOStatus >= 10 && this.state.order.SOStatus < 100) {
            action = <section className="c_btn box-line-t">
                <Link to={`/mine/orderlogistic/${this.state.order.SysNo}`} className="bntlinered ml10">订单跟踪</Link>
            </section>
        }
        return (
            <div>
                <PageLayout style={{"padding-bottom":"50px"}}>
                    <Header onGoBack={()=>{
                        /*if(RouteStateManager.getPreviousPathname()==="/thankyou")
                        {
                            this.context.router.push("mine/orderlist");
                        }else{
                            this.context.router.push("/");
                        }*/
                        this.context.router.push({
                            pathname: "/mine/orderlist",
                            state: { activeTabIndex: 0 }
                        });
                    }}>订单详情</Header>
                    <section className="order_details mt10">
                        <div className="o_xx box-line-b mb5">
                            <div className="o_details_item box-line-t">
                                <div className="clearFix">
                                    <span className="fl">订单号：{this.state.order.SysNo}</span><span
                                    className="o_right colorRed fr">{this.state.order.SOStatusStr}</span>
                                </div>
                            </div>
                            <div className="o_details_item box-line-t">
                                <Link to={`/mine/orderlogistic/${this.state.order.SysNo}`}>
                                    <div className="clearFix">
                                        <span className="fl">运单号：{this.state.order.DeliveryTrackingNumber}</span><span
                                        className="o_right colorGrey fr">配送方式：{this.state.order.ShipTypeName}</span>
                                    </div>
                                </Link>
                            </div>
                        </div>
                        <div className="box-line-b mb5">
                            <div className="o_details_item box-line-t">
                                <p><span
                                    className="mr10">{this.state.order.ReceiveContact}</span><span>{this.state.order.ReceivePhone}</span>
                                </p>
                                <p>{this.state.order.ReceiveAddress}</p>
                            </div>
                        </div>

                        <div className="o_pro box-line-b mb5">
                            {
                                this.state.items.map((detail, index)=> {
                                    return (
                                        <SOItemCell sostatus={this.state.order.SOStatus} detail={detail}
                                                    key={index}></SOItemCell>
                                    )
                                })
                            }
                        </div>

                        <div className="box-line-b mb5">
                            <div className="o_details_item box-line-t">
                                <div className="clearFix">
                                    <span className="fl">支付方式</span><span
                                    className="o_right colorGrey fr">{this.state.order.PayTypeName}</span>
                                </div>
                            </div>
                        </div>

                        {/*<div className="box-line-b mb5">
                            <div className="o_details_item box-line-t">
                                <p className="p_text"><span>发票抬头：</span><span
                                    className="colorGrey">{this.state.order.InvoiceHeader}</span></p>
                            </div>
                        </div>*/}

                        <div className="box-line-b mb5">
                            <div className="o_details_item box-line-t">
                                <p className="p_text"><span>买家留言：</span><span
                                    className="colorGrey">{this.state.order.CustomerMemo}</span></p>
                            </div>
                        </div>
                        <div className="checkout_price">
                            <p>商品总金额：￥{this.state.order.ProductOriginAmt}</p>
                            <p>订单优惠：-￥{this.state.order.ProductDiscountAmt}</p>
                            <p>优惠券抵扣：-￥{this.state.order.CouponDiscountAmt}</p>
                            <p>运费：￥{this.state.order.ShippingOriginAmt}</p>
                            <p>余额支付：-￥{this.state.order.BalancePayAmount}</p>
                            <p className="colorRed">实付：￥{this.state.order.CashPayAbleAmount}</p>
                            <p className="colorGrey">下单时间：{this.state.order.SODateStr }</p>
                        </div>
                    </section>
                </PageLayout>
                {action}
            </div>
        );
    }
}

export class OrderLogistic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            order: [],
            logs: []
        };
    }

    static get propTypes() {
        return {
            params: React.PropTypes.object.isRequired
        };
    }

    static get contextTypes() {
        return {
            router: React.PropTypes.object.isRequired
        }
    }

    componentDidMount() {
        let newState = Object.assign({}, this.state);
        service.getOrderTracking(this.props.params.sosysno).then((res)=> {
            newState.order = res.Data;
            newState.logs = res.Data.Log;
            this.setState(newState);
        });
    }

    render() {
        return (
            <PageLayout>
                <Header>订单跟踪</Header>
                <section className="order_tracking mt10">
                    <div className="o_tracking_item box-line-b box-line-t mb5">
                        <p>订单号：{this.state.order.SOSysNo}</p>
                        <p>订运单号：{this.state.order.DeliveryTrackingNumber}</p>
                        <p>订配送方式：{this.state.order.ShipTypeName}</p>
                    </div>
                    {
                        this.state.logs.map((detail, index)=> {
                            return (
                                <div key={index} className="o_tracking_item box-line-b box-line-t mb5">
                                    <p className="fontsize12 colorGrey">{detail.Key}</p>
                                    <p>{detail.Value}</p>
                                </div>
                            )
                        })
                    }


                </section>
            </PageLayout>
        );
    }
}