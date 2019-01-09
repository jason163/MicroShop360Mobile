
import PageLayout from "components/page-layout.jsx";
import orderService from "service/Order.service.jsx";
import {Header} from "components/header.jsx";
import RealNameAuth from "components/real-name-auth.jsx";
import {
    OrderCustomerAddress,OrderCustomerAddressList,OrderCustomerAuth,SubOrder
} from "bm/order-common.jsx";
import Loading from "components/loading.jsx";

require("assets/css/base.css");
require("assets/css/shopping.css");
export default class CheckoutPage extends React.Component {
    constructor(props){
        super(props);
        let createInfo=orderService.getSelectedProductsFromShoppingCart();//;
        const salerList=orderService.getSalerList().then((res) => {
            this.setState({
                SalerList: res
            })
        });
       // if(!Object.is(this.props.location.state,undefined) && !Object.is(this.props.location.state,null))
       // {
       //     createInfo=Object.assign(createInfo,this.props.location.state);
       //     //this.props.location.state = null;
       // }


        this.state= {
            OrderResult:null,
            OrderCreateInfo:createInfo,
            SalerList:salerList,
            SalerSysNo:0,
            SalerName:null,
            ReceiveAddressList:null,
            validMessage: {
                SalerSysNo: {
                    isValid: true,
                    validMessage: ''
                },
                CustomerPhone: {
                    isValid: true,
                    validMessage: ''
                }
            }
        };
        this.selectedCoupons=[];
        this.receiverAddressSysNo=0;
        this.customerMemo="";
        this.invoiceHeader="";
        this.IsBalancePay=0;
        this.SalerSysNo=0;
        this.SalerName="";
    }

    static get propTypes(){
        return{
            location:React.PropTypes.object
        }
    }
    static get defaultProps(){
        return {
            location:{state:null }
        }
    }
    handleChange(event){
            this.setState({inputText:event.target.value})
              }

    updateValue(e, propertyName) {
        let value = e.target.value.trim();
        let newState = Object.assign({}, this.state);
        newState.OrderCreateInfo[propertyName] = value;
        this.setState(newState);
    }

    removeHighLight(propertyName) {
        let newState = Object.assign({}, this.state);
        newState.validMessage[propertyName].isValid = true;
        newState.validMessage[propertyName].validMessage = '';
        this.setState(newState);
    }

    checkIsNullOrWhitespace(value) {
        return value === undefined || value === null || value.trim() === '';
    }
    checkSalerSysNo() {

        let newState = Object.assign({}, this.state);
        let isValid = true;
        if (!this.checkIsNullOrWhitespace(newState.OrderCreateInfo.SalerSysNo)) {
            let re = /^[1-9]\d*(\.\d+)?$/;
            if (!re.test(newState.OrderCreateInfo.SalerSysNo.trim())) {
                newState.validMessage.SalerSysNo.isValid = false;
                newState.validMessage.SalerSysNo.validMessage = '*销售员编号格式不正确';
                isValid = false;
            }
        }
        if (!isValid) {
            this.setState(this.state);
        }
        return isValid;
    }
    loadDataFromServer(owner){
        let _this = owner;
        let createInfo= _this.state.OrderCreateInfo;
        if(typeof createInfo === "undefined" || createInfo===null) {
            createInfo={};
            createInfo.CustomerReceiveAddressSysNo = _this.receiverAddressSysNo;
            createInfo.CouponUseInfoList = _this.selectedCoupons;
            createInfo.CustomerMemo=_this.customerMemo;
            createInfo.InvoiceHeader=_this.invoiceHeader;
            createInfo.IsBalancePay = _this.IsBalancePay;
            createInfo.salerSysNo=_this.salerSysNo;
        }
        if(typeof _this.refs.loading!=="undefined")
        {
            _this.refs.loading.loading();
        }
        orderService.buildCheckout(createInfo).then((rst)=>{
            if(typeof _this.refs.loading!=="undefined") {
                _this.refs.loading.loaded();
            }
            if(rst.Success) {
                _this.setState({
                    OrderResult: rst.Data.OrderInfo,
                    OrderCreateInfo:rst.Data.OrderCreateInfo,
                    ReceiveAddressList:rst.Data.ReceiveAddressList
                });
                _this.receiverAddressSysNo=rst.Data.OrderCreateInfo.CustomerReceiveAddressSysNo;
                _this.selectedCoupons=rst.Data.OrderCreateInfo.CouponUseInfoList;
                _this.customerMemo=rst.Data.OrderCreateInfo.CustomerMemo;
                _this.salerSysNo = rst.Data.OrderCreateInfo.SalerSysNo;
                _this.CustomerPhone = rst.Data.OrderCreateInfo.CustomerPhone;
                _this.invoiceHeader = rst.Data.OrderCreateInfo.InvoiceHeader;
                _this.IsBalancePay = rst.Data.OrderCreateInfo.IsBalancePay;
                if(_this.selectedCoupons===null){
                    _this.selectedCoupons=[];
                }
            }
            else{
                if(rst.Code!==401) {
                    showMessage(rst.Message);
                }
            }
        });
    }
    componentDidMount (){
        this.loadDataFromServer(this);
    }

