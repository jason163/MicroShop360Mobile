import productService from "service/product.service.jsx";
import Countdown from "components/countdown.jsx"
import PageList from "components/page-list-view3.jsx";
import OrderService from "service/order.service.jsx";
import authService from "service/auth.service.jsx";
import keys from "config/keys.config.json";
import * as Cache from "utility/storage.jsx";
import Rate from 'antd/lib/rate'
import Loading from "components/loading.jsx"
require("assets/css/star.css");
import {BannerSlider} from "bm/home-banner.jsx";

export class ProNum extends React.Component {

    constructor(props) {
        super(props);
        this.timer = null;
        this.state = {
            valContent: this.props.minNum
            , maxNum: this.props.maxNum
        }
    }

    static get propTypes() {
        return {
            minNum: React.PropTypes.number,
            increaseCount: React.PropTypes.number,
            maxNum: React.PropTypes.number,
            callBackBuyCount: React.PropTypes.func
        }
    }

    static get defaultProps() {
        return {
            minNum: 1
            , increaseCount: 1
            , maxNum: -1
        }
    }
    componentWillUnmount() {
        this.clearTimer();
    }

    componentWillReceiveProps(nextProps)
    {
        this.setState({valContent:nextProps.minNum,maxNum:nextProps.maxNum});
    }

    clearTimer() {
        if (this.timer) {
            clearTimeout(this.timer);
        }
    }


    changeValue(evt, type) {
        evt.stopPropagation();
        let oldValue = this.state.valContent;
        let newValue = oldValue;
        if (type === -1 && this.props.minNum <= oldValue - this.props.increaseCount) {
            newValue = oldValue - this.props.increaseCount;

        }
        if (type === 1 && this.props.maxNum >= this.props.increaseCount + oldValue) {
            newValue = oldValue + this.props.increaseCount;
        }

        /*显示提示语*/
        if (this.props.maxNum < this.props.increaseCount + oldValue && type === 1
            || this.props.minNum > oldValue - this.props.increaseCount && type === -1) {
            this.clearTimer();
            if (type === -1) {
                this.refs.tips.textContent = "超过最小购买数";
            }
            if (type === 1) {
                this.refs.tips.textContent = "超过最大购买数";
            }
            this.refs.tips.style.display = "";
            this.timer = setTimeout(() => {
                this.refs.tips.style.display = "none";
            }, 1000);
        }

        if (this.props.maxNum > 0 && this.props.maxNum <= newValue) {
            newValue = this.state.maxNum;
        }

        this.setState({ valContent: newValue });
        /*call parent buycount*/
        this.props.callBackBuyCount(newValue);
    }

    render() {
        return (
            <div className="clearFix">
                <p className="num fl">
                    <a onClick={(evt) => {
                        this.changeValue(evt, -1);
                    } }>-</a>
                    <span className="input_wrap">
                        <input readOnly="true" ref="buyCount" type="text" value={this.state.valContent}/>
                    </span>
                    <a onClick={(evt) => {
                        this.changeValue(evt, 1);
                    } }>+</a>
                </p>
                <span className="num_tips fl" ref="tips" style={{ display: 'none' }}>超过最小最大购买数</span>
            </div>

        )
    }

}

class ProDetailHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ShoppingCartProductCount: OrderService.getShoppingCartProductCount()
        }
    }

    static get contextTypes() {
        return {
            router: React.PropTypes.object.isRequired
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ ShoppingCartProductCount: nextProps.ShoppingCartProductCount });
    }

    render() {
        let cartCounter = "";
        if (!Object.is(this.state.ShoppingCartProductCount, null) && !Object.is(this.state.ShoppingCartProductCount, undefined) && !Object.is(this.state.ShoppingCartProductCount, "")) {
            cartCounter = <i>{this.state.ShoppingCartProductCount}</i>;
        }
        return (
            <section id="details_header">
            <div className="header clearFix">
            <a className="return_graybg fl" onClick={() => {
            this.context.router.goBack();
        } }></a>
        <a className="cart_graybg ml10 fr" onClick={() => {
            this.context.router.push("/shoppingcart");
        }}>
        {cartCounter}
    </a>
        <a className="home_graybg fr" onClick={() => {
            Cache.setSessionCache(keys.tabPageActive, 0);
            this.context.router.push("/");
        }}></a>
    </div>
    </section>
        );
    }
}

/*商品详细页促销组件*/
class ProDetailPromotion extends React.Component {
    static get propTypes() {
        return {
            data: React.PropTypes.object
        };
    }

