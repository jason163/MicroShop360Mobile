import PageLayout from "components/page-layout.jsx";
import OrderService from "service/order.service.jsx";
import ConfirmBox from "components/confirmbox.jsx"
import * as Cache from "utility/storage.jsx";
import keys from "config/keys.config.json";
import strings from "config/strings.config.json";
require("assets/css/shopping.css");
export default class ShoppingCart extends React.Component{
    constructor(props) {
        super(props);
        let shoppingCartProductList=Cache.getCache(keys.ShoppingCartCookie);
        let productList=[];
        if(!Object.is(shoppingCartProductList,null)&&!Object.is(shoppingCartProductList,undefined)) {
            shoppingCartProductList.map(product=>{
                let summatationPrice = product.CurrentPrice * product.Quantity;
                summatationPrice = summatationPrice.toFixed(2);
                if( summatationPrice === "NaN") {
                    summatationPrice= "0.00";
                }
                productList.push(Object.assign({},product,{SysNo:product.ProductSysNo,CartProCount:product.Quantity,SummatationPrice: summatationPrice,Properties:[]}))
            });
        }

        this.state= {
            ProductList: productList,
            OrderInfo: {},
            Message: "",
            ShowMessage:false,
            AllSelected:true,
            SelectedQty:0,
            IsFirstLoad:true,
            HasError:false,
            ShowConfirmBox:false,
            ConfirmMessage:""
        }
        this.GoingToDeleteProductSysNo=0;
    }

    static get propTypes() {
        return {
            IsSamePageWithIndex:React.PropTypes.bool,
            goBackCallback:React.PropTypes.func,
            refreshShoppingCartCount:React.PropTypes.func
        }
    }

    static get contextTypes() {
        return {
            router: React.PropTypes.object.isRequired
        };
    }

    componentDidMount() {
        let that = this;
        let shoppingCartProductList=Cache.getCache(keys.ShoppingCartCookie);
        if(!Object.is(shoppingCartProductList,null)&&!Object.is(shoppingCartProductList,undefined)) {
            let productList=[];
            shoppingCartProductList.map(product=>{
                productList.push(Object.assign(product,{Selected:true}));
            });
            Cache.setCache(keys.ShoppingCartCookie,productList);
            let request={AllProducts:productList,SelectedProducts:productList};
            that.reCalculate(request);
        }
        else
        {
            that.setState({ ProductList: [],
                OrderInfo: {},
                Message: "",
                ShowMessage:false,
                AllSelected:true,
                SelectedQty:0,
                IsFirstLoad:false,
                HasError:true,
                ShowConfirmBox:false,
                ConfirmMessage:""
            });
        }
    }

    //重新计算购物车
    reCalculate(request)
    {
        if(!this.state.IsFirstLoad) {
            ajaxLoading();
        }
        OrderService.loadShoppingCart({data:JSON.stringify(request)}).then(response=> {
            if(!Object.is(response.body.Data,null)) {
                let newState = Object.assign({}, this.state, response.body.Data, {Message: response.body.Message});
                if (!Object.is(newState.Message, null)&&!Object.is(newState.Message, "")) {
                    newState = Object.assign({}, newState, {ShowMessage: true});
                }
                let calProductList = [];
                let allSelected = true;
                let selectedQty = 0;
                let shoppingCartProductList=Cache.getCache(keys.ShoppingCartCookie);
                let productList=[];
                newState.ProductList.map(product=> {
                    let summatationPrice = product.CurrentPrice * product.CartProCount;
                    summatationPrice =summatationPrice==="NaN"? "0.00": summatationPrice.toFixed(2);
                    let newProduct = Object.assign({}, product, {SummatationPrice: summatationPrice});
                    calProductList.push(newProduct);
                    allSelected &= newProduct.Selected;
                    if (newProduct.Selected) {
                        selectedQty += 1;
                    }
                    let index = shoppingCartProductList.findIndex(pct=>{return pct.ProductSysNo===product.SysNo});
                    if(index>=0)
                    {
                        productList.push(shoppingCartProductList[index]);
                    }
                });
                //服务端返回的数据，重新保存一次购物车
                Cache.setCache(keys.ShoppingCartCookie,productList);
                if(!Object.is(this.props.IsSamePageWithIndex,null)&&!Object.is(this.props.IsSamePageWithIndex,undefined)&&this.props.IsSamePageWithIndex) {
                    this.props.refreshShoppingCartCount();
                }
                this.setState(Object.assign({}, newState, {
                    ProductList: calProductList,
                    AllSelected: allSelected,
                    SelectedQty: selectedQty,
                    IsFirstLoad:false,
                    HasError:!response.body.Success,
                    ShowConfirmBox:false,
                    ConfirmMessage:""
                }));
            }
            else {
                this.setState({ ProductList: [],
                    OrderInfo: {},
                    Message: "",
                    ShowMessage:false,
                    AllSelected:true,
                    SelectedQty:0,
                    IsFirstLoad:false,
                    HasError:true,
                    ShowConfirmBox:false,
                    ConfirmMessage:""
                });
            }
            if(!this.state.IsFirstLoad) {
                ajaxLoaded();
            }
        });
    }

