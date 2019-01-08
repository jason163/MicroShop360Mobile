import PageTip from "bm/page-tip.jsx";
import {HomeBanner, BannerSlider} from "bm/home-banner.jsx";
import homeService from "service/home.service.jsx";
import {Link} from "react-router";
import authService from "service/auth.service.jsx";
import appConfig from "config/app.config.json";
import keyConfig from "config/keys.config.json";
import CountdownItem from "bm/countdown-item.jsx";
import RecommendProductListItem from "bm/recommendproduct-item.jsx";
import * as Cache from "utility/storage.jsx";
require("assets/css/index.css");

class HomeHeader extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            opacity: this.props.headeropacity
        }
    }

    static defaultProps = {
        headeropacity: 1
    }
    static propTypes = {
        headeropacity: React.PropTypes.number
    }

    static get contextTypes() {
        return {
            router: React.PropTypes.object
        }
    }

    searchKeyword() {
        let word = document.getElementById("searchWord").value;
        if (word !== "" && word.length > 0) {
            this.context.router.push({
                pathname: "/search",
                state: {
                    SearchArgs: {
                        keyword: word
                    }
                }
            })
        }
    }


    componentWillReceiveProps(nextProps) {
        this.setState({opacity: nextProps.headeropacity});
    }

    render() {
        return (
            <section id="main_header">
                <div className="layout">
                    <div className="logo"><a><img src={require("assets/img/logo.png")} alt="四季美微商城"/></a></div>
                    <div className="search">
                        <form onSubmit={()=>{
                            this.searchKeyword();
                        }}>
                            <p><input id="searchWord" style={{height:26}} type="search" placeholder="输入关键字" onKeyUp={(e)=>{
                                if(e.keyCode === 13){
                                    this.searchKeyword();
                                }
                            }}/></p>
                            
                        </form>

                    </div>
                    {!authService.isLogin() && <div className="login">
                        <a onClick={()=> {
                                    this.context.router.push({pathname:"/login",state: {target:"/"}
                                    });
                                }}>登录</a>
                        <a className="pre"></a></div>}
                </div>
                <i className="main_header_bg" style={{opacity:this.state.opacity}}></i>
            </section>
        )
    }
}

class HomeNavList extends React.Component{

    static get contextTypes() {
        return {
            router: React.PropTypes.object.isRequired
        }
    }

    render(){
        return(
            <section className="nav_fast box-line-b mb">
                <ul className="clearFix">
                    <li><a onClick={()=>{
                        this.context.router.push({pathname:"/infoList/1"});
                    }}><img src={require("assets/img/nav_icon1.png")}/>
                        <p>动&nbsp;&nbsp;态</p></a>
                    </li>
                    <li><a onClick={()=>{
                        this.context.router.push({pathname:"/infoList/2",state: {target:"/"}});
                    }}><img src={require("assets/img/nav_icon2.png")}/>
                        <p>养&nbsp;&nbsp;生</p></a>
                    </li>
                    <li><a onClick={()=>{
                        this.context.router.push({pathname:"/infoList/3",state: {target:"/"}});
                    }}><img src={require("assets/img/nav_icon3.png")}/>
                        <p>美&nbsp;&nbsp;容</p></a>
                    </li>
                    <li><a onClick={()=>{
                        this.context.router.push({pathname:"/infoList/4",state: {target:"/"}});
                    }}><img src={require("assets/img/nav_icon4.png")}/>
                        <p>促&nbsp;&nbsp;销</p></a>
                    </li>
                    <li><a onClick={()=>{
                        this.context.router.push({pathname:"/infoList/5",state: {target:"/"}});
                    }}><img src={require("assets/img/nav_icon5.png")}/>
                        <p>活&nbsp;&nbsp;动</p></a>
                    </li>
                    <li><a onClick={()=>{
                        this.context.router.push({pathname:"/infoList/6",state: {target:"/"}});
                    }}><img src={require("assets/img/nav_icon6.png")}/>
                        <p>私人定制 </p></a>
                    </li>
                </ul>
            </section>
        )
    }
}

class HomeCountdownList extends React.Component {

    static get propTypes() {
        return {
            CountdownList: React.PropTypes.array
        }
    }