    static get contextTypes() {
        return {
            router: React.PropTypes.object.isRequired
        };
    }
    updateReceiverInfo(owner) {
        let _this = owner;
        return (reveiverInfo)=> {
            let container = document.getElementById("receiverAddressContainer");
            container.style.display = "none";
            let state = Object.assign({}, _this.state);
            if (reveiverInfo !== 0) {
                _this.receiverAddressSysNo = reveiverInfo.SysNo;
                state.OrderResult.ReturnData.ReceiverInfo = {
                    CustomerAddressSysNo: reveiverInfo.SysNo,
                    ReceiveContact: reveiverInfo.ReceiveName,
                    ReceivePhone: reveiverInfo.ReceiveCellPhone,
                    ReceiveAddress: reveiverInfo.ReceiveAddress,
                    DistrictName: reveiverInfo.DistrictName
                };
                state.OrderCreateInfo.CustomerReceiveAddressSysNo=reveiverInfo.SysNo;

            } else if (reveiverInfo === 0) {
                _this.receiverAddressSysNo = 0;
                state.OrderResult.ReturnData.ReceiverInfo = {
                    CustomerAddressSysNo: 0,
                    ReceiveContact: '',
                    ReceivePhone: '',
                    ReceiveAddress: '',
                    DistrictName: ''
                }
                state.OrderCreateInfo.CustomerReceiveAddressSysNo=0;
            }
            if (state.ReceiveAddressList === null || state.ReceiveAddressList.length === 0) {
                state.ReceiveAddressList = [reveiverInfo];
            }
            _this.loadDataFromServer(_this);
            /*_this.setState(state);*/
        }
    }
    updateAuthInfo(owner){
            let _this =owner;
            return (authInfo)=>{
                let container = document.getElementById("authEditorContainer");
                container.style.display="none";
                let state = Object.assign({}, _this.state);
                state.OrderResult.ReturnData.AuthInfo={
                    RealName:authInfo.Name,
                    IDCardNumber:authInfo.IDCardNumber,
                    PhoneNumber:authInfo.PhoneNumber,
                    Address:authInfo.Address
                };
                _this.setState(state);
            }
    }
    setSelectedCoupons(owner){
        let _this =owner;
        return (couponNo,productNos)=> {
            let tCoupon = null;
            let couponIndex=-1;
            for (let i = 0; i < _this.selectedCoupons.length; i++) {
                let coupon = _this.selectedCoupons[i];
                for (let pi = 0; pi < coupon.ProductSysNoList.length; pi++) {
                    let pn = coupon.ProductSysNoList[pi];
                    for (let npi = 0; npi < productNos.length; npi++) {
                        if (pn === productNos[npi]) {
                            tCoupon = coupon;
                            break;
                        }
                    }
                    if (tCoupon !== null) {
                        break;
                    }
                }
                if (tCoupon !== null) {
                    couponIndex= i;
                    break;
                }
            }
            if (couponNo === null)
            {
                if(tCoupon!==null)
                {
                    _this.selectedCoupons.splice(couponIndex,1);
                }
            }
            else
            {
                if(tCoupon===null)
                {
                    _this.selectedCoupons.push({CouponNo:couponNo,ProductSysNoList:productNos});
                }
                else {
                    tCoupon.CouponNo=couponNo;
                    tCoupon.ProductSysNoList=productNos;
                }
            }
            let state = Object.assign({}, _this.state);
            state.OrderCreateInfo.CouponUseInfoList=_this.selectedCoupons;
            //_this.setState(state);
            _this.loadDataFromServer(_this);
        }
    }