    selectAllCheckBoxClick()
    {
        let newState=this.state;
        newState.AllSelected=!newState.AllSelected;
        let productList=[];
        newState.ProductList.map(product=>{
            productList.push(Object.assign({},product,{ProductSysNo:product.SysNo,Quantity:product.CartProCount,Selected:newState.AllSelected}));
        });
        Cache.setCache(keys.ShoppingCartCookie,productList);
        let request={AllProducts:productList,SelectedProducts:[]};
        if(newState.AllSelected)
        {
            request=Object.assign({},request,{SelectedProducts:productList});
        }
        this.reCalculate(request);
    }

    checkBoxClick(productSysNo)
    {
        let newState=this.state;
        let productList=[];
        newState.ProductList.map(product=>{
            if(product.SysNo===productSysNo)
            {
                productList.push(Object.assign({},product,{ProductSysNo: product.SysNo, Quantity: product.CartProCount,Selected:!product.Selected}));
            }
            else
            {
                productList.push(Object.assign({},product,{ProductSysNo: product.SysNo, Quantity: product.CartProCount,Selected:product.Selected}));
            }
        });
        Cache.setCache(keys.ShoppingCartCookie,productList);
        let selectedProductList = [];
        productList.map(product=> {
            if (product.Selected) {
                selectedProductList.push(product);
            }
        });
        let request = {AllProducts: productList, SelectedProducts: selectedProductList};
        this.reCalculate(request);
    }

    //修改商品数量，商品编号、增加数量还是减少数量
    modifyProductQuantity(productSysNo,isIncrease)
    {
        let newState=this.state;
        let productList=[];
        let exit=false;
        newState.ProductList.map(product=>{
            if(product.SysNo===productSysNo)
            {
                if(isIncrease) {
                    let proCountAfterIncrease=product.CartProCount + product.IncreaseCount;
                    if(proCountAfterIncrease<product.MinQtyPerOrder)
                    {
                        proCountAfterIncrease=product.MinQtyPerOrder;
                    }
                    if(product.CartProCount===product.MaxQtyPerOrder)
                    {
                        exit=true;
                        showMessage("已达到最大购买数");
                    }
                    if(proCountAfterIncrease>product.MaxQtyPerOrder)
                    {
                        proCountAfterIncrease=product.MaxQtyPerOrder;
                    }
                    productList.push(Object.assign({},product,{
                        ProductSysNo: product.SysNo,
                        Quantity: proCountAfterIncrease,
                        Selected:product.Selected
                    }));
                }
                else {
                    let proCountAfterDecrease=product.CartProCount - product.IncreaseCount;
                    if(proCountAfterDecrease>product.MaxQtyPerOrder)
                    {
                        proCountAfterDecrease=product.MaxQtyPerOrder;
                    }
                    if(product.CartProCount===product.MinQtyPerOrder)
                    {
                        exit=true;
                        showMessage("已达到最小购买数");
                    }
                    if(proCountAfterDecrease<product.MinQtyPerOrder)
                    {
                        proCountAfterDecrease=product.MinQtyPerOrder;
                    }
                    productList.push(Object.assign({},product,{
                        ProductSysNo: product.SysNo,
                        Quantity: proCountAfterDecrease,
                        Selected:product.Selected
                    }));
                }
            }
            else
            {
                 productList.push(Object.assign({},product,{ProductSysNo: product.SysNo, Quantity: product.CartProCount,Selected:product.Selected}));
            }
        });
        if(!exit) {
            Cache.setCache(keys.ShoppingCartCookie,productList);
            let selectedProductList = [];
            productList.map(product=> {
                if (product.Selected) {
                    selectedProductList.push(product);
                }
            });
            let request = {AllProducts: productList, SelectedProducts: selectedProductList};
            this.reCalculate(request);
        }
    }

    deleteProduct(productSysNo)
    {
        let newState=this.state;
        let productList=[];
        newState.ProductList.map(product=>{
            if(product.SysNo!==productSysNo)
            {
                productList.push(Object.assign({},product,{ProductSysNo: product.SysNo, Quantity: product.CartProCount,Selected:product.Selected}));
            }
        });
        Cache.setCache(keys.ShoppingCartCookie,productList);
        let selectedProductList = [];
        productList.map(product=> {
            if (product.Selected) {
                selectedProductList.push(product);
            }
        });
        let request = {AllProducts: productList, SelectedProducts: selectedProductList};
        this.reCalculate(request);
    }

