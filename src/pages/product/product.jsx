
import PageLayout from "components/page-layout.jsx";
import productService from "service/product.service.jsx";
import {BannerSlider} from "bm/home-banner.jsx";
import {ProDetailHeader,ProDetailTitle,
    ProPropertyGroupPanel,ProDetailFooter,ProTabLayout,
    ProTabContent,ProCommentList} from "bm/product-common.jsx"
import OrderService from "service/order.service.jsx";
import TipBox from "components/tipsbox.jsx";
import Loading from "components/loading.jsx";
import {getCache,setCache} from "utility/storage.jsx";
import wxShare from "utility/wx-share.jsx";
require("assets/css/base.css");
require("assets/css/product.css");

export default class ProductPage extends React.Component {

    constructor(props){
        super(props);
        this.buyCount=1;
        this.state={
            productData:{},
            buyCount:1,
            ShoppingCartProductCount:OrderService.getShoppingCartProductCount(),
            isAddProductOK:false,
            isShowBigPic:0
        };
    }

    static get propTypes(){
        return{
          params:React.PropTypes.object.isRequired
        };
    }

    static get contextTypes(){
        return{
            router:React.PropTypes.object.isRequired
        }
    }

    componentDidMount(){
        let sysno = this.props.params.id;
        this.buildDataByProductSysNo(sysno,0);
    }

    scrollEventHandler(){
        let toTopHeight = this.refs.showSecond.getBoundingClientRect().top;
        let desHeight = this.refs.proDesc.getBoundingClientRect().top;
        let titleHeight = document.getElementById("proTitle").getBoundingClientRect().top;

        let docHeight = document.documentElement.clientHeight;
        if(toTopHeight+70 < docHeight){
            this.refs.showSecond.style.display="none";
            this.refs.proDesc.style.display = "";
        }
        if(desHeight <= 10){
            document.getElementById("tabTitle").className="details_graphic_tit details_graphic_tit_fix";
        }else{
            document.getElementById("tabTitle").className="details_graphic_tit";
        }
        if(titleHeight <=10){
            document.getElementById("details_header").className ="details_header_fix";
        }else{
            document.getElementById("details_header").removeAttribute("class");
        }
    }

    bindScrollEvent(){
        let layOutContent = document.getElementsByClassName("layer")[0];
        if(layOutContent === undefined){
            return;
        }

        layOutContent.removeEventListener("scroll",()=>{
            this.scrollEventHandler();
        });
         layOutContent.addEventListener("scroll",()=>{
             this.scrollEventHandler();
         });
    }

    /*商品大图隐藏*/
    onProBigPicChanged(){
        this.setState({isShowBigPic:0})
    }

    getBuyCount(count){
        this.buyCount = count;
    }

    /*商品*/
    buildDataByProductSysNo(sysno,changePath){
        if(this.refs.loading !== undefined){
            this.refs.loading.loading();
        }

        productService.getProductDetail(sysno).then((rst)=>{
            if(rst.Success) {
                if(rst.Data.SysNo > 0){
                    this.setState({productData: rst.Data});

                    let summary = `欢迎抢购 -> ${rst.Data.ProductName} !`
                    let shareInfo = {feed_id:rst.Data.SysNo,title:rst.Data.ProductName,Desc:summary,img_share:rst.Data.DefaultImage,redirectUrl:location.href};
                    wxShare(shareInfo,function () {

                    })

                    this.bindScrollEvent();
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

    /*构建页面内容*/
    buildPageContent(){
        if(this.state.productData.ProductName === undefined || this.state.productData.SysNo === 0){
            return <Loading ref="loading"></Loading>
        }
        let basicInfo = {
            TradeType:this.state.productData.TradeType
            ,ProductName: this.state.productData.ProductName
            ,CDTitle: this.state.productData.CDTitle
            ,CurrentPrice:this.state.productData.CurrentPrice
            ,MarketPrice:this.state.productData.MarketPrice
            ,CDTime:this.state.productData.CDLeftSeconds
            ,IsCDProduct:this.state.productData.IsCDProduct
            ,showCoupon:true
            ,IncreaseCount:this.state.productData.IncreaseCount
            ,MinPerOrder:this.state.productData.MinQtyPerOrder
            ,MaxPerOrder:this.state.productData.MaxQtyPerOrder
        };
        this.buyCount = basicInfo.MinPerOrder;
        let imageList = [];
        if(this.state.productData.ImageList !== undefined && this.state.productData.ImageList !== null){
            this.state.productData.ImageList.map((item)=>{
                imageList.push({BannerSrcUrl:item});
            })
            /*本地存储商品图片路径*/
            setCache("bigPic",imageList);
        }
        let layoutStyle = {
            paddingTop:0,
            paddingBottom:`${50}px`
        }
        let footerInfo = {
            ProductSysNo:this.state.productData.SysNo,
            IsFavorite:this.state.productData.IsFavorite,
            Q4S:this.state.productData.Q4S,
            ProductStatus:this.state.productData.ProductStatus,
            CDSoldOut:this.state.productData.CDSoldOut
        }

        return(
            <div>
                <PageLayout style={layoutStyle}>
                    <ProDetailHeader ShoppingCartProductCount={this.state.ShoppingCartProductCount}></ProDetailHeader>

                    {imageList.length > 0 && <div className="slick-slider-box" onClick={()=>{
                        /*document.getElementsByClassName("pro_bigPic")[0].style.display='block';*/
                        this.context.router.push(`/bigPic/${this.props.params.id}`);
                    }}
                    ><BannerSlider banners={imageList} ></BannerSlider></div>}

                    <ProDetailTitle data={basicInfo}></ProDetailTitle>
                    <ProPropertyGroupPanel callBackBuyCount={(count)=>{this.getBuyCount(count)}}
                                           callBackClickProperty={(sysno)=>{this.buildDataByProductSysNo(sysno,1)}}
                                           basic={basicInfo} data={this.state.productData.PropertyValueList}></ProPropertyGroupPanel>

                    <div className="details_graphic_outer">
                        <ProTabLayout tabs={[{
                        Title:'商品详情'
                        },{
                        Title:'商品评价'
                        }]} sectionStyle="details_graphic" titleStyle="details_graphic_tit">
                            <ProTabContent>
                                <div dangerouslySetInnerHTML={{__html:this.state.productData.ProductDesc}} className="graphic_con"></div>
                            </ProTabContent>
                            <ProTabContent>
                                <ProCommentList productSysNo={this.state.productData.SysNo}></ProCommentList>
                            </ProTabContent>
                        </ProTabLayout>
                    </div>
                </PageLayout>
                <ProDetailFooter productInfo={footerInfo} ProductSysNo={this.state.productData.SysNo} isFavorite={this.state.productData.IsFavorite} AddToShoppingCartCallBack={()=>{
                    OrderService.addProductToLocalStorage(this.state.productData.SysNo,this.buyCount,this.state.productData.ProductName,this.state.productData.DefaultImage,this.state.productData.CurrentPrice);
                    this.setState(Object.assign({},this.state,{ShoppingCartProductCount:OrderService.getShoppingCartProductCount(),isAddProductOK:true}));
                }} BuyNowCallBack={()=>{
                    OrderService.buyNow(this.state.productData.SysNo,this.buyCount,this.state.productData.ProductName,this.state.productData.DefaultImage,this.state.productData.CurrentPrice);
                    this.context.router.push("/checkout")
                }}></ProDetailFooter>

                <TipBox show={this.state.isAddProductOK} content="宝贝添加成功"></TipBox>


            </div>
        )
    }

    render() {
        return this.buildPageContent();
    }
}