    buildCouponTips() {
        let tips = '';
        if (this.props.data.showCoupon) {
            tips =
                <div className="d_item box-line-b">
                    <span className="labelact">优惠券</span>
                    <span className="colorRed">先领券.后购物.买更省</span>
                </div>
        }
        return tips;
    }

    render() {
        return (
                <div className="d_item box-line-b">
                    <span className="labelact">限时抢购</span>
                    <span>将于<Countdown leftSeconds={this.props.data.CDTime} showIcon={false}></Countdown>后结束</span>
                </div>
        );
    }
}

/*商品详细页名称*/
class ProDetailTitle extends React.Component {


    static get propTypes() {
        return {
            data: React.PropTypes.object
        };
    }

    render() {
        return (
            <section id="proTitle" className="details_con box-line-t mb5">
                <div className="d_item text box-line-b">
                    <p className="name">
                        {/*<span className="labelred">{this.props.data.TradeType}</span>*/}
                        {this.props.data.ProductName}
                    </p>
                    <p className="sales_word"></p>
                    <p className="price">
                        <span className="mr5"><em>{this.props.data.CurrentPrice}</em></span>
                        <del>￥{this.props.data.MarketPrice}</del>
                    </p>
                </div>
                { this.props.data.IsCDProduct === 1 && <ProDetailPromotion data={this.props.data}></ProDetailPromotion>}
            </section>
        );
    }
}

/*商品详细页商品属性列表*/
export class PropertyCell extends React.Component {

    constructor(props) {
        super(props);
        this.isSelected = 0;
    }

    static get propTypes() {
        return {
            data: React.PropTypes.object
            , type: React.PropTypes.number
            , current: React.PropTypes.object
            , callBackClickProperty: React.PropTypes.func
        }
    }

    static get contextTypes() {
        return {
            router: React.PropTypes.object
        }
    }

    componentWillUpdate() {
        this.isSelected = 0;
    }

    /*处理属性选择*/
    sltPropertyHandler(evt) {
        evt.preventDefault();
        if (this.isSelected !== 1) {
            this.props.callBackClickProperty(this.props.data.ProductSysNo);

        }
    }

    render() {
        let propertyValue = '';
        let contentStyle = "guige";
        if (this.props.type === 1) {
            propertyValue = this.props.data.ParentValue;
            if (this.props.current.ParentValueSysNo === this.props.data.ParentValueSysNo) {
                contentStyle = "guige on";
                this.isSelected = 1;
            }
        } else if (this.props.type === 2) {
            propertyValue = this.props.data.Value;
            if (this.props.current.ValueSysNo === this.props.data.ValueSysNo) {
                contentStyle = "guige on";
                this.isSelected = 1;
            }
        }
        return (
            <span onClick={(e) => {
                this.sltPropertyHandler(e);
            } } className={contentStyle}>{propertyValue}</span>
        )
    }
}

export class PropertyGroupCell extends React.Component {

    static get propTypes() {
        return {
            data: React.PropTypes.object
            , callBackClickProperty: React.PropTypes.func
        }
    }

    static get defaultProps() {
        return {
            data: []
        }
    }

    getPropertyName(item) {
        let propertyName = '';
        if (item.Type === 1) {
            propertyName = item.Current.ParentPropertyName;
        } else if (item.Type === 2) {
            propertyName = item.Current.PropertyName;
        }
        return propertyName;
    }

    render() {
        return (
            <div className="d_item d_item_guige box-line-b">
                <span className="colorGrey">{this.getPropertyName(this.props.data) }</span>
                {this.props.data.ProductList.map((item, index) => {
                    return React.createElement(PropertyCell, {
                        data: item,
                        type: this.props.data.Type,
                        current: this.props.data.Current,
                        key: index,
                        callBackClickProperty: this.props.callBackClickProperty
                    })
                }) }
            </div>
        )
    }

}