    removeAllProduct() {
        let newState = this.state;
        let productList = [];
        newState.ProductList.map(product=> {
            if (!product.Selected) {
                productList.push(Object.assign({},product,{
                    ProductSysNo: product.SysNo,
                    Quantity: product.CartProCount,
                    Selected: product.Selected
                }));
            }
        });
        Cache.setCache(keys.ShoppingCartCookie, productList);
        let request = {AllProducts: productList, SelectedProducts: []};
        this.reCalculate(request);
    }

    showMesageBox() {
        let selectedProduct = OrderService.getSelectedProductsFromShoppingCart();
        if (selectedProduct.Products.length > 0) {
            this.setState({ShowConfirmBox:true,ConfirmMessage:strings.deleteSelectedProductConfirm});
        }
        else {
            showMessage("没有选中任何商品！");
        }
    }

    showMessageBox2(){
        this.setState({ShowConfirmBox:true,ConfirmMessage:strings.removeProductFromCartConfirm});
    }

    sortProductList(products) {
        return products.sort(function(a, b) {
            return b.AddDate - a.AddDate;
        });
    }

    render() {
        let that = this;
        let product_list=that.sortProductList(that.state.ProductList);
        let shoppingCartItem = product_list.map((product,index)=> {
            let checkBoxClass="check_item";
            if(product.Selected)
            {
                checkBoxClass+=" on";
            }
            let properties;
            if(!Object.is(product.Properties,null)) {
                properties= product.Properties.map(property=> {
                    return <span className="colorGrey">{`${property.PropertyKey}:${property.PropertyValue}  `}</span>;
                });
            }
            let orderInfo= that.state.OrderInfo;
            let activitCom = null;
            if(orderInfo!==null && typeof orderInfo.Items !== "undefined")
            {
                let soItem =null;
                for(let oi=0;oi<orderInfo.Items.length;oi++)
                {
                    soItem =orderInfo.Items[oi];
                    if(soItem.ProductSysNo === product.SysNo)
                    {
                        break;
                    }
                    soItem =null;
                }
                if(soItem!==null && soItem.ShoppingCartReductionMessage!==null && soItem.ShoppingCartReductionMessage!=="")
                {
                    activitCom= <div className="act_tips"><div className="act_p colorRed">{soItem.ShoppingCartReductionMessage}，<a onClick={()=>{
                            this.context.router.push({
                                pathname: "/search",
                                state: { SearchArgs: { keyword: "" } }
                            });
                    }}><span className="blue">去凑单</span> </a></div></div>;
                }
            }
            return <div className="box-line-t">
                {activitCom}
                <div className="cart_list_item box-line-b mb5" key={index}>
                <input type="checkbox" checked="checked" readOnly className={checkBoxClass} onClick={()=>{
                    that.checkBoxClick(product.SysNo);
                }}/>
                <a className="img" onClick={()=>{
                    this.context.router.push(`/product/${product.SysNo}`)
                }}><img src={product.DefaultImage} alt=""/></a>
                <div className="text">
                    <p className="name"><span onClick={()=>{
                    this.context.router.push(`/product/${product.SysNo}`)
                }}>{product.ProductName}</span></p>
                    <p className="guige">{properties}</p>
                    <p className="guige"><span className="colorGrey">单价：{typeof product.CurrentPrice === "undefined"?"0.00": product.CurrentPrice.toFixed(2)}</span></p>
                    <p className="price"><span>{product.SummatationPrice}</span></p>
                </div>
                <div className="cart_list_opera clearFix">
                    <a className="btn_del ml10" onClick={()=>{
                       this.GoingToDeleteProductSysNo =product.SysNo;
                       that.showMessageBox2();
                    }}></a>
                    <p className="num">
                        <a onClick={()=>{
                            that.modifyProductQuantity(product.SysNo,false);
                        }}>-</a><span className="input_wrap"><input type="text" value={product.CartProCount}/></span><a onClick={()=>{
                            that.modifyProductQuantity(product.SysNo,true);
                        }}>+</a>
                    </p>
                </div>
            </div>
            </div>
        });

        let checkBoxAllClass="check_item";
        if(that.state.AllSelected)
        {
            checkBoxAllClass+=" on";
        }

        let cart_btnClass="cart_btn graybg";
        let deleteAllBtnClass="right_link hide";
        let cartFooterClass="cartFixfooter hide";
        let selectedProduct = OrderService.getSelectedProductsFromShoppingCart();
        if (!that.state.HasError&&selectedProduct.Products.length > 0) {
            cart_btnClass="cart_btn";
            deleteAllBtnClass="right_link";
        }
        if (this.state.ProductList.length > 0) {
            cartFooterClass="cartFixfooter";
            if(!Object.is(this.props.IsSamePageWithIndex,null)&&!Object.is(this.props.IsSamePageWithIndex,undefined)&&this.props.IsSamePageWithIndex) {
                cartFooterClass = "cartFixfooter cartFixbot";
            }
        }

        let goBack;
        let cart_listClass="cart_list mt10 mb10 pb50";
        if(!Object.is(this.props.IsSamePageWithIndex,null)&&!Object.is(this.props.IsSamePageWithIndex,undefined)&&this.props.IsSamePageWithIndex) {
            cart_listClass = "cart_list mt10 mb10 cart_listbot";
        }
        else
        {
            goBack = <a className="return" onClick={()=>{
                            that.context.router.goBack();
					    }}></a>;
        }
        let noProductTips;
        if(!that.state.IsFirstLoad&&that.state.ProductList.length===0) {
            noProductTips=<div className="not_tips">
                <i style={{backgroundImage:`url(${require("assets/img/notcart.png")})`}}/>
                <p>您的购物车中啥也没有呢!</p>
                <div className="not_btn"><a onClick={()=>{
                if(!Object.is(this.props.IsSamePageWithIndex,null)&&!Object.is(this.props.IsSamePageWithIndex,undefined)&&this.props.IsSamePageWithIndex) {
                        that.props.goBackCallback();
					}else {
					    Cache.setSessionCache(keys.tabPageActive, 0);
                        that.context.router.replace("/");
					}
                }}>返回首页</a></div>
            </div>;
        }

        let confirmbox_option;
        if(that.state.ConfirmMessage===strings.deleteSelectedProductConfirm) {
            confirmbox_option = {
                display: that.state.ShowConfirmBox,
                message: that.state.ConfirmMessage,
                onCancel: ()=> {
                    that.setState({ShowConfirmBox: false});
                },
                onConfirm: ()=> {
                    that.removeAllProduct();
                }
            }
        }
        else
        {
            confirmbox_option = {
                display: that.state.ShowConfirmBox,
                message: that.state.ConfirmMessage,
                onCancel: ()=> {
                    that.setState({ShowConfirmBox: false});
                },
                onConfirm: ()=> {
                    that.deleteProduct(this.GoingToDeleteProductSysNo);
                }
            }
        }

        let disAmt =0;
        if(that.state.OrderInfo!==null && typeof that.state.OrderInfo.ProductDiscountAmt !=="undefined" )
        {
            disAmt =that.state.OrderInfo.ProductDiscountAmt-that.state.OrderInfo.ProductCountDownDiscountAmt;
            if(disAmt==="NaN")
            {
                disAmt =0;
            }
        }

        let msgContainer=null;
        if(that.state.ShowMessage && that.state.Message!==null && that.state.Message!=="")
        {
            let msgEles =[];
            let ms =that.state.Message.split("\r\n");
            for(let mi =0;mi<ms.length;mi++)
            {
                let m= ms[mi]
                if(m.length===0) { continue; }
                if(mi>0)
                {
                    msgEles.push(<br />)
                }
                msgEles.push(m);
            }
            msgContainer=<p className="cart_error">{msgEles}</p>;
        }
        return <PageLayout>
            <section id="white_header">
                <div className="header">
                    {goBack}
                    <h3>购物车</h3>
                    <a className={deleteAllBtnClass} onClick={()=>{that.showMesageBox();}}>批量删除</a>
                </div>
            </section>
            <section className={cart_listClass}>
                {msgContainer}
                <div>
                    {shoppingCartItem}
                </div>
                {noProductTips}
            </section>
            <section className={cartFooterClass}>
                <label><input type="checkbox" checked="checked" readOnly className={checkBoxAllClass} onClick={()=>{
                    that.selectAllCheckBoxClick();
                }}/><span>全选</span></label>
                <p className="zj"><span>合计：<i
                    className="price">{that.state.OrderInfo===null||typeof that.state.OrderInfo.ProductOriginAmt==="undefined" ? "0.00":(that.state.OrderInfo.ProductOriginAmt-that.state.OrderInfo.ProductDiscountAmt).toFixed(2)}</i></span>
                    <span className="colorGrey">已优惠：-￥{disAmt.toFixed(2)}</span>
                </p>
                <a className={cart_btnClass} onClick={()=>{
                    if(!that.state.HasError&&selectedProduct.Products.length>0)
                    {
                        that.context.router.push("/checkout");
                    }
                }}>去结算<i>({OrderService.getSelectedProductsCount()})</i></a>
            </section>
            <ConfirmBox {...confirmbox_option}/>
        </PageLayout>
    }
}