    render() {
        return (
            <section className="flash_sale box-line-t2 mb">
                <div className="hd_withIcon box-line-b2">
                    <div className="layout clearFix">
                        <i></i>
                        <h3>掌上抢购</h3>
                        <Link to="/countdown">更多抢购</Link>
                    </div>
                </div>
                <div className="bd">
                    <ul className="clearFix">
                        {
                            this.props.CountdownList.map((item, index)=> {
                                return <CountdownItem key={index} data={item}></CountdownItem>
                            })
                        }
                    </ul>
                </div>
            </section>
        )
    }
}

class HomeRecommendProductList extends React.Component {

    static get propTypes() {
        return {
            RecommendProductList: React.PropTypes.array
        }
    }

    render() {
        return (
            <section className="flash_sale box-line-t2 mb">
                <div className="hd_withIcon box-line-b2">
                    <div className="layout clearFix">
                        <i className="tuijian"></i>
                        <h3>推荐项目</h3>
                        <Link to="/recommendproduct">更多</Link>
                    </div>
                </div>
                <div className="bd list_con">
                    <ul className="clearFix">
                        {
                            this.props.RecommendProductList.map((item, index)=> {
                                return <RecommendProductListItem key={index} data={item}></RecommendProductListItem>
                            })
                        }
                    </ul>
                </div>
            </section>
        )
    }
}

class HomeBannerContainer extends React.Component {

    static get propTypes() {
        return {
            contentStyle: React.PropTypes.string
            , titleInfo: React.PropTypes.object
            , children: React.PropTypes.any
        }
    }

    static get defaultProps() {
        return {
            contentStyle: ''
        }
    }

    static get contextTypes() {
        return {
            router: React.PropTypes.object
        }
    }

    render() {
        let ContentStyle = this.props.contentStyle;
        if (ContentStyle === '') {
            ContentStyle = "global_ad box-line-t2 box-line-b2 mb";
        }

        return (
            <section ref="homeBeader" className={ContentStyle}>
                {this.props.titleInfo !== undefined && <div className="hd_withline">
                    <div className="layout clearFix">
                        <h3>{this.props.titleInfo.title}</h3>
                        <a onClick={()=>{
                            this.context.router.push({
                                    pathname:this.props.titleInfo.linkRoute,
                                    state:{
                                        SearchArgs:{
                                            tr:this.props.titleInfo.tradeType
                                        }
                                    }
                                })
                        }}>{this.props.titleInfo.linkTitle}</a>
                    </div>
                </div>}
                {this.props.children}
            </section>
        )
    }
}

class HomeSingleBanner extends React.Component {

    static get propTypes() {
        return {
            //一开始，data是空的，如果要求isRequired,则会报错
            data: React.PropTypes.object
        }
    }

    render() {
        let bannerLinkUrl = Object.is(this.props.data, null) ? "" : this.props.data.BannerLinkUrl;
        let bannerSrcUrl = Object.is(this.props.data, null) ? "" : this.props.data.BannerSrcUrl;
        return (
            <div className="row">
                <div className="col col-e1">
                    <a href={bannerLinkUrl} className="a1" style={{backgroundImage:`url(${bannerSrcUrl})`}}></a>
                </div>
            </div>
        )
    }
}

class HomeMutipleBanner extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            data: []
        }
    }

    static get propTypes() {
        return {
            data: React.PropTypes.array.isRequired
        }
    }

    render() {

        return (
            <div className="row">
                {this.props.data.map((item, index)=> {
                    return (
                        <div className="col col-e2" key={index}>
                            <a href={item.BannerLinkUrl} className="a2"
                               style={{backgroundImage:`url(${item.BannerSrcUrl})`}}></a>
                        </div>)
                })
                }
            </div>
        )
    }
}