class ProPropertyGroupPanel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data
            , basic: this.props.basic
            , isExpander: true
            , buyCount: this.props.basic.IncreaseCount
        }
    }

    static get propTypes() {
        return {
            data: React.PropTypes.array,
            basic: React.PropTypes.object,
            callBackBuyCount: React.PropTypes.func,
            callBackClickProperty: React.PropTypes.func
        }
    }

    static get defaultProps() {
        return {
            data: []
            , basic: {}
        }
    }

    getBuyCount(count) {
        /*call parent getBuyCount*/
        this.props.callBackBuyCount(count);
        /*let newState = Object.assign({},this.state);
         newState.buyCount = count;
         this.setState(newState);*/
    }

    componentWillReceiveProps(nextProps) {
        this.setState(Object.assign({}, this.state, { data: nextProps.data, basic: nextProps.basic }))
    }

    render() {
        return (
            <section className="details_con box-line-t mb5 details_conguige">
                <div onClick={() => {
                    this.setState({ isExpander: !this.state.isExpander })
                } }>
                    <i className={`d_arrow ${this.state.isExpander ? "on" : ""}`}></i>
                    <div className="d_item box-line-b"><span
                        className="colorGrey">{`已选: ${this.props.basic.ProductName}`}</span></div>
                </div>
                <div style={{ display: this.state.isExpander ? "" : "none" }}>
                    {this.props.data !== null && this.props.data.map((item, index) => {
                        return React.createElement(PropertyGroupCell, { data: item, key: index, callBackClickProperty: this.props.callBackClickProperty })
                    }) }
                    <div className="d_item d_item_num box-line-b">
                        <span className="colorGrey fl">数量：</span>
                        <ProNum minNum={this.props.basic.MinPerOrder} maxNum={this.props.basic.MaxPerOrder}
                            callBackBuyCount={(count) => { this.getBuyCount(count) } }
                            increaseCount={this.props.basic.IncreaseCount}></ProNum>
                    </div>
                </div>
            </section>
        )
    }
}

/*商品详细页商品属性列表*/

/*商品详细页商品底部工具栏*/
class ProDetailFooter extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            isFavorite: this.props.productInfo.IsFavorite,
            q4s: this.props.productInfo.Q4S,
            proStatus: this.props.productInfo.ProductStatus,
            CDSoldOut:this.props.productInfo.CDSoldOut
        }
    }

    static get propTypes() {
        return {
            ProductSysNo: React.PropTypes.number,
            AddToShoppingCartCallBack: React.PropTypes.func,
            BuyNowCallBack: React.PropTypes.func,
            isFavorite: React.PropTypes.number,
            productInfo: React.PropTypes.object
        }
    }

    static get contextTypes() {
        return {
            router: React.PropTypes.object
        }
    }

    componentWillReceiveProps(nextProps){
        this.setState({isFavorite:nextProps.isFavorite,q4s:nextProps.productInfo.Q4S,
            proStatus:nextProps.productInfo.ProductStatus
        ,CDSoldOut:nextProps.productInfo.CDSoldOut});
    }

    FavoriteProduct(productSysNo) {
        if (this.state.isFavorite === 1) {
            return;
        }

        productService.favoriteProduct(productSysNo).then((res) => {
            if (res) {
                /*true*/
                this.setState({ isFavorite: 1 });
            }
        })
    }

    render() {
        let favoritContent;
        let shoppingCartPlaceTxt="加入购物车";
        let directBuy = "立即购买";
        if (this.state.isFavorite === 1) {
            favoritContent = "已收藏";
        }
        if (this.state.isFavorite !== 1) {
            favoritContent = "收藏";
        }

        if(this.state.CDSoldOut === 1){
            shoppingCartPlaceTxt="已抢光";
            directBuy="下次再来";
        }
        return (
            <section className="pro_fixedBottom">
                <ul>
                    <li onClick={() => {
                        if (!authService.isLogin()) {
                            this.context.router.push({pathname:"/login",state:{target:`/product/${this.props.ProductSysNo}`}});
                            return;
                        }
                        this.FavoriteProduct(this.props.ProductSysNo)

                    } } className="li1"><a>{favoritContent}</a></li>
                    <li className={`li2 ${this.state.q4s > 0 && this.state.proStatus === 10 && this.state.CDSoldOut === 0 ? "" : "graybg"}`} onClick={() => {
                        if (this.state.q4s > 0 && this.state.proStatus === 10&& this.state.CDSoldOut === 0) {
                            this.props.AddToShoppingCartCallBack();
                        }

                    } }><a>{shoppingCartPlaceTxt}</a></li>
                    <li className={`li3 ${this.state.q4s > 0 && this.state.proStatus === 10 && this.state.CDSoldOut === 0 ? "" : "graybgs"}`} onClick={() => {
                        if (this.state.q4s > 0 && this.state.proStatus === 10&& this.state.CDSoldOut === 0) {
                            this.props.BuyNowCallBack();
                        }
                    } }><a>{directBuy}</a></li>
                </ul>
            </section>
        );
    }
}

