import {Header} from "components/header.jsx";
import {ListView, ListKeyValueEditCell, ComplexCell} from "bm/list-view.jsx";
import {Link} from "react-router"
import appConfig from "config/app.config.json";
import Loading from "components/loading.jsx";
import workerService from "service/worker.service.jsx"
import mineService from "service/mine.service.jsx"
import {UploaderBtn} from "components/uploaderbtn.jsx"
import authService from "service/auth.service.jsx";

require("assets/css/base.css");
require("assets/css/accountindex.css");


export class MineIndex extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            info: {HeadImage: require("assets/img/default_head.png")}
        };
    }

    static get contextTypes() {
        return {
            router: React.PropTypes.object.isRequired
        }
    }

    static get propTypes() {
        return {
            IsSamePageWithIndex:React.PropTypes.bool,
            loginCallback:React.PropTypes.func
        }
    }

    componentDidMount() {
        //if (authService.isLogin()) {
            ajaxLoading();
            mineService.getaccountcenterinfo().then((res) => {
                ajaxLoaded();
                if(!Object.is(this.props.IsSamePageWithIndex,null)&&!Object.is(this.props.IsSamePageWithIndex,undefined)&&this.props.IsSamePageWithIndex) {
                    this.props.loginCallback();
                }
                let newState = Object.assign(this.state);
                newState.info = res;
                if (!newState.info.HeadImage) {
                    newState.info.HeadImage = require("assets/img/default_head.png");
                }
                this.setState(newState);
            }).catch(() => {
                ajaxLoaded();
            })
        //}
    }

    updateUserHeadImg(url) {
        workerService.updateUserAvatar(url).then((msg) => {
            if (!msg && msg !== null) {
                showMessage(msg);
            }
            let newState = Object.assign(this.state);
            newState.info.HeadImage = appConfig.contentSourceUrl + url.replace("Original", "p160");
            this.setState(newState);
        });
    }

    onupload() {
        let newState = Object.assign(this.state);
        newState.info.HeadImage = require("assets/img/uploading.gif");
        this.setState(newState);
    }

    render() {
        return (
            <div className="layer">
                <Header showBackButton={false}>账户中心</Header>
                <section className="centerper_top">
                    <div className="centerper_top_con">
                        <span href="#" className="default_head">
                            {authService.isLogin() ? <UploaderBtn uploadtype="avatar" onupload={()=>{this.onupload()}}
                                                                  callback={(img) => this.updateUserHeadImg(img) }></UploaderBtn> : ""}
                            <i style={{ backgroundImage: `url(${this.state.info.HeadImage})` }}></i>
                        </span>
                        <Link to="/mine"
                              className="phone_name"><span>{this.state.info.Name} </span></Link>
                        <Link to="/mine" className="user_management"><span>账号管理</span></Link>
                    </div>
                </section>
                <section className="centerper_mes box-line-b mb">
                    <ul className="clearFix">
                        <li>
                            <a onClick={() => {
                                this.context.router.push({
                                    pathname: "/mine/orderlist",
                                    state: { activeTabIndex: 1 }
                                });
                            } }>
                                <span><img src={require("assets/img/c_payment.png") }/>
                                    {this.state.info.WiatPayCount > 0 ?
                                        <i className="mes_mun">{this.state.info.WiatPayCount}</i> : ""}
                                </span>
                                <p>待支付</p>
                            </a>
                        </li>
                        <li>
                            <a onClick={() => {
                                this.context.router.push({
                                    pathname: "/mine/orderlist",
                                    state: { activeTabIndex: 2 }
                                });
                            } }>
                                <span><img src={require("assets/img/c_forgoods.png") }/>
                                    {this.state.info.SentCount > 0 ?
                                        <i className="mes_mun">{this.state.info.SentCount}</i> : ""}
                                </span>
                                <p>待收货</p>
                            </a>
                        </li>
                        <li>
                            <a onClick={() => {
                                this.context.router.push({
                                    pathname: "/mine/orderlist",
                                    state: { activeTabIndex: 4 }
                                });
                            } }>
                                <span><img src={require("assets/img/c_evaluate.png") }/>
                                    {this.state.info.WatiCommentCount > 0 ?
                                        <i className="mes_mun">{this.state.info.WatiCommentCount}</i> : ""}
                                </span>
                                <p>待评论</p>
                            </a>
                        </li>
                        <li>
                            <a onClick={() => {
                                this.context.router.push({
                                    pathname: "/mine/orderlist",
                                    state: { activeTabIndex: 0 }
                                });
                            } }>
                                <span><img src={require("assets/img/c_order.png") }/></span>
                                <p>我的订单</p>
                            </a>
                        </li>
                    </ul>
                </section>

                <section className="centerper_list">
                    <div className="centerper_item">
                        <div className="box-line-t box-line-b">
                            <Link to="/mine/coupon" className="c_list clearFix">
                                <div className="c_list_left c_icon c_icon_coupons"><span>我的优惠券</span></div>
                                <div className="c_list_right"><span className="colorGrey c_arrow_r"></span></div>
                            </Link>
                        </div>
                        <div className="box-line-b">
                            <Link to="/mine/favorite" className="c_list clearFix">
                                <div className="c_list_left c_icon c_icon_collection"><span>我的收藏</span></div>
                                <div className="c_list_right"><span className="colorGrey c_arrow_r"></span></div>
                            </Link>
                        </div>
                        <div className="box-line-b">
                            <Link to="/mine/welfare/1" className="c_list clearFix">
                                <div className="c_list_left c_icon c_icon_welfare"><span>我的福利</span></div>
                                <div className="c_list_right"><span className="colorGrey c_arrow_r"></span></div>
                            </Link>
                        </div>
                    </div>
                    <div className="centerper_item">
                        <div className="box-line-t box-line-b">
                            <Link to="/mine/receiveaddress" className="c_list clearFix">
                                <div className="c_list_left c_icon c_icon_address"><span>收货地址管理</span></div>
                                <div className="c_list_right"><span className="colorGrey c_arrow_r"></span></div>
                            </Link>
                        </div>
                        <div className="box-line-b">
                            <Link to="/mine/rechargeList" className="c_list clearFix">
                                <div className="c_list_left c_icon c_icon_realname"><span>我的充值</span></div>
                                <div className="c_list_right"><span className="colorGrey c_arrow_r"></span></div>
                            </Link>
                        </div>
                        <div className="box-line-b">
                            <Link to="/mine/consumList" className="c_list clearFix">
                                <div className="c_list_left c_icon c_icon_realname"><span>我的消费记录</span></div>
                                <div className="c_list_right"><span className="colorGrey c_arrow_r"></span></div>
                            </Link>
                        </div>
                    </div>
                    <div className="centerper_item">
                        <div className="box-line-b box-line-t">
                            <Link to="/mine/reservationRecordsList" className="c_list clearFix">
                                <div className="c_list_left c_icon c_icon_realname"><span>预约记录</span></div>
                                <div className="c_list_right"><span className="colorGrey c_arrow_r"></span></div>
                            </Link>
                        </div>
                        <div className="box-line-b">
                            <Link to="/helperList" className="c_list clearFix">
                                <div className="c_list_left c_icon c_icon_shopguide"><span>购物指南</span></div>
                                <div className="c_list_right"><span className="colorGrey c_arrow_r"></span></div>
                            </Link>
                        </div>
                        <div className="box-line-b">
                            <Link to="/setting" className="c_list clearFix">
                                <div className="c_list_left c_icon c_icon_set"><span>更多</span></div>
                                <div className="c_list_right"><span className="colorGrey c_arrow_r"></span></div>
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}