    setUseBalancePay(owner){
        let _this =owner;
        let state = Object.assign({}, _this.state);
        state.OrderCreateInfo.IsBalancePay=_this.IsBalancePay;
        _this.loadDataFromServer(_this);
    }

    /*特定用户才显示*/
    showCstPhone(isSpecialCustomer){
        if(isSpecialCustomer==1){
            return <div className="box-line-b box-line-t mb5">
                <a className="checkout_item from_saler">
                    <p className="p_text">
                        <span className="right_tit">顾客手机号：</span>
                        <input className="checkout_text" type="text" placeholder="选填，帮助顾客下单的顾客手机号" maxLength="11"
                               value={this.state.OrderCreateInfo.CustomerPhone}
                               onChange={(e)=>{
                                   this.CustomerPhone=e.target.value;
                               }}
                               onKeyUp={(e)=>{ let n=e.target.value;
                                   if(n.length>11)
                                   {
                                       e.target.value=n.substr(0,11);
                                   } }}/>
                    </p>
                    <p className="colorRed fontsize12">{this.state.validMessage.CustomerPhone.validMessage}</p>
                </a>
            </div>;
        }else
        {
            return <div></div>
        }
    }

    create(isSubmit)
    {
        if(isSubmit!==true)
        {
            return;
        }
        let createInfo = this.state.OrderCreateInfo;
        createInfo.CustomerReceiveAddressSysNo= this.receiverAddressSysNo;
        createInfo.CouponUseInfoList=this.selectedCoupons;
        createInfo.CustomerMemo=this.customerMemo;
        createInfo.InvoiceHeader=this.invoiceHeader;
        createInfo.SalerSysNo = this.salerSysNo;
        createInfo.CustomerPhone = this.CustomerPhone;

        if(typeof this.refs.loading!=="undefined")
        {
            this.refs.loading.loading();
        }
        orderService.createOrder(createInfo).then((rst)=>{
            if(typeof this.refs.loading!=="undefined")
            {
                this.refs.loading.loaded();
            }
            //rst={
            //	Success:true,
            //	Message:"",
            //	Data:
            //	{
            //		OrderCreateInfo:{},
            //		OrderInfo:{}, // MS360.Web.SOPipeline.OrderPipelineProcessResult
            //      ReceiveAddressList:[]
            //	}
            //}
            if(rst.Success) {
                if(typeof rst.Data.OrderInfo ==="undefined" || rst.Data.OrderInfo===null || typeof rst.Data.OrderInfo.ReturnData ==="undefined" || rst.Data.OrderInfo.ReturnData===null)
                {
                    if(rst.Data.OrderInfo.ErrorMessages.length > 0){
                        showMessage(rst.Data.OrderInfo.ErrorMessages[0]);
                    }else {
                        showMessage("创建订单失败");
                    }
                }
                else
                {
                    if (rst.Data.OrderInfo.ErrorMessages !== null && rst.Data.OrderInfo.ErrorMessages.length > 0)
                    {
                        showMessage(rst.Data.OrderInfo.ErrorMessages[0]);
                    }
                    if(rst.Data.OrderInfo.HasSucceed===true)
                    {
                        if(rst.Data.OrderInfo.ReturnData.SubOrderList.length>1)
                        {
                            this.context.router.push({
                                pathname:"/mine/orderlist",
                                state:{activeTabIndex:1}
                            });
                        }
                        else
                        {
                            let orderInfo = rst.Data.OrderInfo.ReturnData.SubOrderList[0];
                            if(orderInfo.CashPayAbleAmount===0){
                                let pn=`/thankyou/${rst.Data.OrderInfo.ReturnData.SubOrderList[0].SysNo}`;
                                this.context.router.push({
                                    pathname:"/mine/orderlist",
                                    state:{activeTabIndex:0}
                                });
                            }else{
                                let pn=`/thankyou/${rst.Data.OrderInfo.ReturnData.SubOrderList[0].SysNo}`;
                                this.context.router.push({
                                    pathname: pn,
                                    state:{backStep:2}
                                });
                            }

                        }
                    }
                }
            }
            else{
                if(rst.Code!==401) {
                    showMessage(rst.Message);
                }
            }
        });
    }