/*商品详细页商品详情、商品评介、推荐商品*/
class ProTabLayout extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentIndex: 0
        }
    }

    static get propTypes() {
        return {
            children: React.PropTypes.any
            , tabs: React.PropTypes.array
            , sectionStyle: React.PropTypes.string
            , titleStyle: React.PropTypes.string
        }
    }

    render() {
        return (
            <section className={this.props.sectionStyle}>
                <div id="tabTitle" className={this.props.titleStyle}>
                    <ul>
                        {this.props.tabs.map((item, index) => {
                            return <li key={index} onClick={() => {
                                this.setState({ currentIndex: index });
                            } } className={this.state.currentIndex === index ? "on" : ""}>
                                <span>{item.Title}</span>
                            </li>
                        }) }
                    </ul>
                </div>

                {this.props.children.map((item, index) => {
                    return (
                        React.cloneElement(item, {
                            key: index
                            , show: index === this.state.currentIndex
                        })
                    )
                }) }
            </section>
        )
    }
}

class ProTabContent extends React.Component {
    static get propTypes() {
        return {
            children: React.PropTypes.any
            , show: React.PropTypes.bool
        };
    }

    render() {

        return (
            <div style={{ 'display': this.props.show ? '' : 'none' }}>
                {this.props.children}
            </div>
        );
    }
}

/*商品评论组件*/
export class ProCommentItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data
        }
    }

    static get propTypes() {
        return {
            data: React.PropTypes.object
        }
    }

    componentWillReceiveProps(nextProps) {
        let newState = Object.assign({}, this.state);
        newState.data = nextProps.data;
        this.setState(newState);
    }

    changeUseful(num) {
        let cacheKey = `${keys.CommentUserful}_${this.state.data.SysNo}`;
        let isClick = Cache.getCache(cacheKey);
        if (isClick !== null) {
            let msg="您已点赞";
            if(isClick ===`USEFUL_1_${this.state.data.SysNo}`){
                msg = "您已点赞";
            }
            if(isClick === `UNUSEFUL_-1_${this.state.data.SysNo}`){
                msg = "您踩过啦";
            }
            showMessage(msg);
            return;
        }

        let newState = Object.assign({}, this.state);
        let oldUserful = newState.data.Useful;
        let oldUnUserful = newState.data.UnUseful;
        if (num === 1) {
            productService.updateProductUserful(this.state.data.SysNo).then((res) => {
                if (res===true) {
                    Cache.setCache(cacheKey, `USEFUL_1_${this.state.data.SysNo}`);
                    newState.data.Useful = oldUserful + 1;
                    this.setState(newState);
                }else{
                    showMessage(res);
                }
            })
        }
        if (num === -1) {
            productService.updateProductUnUserful(this.state.data.SysNo).then((res) => {
                if (res===true) {
                    Cache.setCache(cacheKey, `USEFUL_-1_${this.state.data.SysNo}`);
                    newState.data.UnUseful = oldUnUserful + 1;
                    this.setState(newState);
                }else{
                    showMessage(res);
                }
            })
        }
    }

    render() {
        return (
            <li>
                <div className="eval_item">
                    <div className="eval_user clearFix">
                        <a className="user_head"><img src={this.state.data.HeadImage}/></a>
                        <p><span>{this.state.data.DisplayName}</span>
                            <time>{this.state.data.InDateStr}</time>
                        </p>
                    </div>
                    <div className="eval_score"> 评分：
                        <span className={`star star${parseInt(this.state.data.Rate*10,10)}`}><i><em></em></i></span>
                        <span className="colorGrey ml5">{`${this.state.data.Rate}分`}</span>
                    </div>
                    <div className="eval_text">
                        <p>{`评价：${this.state.data.Comment}`}</p>
                        <ul className="clearFix mt5">
                            {this.state.data.PicList.map((item, index) => {
                                return <li key={index}><a className="img"
                                    style={{ backgroundImage: `url(${item})` }}></a></li>
                            }) }
                        </ul>
                    </div>
                    <div className="eval_opare clearFix">
                        <a onClick={() => {
                            this.changeUseful(1);
                        } } className="zan">{this.state.data.Useful}</a>
                        <a onClick={() => {
                            this.changeUseful(-1)
                        } } className="cai">{this.state.data.UnUseful}</a>
                    </div>
                </div>
            </li>
        )
    }
}

class ProCommentList extends React.Component {

    constructor(props) {
        super(props);
        this.tabs = ["全部", "好评", "差评", "有图"];
        let initPageData = [];
        this.tabs.map((index) => {
            initPageData.push({ init: false, data: [], totalRecordCount: 0 });
        });
        this.CommentStatistics=[];
        this.changeTab = false;
        this.state = {
            pageData: initPageData
            , productSysNo: this.props.productSysNo
            , condition: 0
            ,haveComment:0
        }
    }

