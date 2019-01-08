import PageLayout from "components/page-layout.jsx";
import PageListView2 from "components/page-list-view2.jsx";
import {Header} from "components/header.jsx";
import {Link} from "react-router"
import OrderListService from "service/orderlist.service.jsx";
import OrderService from "service/order.service.jsx";
import keys from "config/keys.config.json";
import {setSessionCache, getSessionCache} from "utility/storage.jsx";

export class OrderCell extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            SOStatus: 0,
            SOStatusStr: ""
        }
    }

    componentWillMount() {
        this.setState({
            SOStatus: this.props.data.SOStatus,
            SOStatusStr: this.props.data.SOStatusStr
        })
    }

    static get propTypes() {
        return {
            data: React.PropTypes.object
        }
    }

    static get contextTypes() {
        return {
            router: React.PropTypes.object.isRequired
        }
    }


    render() {
        let action = "";
        if (this.state.SOStatus === 0) {
            action = <div className="c_item_opera clearFix box-line-t">
                <Link to={`/thankyou/${this.props.data.SysNo}`} className="bntlinered">立即付款</Link>
                <a className="bntlinered" onClick={()=>{
                    confirmBox({
                                message: '真的不买了吗？',
                                onConfirm:()=>{
                                     OrderService.voidso(this.props.data.SysNo).then(response=> {
                                            confirmBox({});
                                            this.setState({
                                             SOStatus:-1,
                                             SOStatusStr: "已作废"
                                         })
                                    });
                                },
                                onCancel:()=>{confirmBox({});}
                            });
                    }}>取消订单</a>
            </div>
        }
        return(
            <li>
                <div className="c_orderitem mb5">
                    <div className="box-line-t box-line-b">
                        <div className="c_orderitem_tit box-line-b">
                            <span>{this.props.data.TradeTypeStr}订单：{this.props.data.SysNo}</span>
                            <span className="colorRed fr">{this.state.SOStatusStr}</span>
                        </div>
                        <div className="c_orderitem_con">
                            <a
                                onClick={() => {
                                    this.context.router.push({
                                        pathname: `/mine/orderdetail/${this.props.data.SysNo}`
                                    });
                                }
                                }
                                className="clearFix">
                                {
                                    this.props.data.SOItem.map(item => {
                                        return (
                                            <i className="box-border"><img src={item.ProductImg}/></i>
                                        )
                                    })
                                }
                            </a>

                            <p>
                                <span className="colorGrey mr5">x { this.props.data.SOItem.length}</span>
                                <span className="c_price">货款：<em>{this.props.data.TotalPayAbleAmount}</em></span>
                            </p>
                        </div>
                        {action}
                    </div>
                </div>
            </li>
        )
    }
}

export class OrderListHeader extends React.Component {

    constructor(props) {
        super(props);
        this.state = {currentTabItemIndex: 0};
    }

    static get propTypes() {
        return {
            tabs: React.PropTypes.array,
            activityTab: React.PropTypes.number,
            onTabItemClick: React.PropTypes.func
        }
    }

    tabItemClick(tabIndex) {
        if (tabIndex >= 0 && tabIndex < this.props.tabs.length) {
            this.props.onTabItemClick(tabIndex);
            this.setState({currentTabItemIndex: tabIndex});
        }
    }

    render() {
        let tabItemClassName = "";
        let tabs = this.props.tabs.map((item, index) => {
            if (index === this.props.activityTab) {
                tabItemClassName = "on";
            } else {
                tabItemClassName = "";
            }
            return (
                <li className={tabItemClassName} onClick={() => this.tabItemClick(index) }>{item.text}</li>
            )
        });
        return (
            <ul className="clearFix">
                {tabs}
            </ul>
        )
    }
}

export default class OrderListPage extends React.Component {
    constructor(props) {
        super(props);
        this.tabs = [
            {
                text: "全部",
                value: 999
            },
            {
                text: "待支付",
                value: 0
            },
            {
                text: "待收货",
                value: 65
            },
            {
                text: "已完成",
                value: 100
            },
            {
                text: "待评价",
                value: 101
            }];
        this.state = {
            activeTabIndex: getSessionCache(keys.orderListTabActive) || 0,
            clearOldData: false,
            pageData: []
        };
    }

    getPageData(pageIndex) {
        OrderListService.query(this.tabs[this.state.activeTabIndex].value, pageIndex).then(res => {
            ajaxLoaded();
            this.setState({
                pageData: res.data,
                clearOldData: false,
                totalRecordCount: res.recordsTotal
            });
        }).catch(() => {
            ajaxLoaded();
        })
    }

    headerItemClick(tabIndex) {
        if (tabIndex !== this.state.activeTabIndex) {
            setSessionCache(keys.orderListTabActive, tabIndex);
            ajaxLoading();
            OrderListService.query(this.tabs[tabIndex].value, 0).then(res => {
                ajaxLoaded();
                this.setState({
                    activeTabIndex: tabIndex,
                    pageData: res.data,
                    clearOldData: true,
                    totalRecordCount: res.recordsTotal
                });
            }).catch(() => {
                ajaxLoaded();
            })
        }
    }

    static get propTypes() {
        return {
            location: React.PropTypes.any
        }
    }

    static get contextTypes() {
        return {
            router: React.PropTypes.object.isRequired
        }
    }

    componentWillMount() {
        if (this.props.location.state !== null && this.props.location.state.activeTabIndex !== undefined) {
            this.setState({
                activeTabIndex: this.props.location.state.activeTabIndex
            })
            setSessionCache(keys.orderListTabActive, this.props.location.state.activeTabIndex);
        }
    }

    render() {
        return (
            <PageLayout>
                <Header onGoBack={()=>{
                    debugger;
                    this.context.router.push("/");
                }}>我的订单</Header>
                <section className="switch_tit c_order_tit" id="ordertit">
                    <OrderListHeader tabs={this.tabs} activityTab={this.state.activeTabIndex}
                                     onTabItemClick={(tabItemIndex) => this.headerItemClick(tabItemIndex) }/>
                </section>
                <section className="c_order" ref="c_order">
                    <PageListView2 template={OrderCell}
                                   onGetPageData={(pageIndex) => this.getPageData(pageIndex) }
                                   clearOldData={this.state.clearOldData}
                                   pageData={this.state.pageData}
                                   totalRecordCount={this.state.totalRecordCount}/>
                </section>                
            </PageLayout>
        );
    }
}





