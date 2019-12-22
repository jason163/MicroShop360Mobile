
import PageLayout from "components/page-layout.jsx";
import activityService from "service/activity.service.jsx";
import {BannerSlider} from "bm/home-banner.jsx";
import {ProDetailHeader,ProDetailTitle,
    ProPropertyGroupPanel,ProDetailFooter,ProTabLayout,
    ProTabContent,ProCommentList} from "bm/product-common.jsx"
import {ActDetailTitle} from "bm/activity-common.jsx"
import OrderService from "service/order.service.jsx";
import TipBox from "components/tipsbox.jsx";
import Loading from "components/loading.jsx";
import {getCache,setCache} from "utility/storage.jsx";
import wxShare from "utility/wx-share.jsx";
require("assets/css/base.css");
require("assets/css/product.css");

export default class activityPage extends React.Component{
    constructor(props){
        super(props);

        this.state={
            activityData:{}
        }
    }

    static get propTypes(){
        return{
            params:React.PropTypes.object.isRequired
        }
    }

    static get contextTypes(){
        return{
            router: React.PropTypes.object.isRequired
        }
    }

    componentDidMount(){
        let sysno = this.props.params.id;
        this.buildDataByActivitySysNo(sysno,0);
    }

    /*构建活动信息*/
    buildDataByActivitySysNo(sysno,changePath){
        if(this.refs.loading !== undefined){
            this.refs.loading.loading();
        }

        activityService.getActivityDetail(sysno).then((rst)=>{
            if(rst.Success) {
                if(rst.Data.SysNo > 0){
                    this.setState({activityData: rst.Data});
                    if(changePath === 1){
                        /*浏览历史不会新增记录*/
                        this.context.router.replace(`/product/${rst.Data.SysNo}`);
                    }
                }else{
                    this.context.router.replace("/*")
                }
            }
            else{
                if(rst.Code!==401) {
                    showMessage(rst.Message);
                }
            }
            if(this.refs.loading !== undefined){
                this.refs.loading.loaded();
            }

        });
    }
    /**
     *
     */
    buildPageContent(){
        if(this.state.activityData.ProductName === undefined || this.state.activityData.SysNo === 0){
            return <Loading ref="loading"></Loading>
        }
        let layoutStyle = {
            paddingTop:0,
            paddingBottom:`${50}px`
        }
        let imageList = [];
        if(this.state.activityData.ImageList !== undefined && this.state.activityData.ImageList !== null){
            this.state.activityData.ImageList.map((item)=>{
                imageList.push({BannerSrcUrl:item});
            })
            /*本地存储商品图片路径*/
            setCache("bigPic",imageList);
        }
        let basicInfo = {
            TradeType:this.state.activityData.TradeType
            ,ProductName: this.state.activityData.ProductName
            ,CDTitle: this.state.activityData.CDTitle
            ,CurrentPrice:this.state.activityData.CurrentPrice
            ,MarketPrice:this.state.activityData.MarketPrice
            ,CDTime:this.state.activityData.CDLeftSeconds
            ,IsCDProduct:this.state.activityData.IsCDProduct
            ,showCoupon:true
            ,IncreaseCount:this.state.activityData.IncreaseCount
            ,MinPerOrder:this.state.activityData.MinQtyPerOrder
            ,MaxPerOrder:this.state.activityData.MaxQtyPerOrder
        };

        let footerInfo = {
            ProductSysNo:this.state.activityData.SysNo,
            IsFavorite:this.state.activityData.IsFavorite,
            Q4S:this.state.activityData.Q4S,
            ProductStatus:this.state.activityData.ProductStatus,
            CDSoldOut:this.state.activityData.CDSoldOut
        }
        let topBanner ={
            BannerSrcUrl:this.state.activityData.DefaultImage,
            BannerLinkUrl:null
        }

        return (
            <div>

                <PageLayout style={layoutStyle}>
                    <BannerSlider banners={imageList} ></BannerSlider>
                    <ActDetailTitle data={basicInfo}></ActDetailTitle>

                    <div className="details_graphic_outer">
                        <ProTabLayout tabs={[{
                            Title:'活动详情'
                        },{
                            Title:'参与者'
                        }]} sectionStyle="details_graphic" titleStyle="details_graphic_tit">
                            <ProTabContent>
                                <div dangerouslySetInnerHTML={{__html:this.state.activityData.ProductDesc}} className="graphic_con"></div>
                            </ProTabContent>
                            <ProTabContent>

                            </ProTabContent>
                        </ProTabLayout>
                    </div>

                </PageLayout>

                <ProDetailFooter productInfo={footerInfo} ProductSysNo={this.state.activityData.SysNo} isFavorite={this.state.activityData.IsFavorite} BuyNowCallBack={()=>{
                    alert(1212)
                }}></ProDetailFooter>

                <TipBox show={this.state.isAddProductOK} content="宝贝添加成功"></TipBox>

            </div>
        )
    }

    render(){
        return this.buildPageContent();
    }

}