    static get propTypes() {
        return {
            productSysNo: React.PropTypes.number
        }
    }

    componentWillMount(){
        // 只用调用一次
        productService.getProductCommnetStatistic(this.props.productSysNo).then(res=>{
            let commentStatistics=[];commentStatistics.push("");
            let totalCount=0;
            if(!Object.is(res,null)&&!Object.is(res,undefined))
            {
                commentStatistics.push(res.body.Data.GoodCommentsCount);
                commentStatistics.push(res.body.Data.NageCommentsCount);
                commentStatistics.push(res.body.Data.WithPicCount);
                totalCount = res.body.Data.GoodCommentsCount+res.body.Data.NageCommentsCount+res.body.Data.WithPicCount;
            }
            this.CommentStatistics = commentStatistics;
            let newState = Object.assign(this.state);
            if(totalCount> 0){
                newState.haveComment = 1;
            }
            this.setState(newState);
        });

      //  this.handleItemClick(0);
    }

    buildFilter() {
        return (
            <div className="eval_top">
                <ul className="clearFix">
                    {
                        this.tabs.map((item, index) => {
                            return <li key={index} onClick={() => {
                                this.handleItemClick(index)
                            } } className={this.state.condition === index ? "on" : ""}><p>{item}<span>{this.CommentStatistics[index]}</span></p></li>
                        })
                    }
                </ul>
            </div>
        )
    }

    buildNoComments(){
        return(
            <div className="not_eva">
                <i style={{backgroundImage:`url(${require('assets/img/not_eva.png')})`}}></i>
                <p>这个商品暂时还没有评价呢</p>
            </div>
        )
    }

    buildContent() {
        if (this.state.haveComment === 1) {
            return (
                <div className="evaluation">
                    {this.buildFilter() }
                    <div className="eval_con box-line-t box-line-b">
                        <PageList template={ProCommentItem} totalRecordCount={this.state.pageData[this.state.condition].totalRecordCount}
                            pageData={this.state.pageData[this.state.condition].data}
                            clearOldData={true}
                            onGetPageData={(pageIndex) => this.getPageData(pageIndex) }/>
                    </div>
                    <Loading ref="loading"/>
                </div>
            )
        }
        return (
            <div className="evaluation">
                {this.buildNoComments() }
            </div>
        )
    }

    componentWillReceiveProps(nextProps) {
        let newState = this.state;
        newState.productSysNo = nextProps.productSysNo;
        this.setState(newState);
    }

    /*handle tab click*/
    handleItemClick(tabIndex) {
        let newPageData = this.state.pageData;
        if (!newPageData[tabIndex].init) {
            productService.getProductCommentList(this.props.productSysNo, tabIndex, 0).then((res) => {
                this.tabs.map((item, index) => {
                    if (index === tabIndex) {
                        newPageData[index] = {
                            init: true,
                            data: res.data,
                            totalRecordCount: res.recordsTotal
                        }
                    }
                })
                let newState = Object.assign(this.state);
                newState.condition = tabIndex;
                this.changeTab = true;
                this.setState(newState);
            })
        }
        else {
            let newState = Object.assign(this.state);
            newState.condition = tabIndex;
            this.changeTab = true;
            this.setState(newState);
        }
    }

    getPageData(pageIndex) {
        if (this.props.productSysNo > 0) {
            if(this.refs.loading !== undefined){
                this.refs.loading.loading();
            }
            return productService.getProductCommentList(this.props.productSysNo, this.state.condition, pageIndex).then((res) => {
                if(this.refs.loading !== undefined){
                    this.refs.loading.loaded();
                }
               return res;
            });
        }
        return {data:[],recordsTotal:0}
    }

    render() {
        return this.buildContent()
    }
}
/*商品评论组件*/

/*
* 商品大图组件*/
 class ProBigPic extends React.Component{
    constructor(props){
        super(props);
    }
    static get propTypes(){
        return{
            banners:React.PropTypes.array
        }
    }

    buildContent(){
        return <div className="pro_bigPic" onClick={()=>{
            document.getElementsByClassName("pro_bigPic")[0].style.display='none';
        }}>
            <div className="slick-slider-box">
                <BannerSlider banners={this.props.banners}></BannerSlider>
            </div>
        </div>
    }

    render(){
        return this.buildContent();
    }
}

export {
ProDetailHeader, ProDetailTitle, ProDetailPromotion,
ProPropertyGroupPanel, ProDetailFooter, ProTabLayout, ProTabContent, ProCommentList,ProBigPic
}