export default class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            homeData: {
                TopBanners: []
                , Top1ADs: {}
                , Top2ADs: []
                , CountdownList: []
                , RecommendProductList: []
                , MiddleADs: {}
                , ImportADs: []
                , InternalADs: []
            }
        };
    }

    componentWillMount() {
        let cacheValue = Cache.getCache(keyConfig.homePageCacheKey);
        if (cacheValue !== null) {
            this.setState({homeData: cacheValue})
        }
        homeService.getHomeData().then((result)=> {
            if (result.Success) {
                if (cacheValue === null) {
                    this.setState({homeData: result.Data});
                }
                Cache.setCache(keyConfig.homePageCacheKey, result.Data);
            }
            else {
                if (result.Code !== 401) {
                    showMessage(result.Message);
                }
            }
        });
    }

    scrollHandler() {
        let homeBannerbottom = document.getElementsByClassName("global_ad box-line-t2 box-line-b2 mb")[0];
        let margintop = homeBannerbottom.getBoundingClientRect().top;
        let headerBg = document.getElementsByClassName("main_header_bg")[0];
        if (margintop + 34 > 0) {
            headerBg.style.opacity = 1 - margintop / (homeBannerbottom.clientHeight - 34);
        }
        else
        {
            headerBg.style.opacity = 1;
        }
    }

    componentDidMount() {
        document.addEventListener("scroll", this.scrollHandler);
        document.addEventListener("touchmove", this.scrollHandler);
        //this.scrollHandler();
    }

    componentWillUnmount() {
        document.removeEventListener("scroll", this.scrollHandler);
        document.removeEventListener("touchmove", this.scrollHandler);
    }

    static get contextTypes() {
        return {
            router: React.PropTypes.object.isRequired
        };
    }

    buildPageContent() {
        if (this.state.homeData.TopBanners.length > 0) {
            let top1ads = this.state.homeData.Top1ADs;
            let top2ads = this.state.homeData.Top2ADs;
            let importTitle = {
                title: '货街'
                , linkTitle: '更多'
                , linkRoute: '/search'
                , tradeType: 1
            }
            let importLeft = {};
            let importRight = [];
            this.state.homeData.ImportADs.map((item, index)=> {
                if (index === 0) {
                    importLeft = item;
                } else {
                    importRight.push(item);
                }
            })

            let internalTitle = {
                title: '国货街'
                , linkTitle: '更多'
                , linkRoute: '/search'
                , tradeType: 0
            }
            let internalLeft = {};
            let internalRight = [];
            this.state.homeData.InternalADs.map((item, index)=> {
                if (index === 0) {
                    internalLeft = item;
                } else {
                    internalRight.push(item);
                }
            })
            return (
                <div ref="homeTab">
                    <div style={{paddingTop:'44px'}}></div>
                    <BannerSlider banners={this.state.homeData.TopBanners}></BannerSlider>

                    <HomeNavList></HomeNavList>

                    {top1ads !== null && top2ads.length > 0 && <HomeBannerContainer>
                        {top1ads !== null && <HomeSingleBanner data={top1ads}></HomeSingleBanner>}
                        {top2ads.length > 0 && <HomeMutipleBanner data={top2ads}></HomeMutipleBanner>}
                        <div className="row">
                            <div className="col col-e2"></div>
                            <div className="col col-e2"></div>
                        </div>
                    </HomeBannerContainer>}

                    {this.state.homeData.CountdownList !== null && this.state.homeData.CountdownList.length > 0 &&
                    <HomeCountdownList CountdownList={this.state.homeData.CountdownList}></HomeCountdownList>}

                    {this.state.homeData.MiddleADs !== null && <HomeBannerContainer>
                        <HomeSingleBanner data={this.state.homeData.MiddleADs}></HomeSingleBanner>
                    </HomeBannerContainer>}

                    {this.state.homeData.RecommendProductList!=null && this.state.homeData.RecommendProductList.length>0 &&
                    <HomeRecommendProductList RecommendProductList={this.state.homeData.RecommendProductList}></HomeRecommendProductList>}

                    {/*<HomeBannerContainer contentStyle="global_ad2 box-line-t2 box-line-b2 mb" titleInfo={internalTitle}>
                        <div className="bd box-line-t2 clearFix">
                            <div className="bd-l">
                                <a href={internalLeft.BannerLinkUrl} className="a1"
                                   style={{backgroundImage:`url(${internalLeft.BannerSrcUrl})`}}/>
                            </div>
                            <div className="bd-r">
                                {
                                    internalRight.map((item, index)=> {
                                        return <a href={item.BannerLinkUrl} key={index} className="a2"
                                                  style={{backgroundImage:`url(${item.BannerSrcUrl})`}}/>
                                    })
                                }
                            </div>
                        </div>
                    </HomeBannerContainer>*/}

                </div>
            )
        }

        return (
            <div className="layer">
                <p>Loading.....</p>
            </div>
        )
    }

    render() {
        return (
            <div>
                <HomeHeader></HomeHeader>
                {this.buildPageContent()}
            </div>
        );
    }
}