    render() {
        if(this.state.OrderResult===null || this.state.OrderCreateInfo===null)
        {
            return <div className="loadingInner on">
                    <em>loading</em><i></i>
                </div>;
        }
        /*
         * 当前用户是否为特定用户*/
        let isSpecialCustomer = this.state.OrderCreateInfo.IsSpecialCustomer;
        let specialShowDiv = this.showCstPhone(isSpecialCustomer);
        debugger;

        let orderInfo = this.state.OrderResult.ReturnData;

        if ( this.state.OrderResult.HasSucceed === false ) {
            if (typeof orderInfo === "undefined" || orderInfo=== null){
                return <PageLayout>
                    <Header id="white_header">核对订单</Header>
                    <section className="checkout mt10">
                        <div className="not_tips">
                            <img src={require("assets/img/notcart.png")} style={{"width":100,"margin":"auto"}}/>
                                {
                                    this.state.OrderResult.ErrorMessages.map((m,index)=> {
                                        return <p key={index}>{m}</p>;
                                    })
                                }
                            <div className="not_btn"><a onClick={()=>{
                                this.context.router.push("/shoppingcart");
                            }}>返回购物车</a></div>
                        </div>
                    </section>
                </PageLayout>;
            }
        }

        if (typeof orderInfo === "undefined" || orderInfo=== null){
            return null;
        }
        if (this.state.OrderResult.ErrorMessages !== null && this.state.OrderResult.ErrorMessages.length > 0)
        {
            showMessage(this.state.OrderResult.ErrorMessages[0]);
            this.state.OrderResult.ErrorMessages.pop();
        }
        if (orderInfo.SubOrderList === null || orderInfo.SubOrderList.length === 0) {
            orderInfo.SubOrderList = [orderInfo];
        }

        /*let authEditorElement =null;
        let authInfoElement =null;
        if(typeof orderInfo.SubOrderList !== "undefined" && orderInfo.SubOrderList !== null)
        {
            for (let i = 0; i < orderInfo.SubOrderList.length; i++)
            {
                if(orderInfo.SubOrderList[i].TradeType>0)
                {
                    let option ={saveCallBack:this.updateAuthInfo(this)};
                    authInfoElement =<OrderCustomerAuth auth={orderInfo.AuthInfo}></OrderCustomerAuth>;
                    authEditorElement = <div id="authEditorContainer" className="layer1 pop-up" style={{display:"none","position":"fixed"}}>
                        <div className="up_header">
                            <div className="header">
                                <a className="return" onClick={()=>{
                                let container = document.getElementById("authEditorContainer");
                                container.style.display="none"; }}></a>
                                <h3>实名认证</h3>
                            </div>
                        </div>
                        <RealNameAuth options={option}></RealNameAuth>
                    </div>;
                    break;
                }
            }
        }*/

        let discountAmtCom=null;
        if(orderInfo.ProductDiscountAmt-orderInfo.ProductCountDownDiscountAmt>0)
        {
            discountAmtCom=<p>商品折扣：-￥{(orderInfo.ProductDiscountAmt-orderInfo.ProductCountDownDiscountAmt).toFixed(2)}</p>;
        }
        let couponAmtCom=null;
        if(orderInfo.CouponDiscountAmt>0)
        {
            couponAmtCom=<p>优惠券：-￥{orderInfo.CouponDiscountAmt.toFixed(2)}</p>;
        }
        let shipAmtCom=null;
        if(orderInfo.ShippingOriginAmt>0)
        {
            shipAmtCom=<p>运费：￥{orderInfo.ShippingOriginAmt.toFixed(2)}</p>;
        }
        let balanceAmtCom=null;
        if(orderInfo.BalancePayAmount > 0){
            balanceAmtCom=<p>余额支付：-￥{orderInfo.BalancePayAmount.toFixed(2)}</p>
        }
        let showAmount= orderInfo.SubOrderList.length > 1;

        let activitCom = null;
        if(showAmount===false && orderInfo.ShoppingCartReductionMessage!==null && orderInfo.ShoppingCartReductionMessage!=="")
        {
            activitCom=<p className="clearFix fontsize12" style={{textAlign:"left"}}><span className="colorRed fr">{orderInfo.ShoppingCartReductionMessage}，
				<a onClick={()=>{
                        this.context.router.push({
                            pathname: "/search",
                            state: { SearchArgs: { keyword: "" } }
                        });
				}}><span className="blue">去凑单</span> </a></span></p>;
        }

        let balanceCom=null;
        if(this.state.OrderCreateInfo.CustomerBalance > 0)
        {
            if(this.IsBalancePay==0){
                balanceCom=<i className="qx_coupon" onClick={(e)=>{
                    this.IsBalancePay = 1;
                    this.setUseBalancePay(this);
                }}>使用</i>
            }else{
                balanceCom=<i className="qx_coupon" onClick={(e)=>{
                    this.IsBalancePay = 0;
                    this.setUseBalancePay(this);
                }}>取消</i>
            }

        }else {
            balanceCom=<i className="qx_coupon" onClick={()=>{
                           this.context.router.push({pathname:"/mine/recharge",state: {target:"/"}});
                        }}>去充值</i>
        }

        let selectedAddressSysNo=0;
        if(orderInfo.ReceiverInfo!==null)
        {
            selectedAddressSysNo=orderInfo.ReceiverInfo.CustomerAddressSysNo;
        }
        let subOrderBtnCss="cart_btn";
        let isSubmit=true;
        if(orderInfo.TotalPayAbleAmount===0)
        {
            isSubmit= false;
            subOrderBtnCss =`${subOrderBtnCss} graybg`;
        }
        let updateReceiverInfoCallback=this.updateReceiverInfo(this);

        /*销售员*/
        let options = [];
             options.push(<option value="0">选填，销售员</option>);
               //往options中添加子option
                 for (let option in this.state.SalerList) {
                  options.push(<option value={this.state.SalerList[option].SysNo}> {this.state.SalerList[option].EmployeeName}</option>)
                       }


        return <div>
            <PageLayout>
            <Header id="white_header">核对订单</Header>
                <section className="checkout mt10" style={{marginBottom:50,zIndex:102}}>
                <OrderCustomerAddress receiver={orderInfo.ReceiverInfo}></OrderCustomerAddress>
                {/*{authInfoElement}*/}
                {
                    orderInfo.SubOrderList.map((subOrder,index)=>{
                        let setSelectedCoupons= this.setSelectedCoupons(this);
                        return <SubOrder key={`suborder_${index}`} order={subOrder} showAmount={showAmount}
                                         onCouponSelected={(couponNo,productNos)=>{
                                         setSelectedCoupons(couponNo,productNos)
                        }} onCouponCanceled={(productNos)=>{
                            setSelectedCoupons(null,productNos);
                        }}></SubOrder>;
                    })
                }

                {/*<div className="box-line-b box-line-t mb5" id="invoiceContainer">*/}
                    {/*<a className="checkout_item">*/}
                        {/*<p className="p_text">*/}
                            {/*<span className="right_tit">发票抬头：</span>*/}
                            {/*<input className="checkout_text" type="text" placeholder="选填，发票抬头" maxLength="60"*/}
                                   {/*value={this.state.OrderCreateInfo.InvoiceHeader}*/}
                                   {/*onChange={(e)=>{ this.invoiceHeader=e.target.value; }}*/}
                                   {/*onKeyUp={(e)=>{ if(e.target.value.length>60)*/}
                                    {/*{*/}
                                        {/*e.target.value=e.target.value.substr(0,60);*/}
                                    {/*}}}/>*/}
                        {/*</p>*/}
                    {/*</a>*/}
                {/*</div>*/}


                <div className="box-line-b box-line-t mb5">
                    <div className="checkout_item">
                        <p className="p_text fl"><span className="right_tit">当前余额：</span>
                            <span className="checkout_text">{this.state.OrderCreateInfo.CustomerBalance}</span>
                        </p>
                        {balanceCom}
                    </div>


                </div>

                <div className="box-line-b box-line-t mb5">
                    <a className="checkout_item">
                        <p className="p_text">
                            <span className="right_tit">买家留言：</span>
                            <input className="checkout_text" type="text" placeholder="选填，留言信息" maxLength="400"
                                   value={this.state.OrderCreateInfo.CustomerMemo}
                                   onChange={(e)=>{ this.customerMemo=e.target.value; }}
                                   onKeyUp={(e)=>{ let n=e.target.value;
                                   if(n.length>400)
                                    {
                                        e.target.value=n.substr(0,400);
                                    } }}/>
                        </p>
                    </a>
                </div>

                <div className="box-line-b box-line-t mb5">
                    <div className="checkout_item">
                        <p className="p_text">
                            <span className="right_tit">销售员：</span>
                            <div className="checkout_text checkout_select">
                                <select style={{background:'#fff'}} value={this.state.OrderCreateInfo.salerSysNo} onChange={(e)=>{ this.salerSysNo=e.target.value; }}>{options}</select>
                            </div>
                        </p>
                    </div>
                </div>

                    {specialShowDiv}

                <div className="checkout_price">
                    {activitCom}
                    <p>商品总金额：￥{(orderInfo.ProductOriginAmt -orderInfo.ProductCountDownDiscountAmt).toFixed(2)}</p>
                    {discountAmtCom}
                    {couponAmtCom}
                    {shipAmtCom}
                    {balanceAmtCom}
                </div>
            </section>

            <section className="cartFixfooter">
                <p className="sf">实付:<i className="price">{orderInfo.CashPayAbleAmount.toFixed(2)}</i></p>
                <a className={subOrderBtnCss} onClick={()=>{
                  if (this.checkSalerSysNo())
                  {
                this.create(isSubmit); }}}>提交订单</a>
            </section>
            </PageLayout>

            <OrderCustomerAddressList selectedAdressSysNo={selectedAddressSysNo}
                                      receiveAddressList={this.state.ReceiveAddressList}
                                      onSelected={updateReceiverInfoCallback}></OrderCustomerAddressList>
            {/*{ authEditorElement }*/}
            <Loading ref="loading"></Loading>
        </div>;
    }
}