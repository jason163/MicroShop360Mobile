import AddressDetailComponent from "bm/address-detail.jsx";
class OrderCustomerAddress extends React.Component{
	static get propTypes(){
		return{
			receiver:React.PropTypes.object
		}
	}
	static get defaultProps(){
		return {
			receiver:{
				CustomerAddressSysNo:0,
				ReceiveContact:"",
				ReceivePhone:"",
				ReceiveAddress:""
			}
		}
	}
	static get contextTypes() {
		return {
			router: React.PropTypes.object.isRequired
		};
	}

	getLinkContent(){
		if(this.props.receiver===null || this.props.receiver.CustomerAddressSysNo===0)
		{
			return (
				<a className="checkout_item arrow_r address" onClick={()=>{
					 let container = document.getElementById("receiverAddressContainer");
					 if(container.style.display!=="none")
					 {
						container.style.display="none";
					 }
					 else
					 {
						container.style.display="block";
					 }
					}}>
					<p><span className="mr10">到店消费</span></p>
				</a>
			);
		}

		return (
			<a className="checkout_item arrow_r address" onClick={()=>{
			 let container = document.getElementById("receiverAddressContainer");
			 if(container.style.display!=="none")
			 {
			 	container.style.display="none";
			 }
			 else
			 {
			 	container.style.display="block";
			 }
			}}>
				<p><span className="mr10">收货地址：</span><span className="mr10">{this.props.receiver.ReceiveContact}</span><span>{this.props.receiver.ReceivePhone}</span></p>
				<p className="xx">{this.props.receiver.DistrictName}{this.props.receiver.ReceiveAddress}</p>
			</a>
		);
	}
	render(){
		return (
			<div className="box-line-b box-line-t mb5" >
				{this.getLinkContent()}
			</div>
		);
	}
}


 class OrderCustomerAddressList extends React.Component{
	constructor(props){
		super(props);
		if(this.props.selectedAdressSysNo!==null)
		{
			this.state={
				selectedAdressSysNo:this.props.selectedAdressSysNo
			}
		}
		else
		{
			this.state={
				selectedAdressSysNo:0
			}
		}
	}

	static get propTypes(){
		return{
			selectedAdressSysNo:React.PropTypes.number,
			receiveAddressList:React.PropTypes.array,
			onSelected:React.PropTypes.func
		}
	}
	static get defaultProps(){
		return {
			selectedAdressSysNo:0,
			receiveAddressList:null,
			onSelected:null
		}
	}
	static get contextTypes() {
		return {
			router: React.PropTypes.object.isRequired
		};
	}
	renderCustomerAddressList(){
		let editType ="N";
		let title="选择收货地址";
		let contentElement =null;

		if(this.props.receiveAddressList===null || this.props.receiveAddressList.length===0)
		{
			title="添加收货地址";
			contentElement =<AddressDetailComponent options={{
				type: editType,
				sysNo: 0,//this.props.location.addressSysNO,
				saveCallBack: (response) => {
					if (response.Success) {
							let address = response.Data;
							if(this.props.onSelected!==null)
							{
								let container = document.getElementById("receiverAddressContainer");
								container.style.display="none"
								this.props.onSelected(address);
							}
						}
					}
				}}></AddressDetailComponent>;
		}
		else
		{
			let addLink = null;
			if(this.props.receiveAddressList.length<5)
			{
				addLink=<div className="btnlink"><a className="btnredbg" onClick={()=>{
                        this.context.router.push({
                            pathname: "/mine/receiveaddress/detail",
                            state: {
                                type: 'N',
                                saveCallBack: (response) => {
                                    if (response.Success) {
                                        history.go(-1);
                                    }
                                }
                            }
                        });
						}}>新增收货地址 +</a>
				</div>;
			}

			contentElement=<div className="c_address_list">
               <div className="address_item mb5 box-line-b box-line-t pb10">
				   <p onClick={()=>{				
										if(this.props.onSelected!==null) {
											let container = document.getElementById("receiverAddressContainer");
											container.style.display="none";
											this.props.onSelected(0);
										}
									}
								}><span className="mr10 colorGrey">到店消费</span>
				   </p>
			   </div>
				{this.props.receiveAddressList.map((address,index)=>{
					return <div key={index} className="address_item mb5 box-line-b box-line-t pb10">
						<p onClick={()=>{					
										if(this.props.onSelected!==null) {
											let container = document.getElementById("receiverAddressContainer");
											container.style.display="none";
											this.props.onSelected(address);
										}
									}
								}><span className="mr10 colorGrey">{address.ReceiveName}</span> <span>（{address.ReceiveCellPhone}）</span>
						</p>
						<p>{address.DistrictName}{address.ReceiveAddress}</p>
					</div>;
				})}
				{addLink}
			</div>;
		}
		return <div id="receiverAddressContainer" className="layer1 pop-up" style={{display:"none","position":"fixed"}}>
			<div className="up_header">
				<div className="header">
					<a className="return" onClick={()=>{
						let container = document.getElementById("receiverAddressContainer");
						container.style.display="none";
				}}></a>
					<h3>{title}</h3>
				</div>
			</div>
			{contentElement}
		</div>;
	}
	render(){
		return this.renderCustomerAddressList();
	}
}

 class OrderCustomerAuth extends React.Component{
	static get propTypes(){
		return{
			auth:React.PropTypes.object
		}
	}
	static get defaultProps(){
		return {
			auth:{
				SysNo:0,
				RealName:"",
				IDCardNumber:"",
				PhoneNumber:"",
				Address:""
			}
		}
	}
	linkEditor(){
		let container = document.getElementById("authEditorContainer");
		if(container.style.display!=="none")
		{
			container.style.display="none";
		}
		else
		{
			container.style.display="block";
		}
	}
	renderContent(){
		if(this.props.auth=== null || this.props.auth.RealName===""){
			return(
				<a className="checkout_item arrow_r" onClick={()=>{this.linkEditor();}}>
					<p>实名认证<span className="blue">（未认证）</span></p>
				</a>
			)
		}
		return(
			<a className="checkout_item arrow_r address" onClick={()=>{this.linkEditor();}}>
				<p>实名认证<span className="blue">（已认证）</span></p>
			</a>
		)
	}

	render(){
		return (
			<div className="box-line-b box-line-t mb5">
				{this.renderContent()}
			</div>
		);
	}
}

class OrderCoupon extends React.Component{

	constructor(props){
		super(props);
		this.state={
			SelectedCouponNos:[]
		}
	}

	static get propTypes(){
		return{
			SelectedCouponNos:React.PropTypes.array,
			Coupons:React.PropTypes.array,
			OnSelected:React.PropTypes.func,
			OnCanceled:React.PropTypes.func
		}
	}
	static get defaultProps(){
		return {
			SelectedCouponNos:null,
			Coupons:null,
			OnSelected:null,
			ProductSysNos:null,
			OnCanceled:null
		}
	}
	renderSelectedCoupons(){
		if(this.props.Coupons===null
			||this.props.Coupons.length===0
			||this.state.SelectedCouponNos===null
			||this.state.SelectedCouponNos.length===0)
		{
			return null;
		}
		let selectedCoupons=[];
		for(let i=0;i<this.state.SelectedCouponNos.length;i++){
			let n=this.state.SelectedCouponNos[i];
			for(let j=0;j<this.props.Coupons.length;j++){
				let c=this.props.Coupons[j];
				if(n===c.CouponNo)
				{
					selectedCoupons.push(c);
				}
			}
		}
		if(selectedCoupons.length===0){
			return null;
		}
		return <div className="box-line-b box-line-t">
			{selectedCoupons.map((coupon ,index)=>{
			return <p key={index} className="selected_coupon clearFix" ><span className="mr10 colorGrey">{coupon.CouponName}</span>
				<span className="colorGrey">￥{coupon.FaceValue}</span>
				<i className="qx_coupon" onClick={()=>{
							this.setState({SelectedCouponNos:[]});
							if(this.props.OnCanceled!==null) {
								this.props.OnCanceled();
							}
				}}>取消</i>
			</p>
		})}
		</div>;
	}
	updateState(owner){
		return (couponNo)=>{
			owner.setState({SelectedCouponNos:[couponNo]});
		}
	}
	getDate(d)
	{
		let reg = /Date(\d+)/g;
		reg.exec(d);
	}

	formatDateNo (n) {
		if (n < 10) {
			return `0${n}`;
		}
		return n.toString();
	}
	jsonDateTimeToJsDate (jsonDate) {
		if (jsonDate === null || jsonDate === "")
		{
			return "";
		}
		let d = jsonDate.replace(/\//g, '');
		let scheduleDate;
		eval(`scheduleDate=new ${d}`);
		return scheduleDate;
	}
	// /Date(1415685633390)/ 转换为 yyyy-m-d HH:mm 时间格式
	jsonDateTimeToServiceDateTime(jsonDate,formtTime) {
		if (jsonDate === null || jsonDate === "")
		{
			return "";
		}
		let jsDate = this.jsonDateTimeToJsDate(jsonDate);
		let ndate = `${jsDate.getFullYear()}-${this.formatDateNo(jsDate.getMonth() + 1)}-${this.formatDateNo(jsDate.getDate())}`;
		if(formtTime===true)
		{
			ndate += ` ${this.formatDateNo(jsDate.getHours())}:${this.formatDateNo(jsDate.getMinutes())}`;
		}
		return ndate;
	}

	renderCanBeUsedCoupons(){
		let updateState = this.updateState(this);
		return <div className="layer1 pop-up" data-name="couponListContainer" style={{display:"none",position:"fixed"}}>
			<div className="up_header">
				<div className="header">
					<a className="return" onClick={(e)=>{
							let pNode= e.target.parentNode;
							let container =null;
							while(container===null && pNode.tagName!=="BODY")
							{
								if(pNode.getAttribute("data-name")==="couponListContainer")
									{
										container=pNode;
										break;
									}
									pNode=pNode.parentNode;
							}
						container.style.display="none";
				}}></a>
					<h3>使用优惠券</h3>
				</div>
			</div>
			<section className="coupons mt10">
				<ul>
				{
					this.props.Coupons.map((coupon,index)=>{
						let endDateEle =null;
						if(typeof coupon.UseEndDate !== "undefined" && coupon.UseEndDate!==null)
						{
							endDateEle =<span className="colorGrey">截止 {this.jsonDateTimeToServiceDateTime(coupon.UseEndDate,true)} 有效</span>
						}
						else
						{
							endDateEle =<span className="colorGrey">长期有效</span>
						}
					return <li key={index} onClick={(e)=>{
							let pNode= e.target.parentNode;
							let container =null;
							while(container===null && pNode.tagName!=="BODY")
							{
								if(pNode.getAttribute("data-name")==="couponListContainer")
									{
										container=pNode;
										break;
									}
									pNode=pNode.parentNode;
							}

							if(container!==null)
							{
								if(container.style.display!=="none"){
									container.style.display="none";
								}
								else {
									container.style.display="block";
								}
							}
							updateState(coupon.CouponNo);
							if(this.props.OnSelected!==null) {
								this.props.OnSelected(coupon);
							}
						}}>
						<div className="box-line-t box-line-b mb5">
							<div className="coupons_item clearFix">
								<div className="cq fl">
									<em>￥</em>{coupon.FaceValue}
								</div>
								<div className="sm fl">
									<p>{coupon.CouponName}</p>
									{endDateEle}
								</div>

							</div>
						</div>
					</li>;
				})
				}
				</ul>
			</section>
		</div>
	}

	render(){
		if(this.props.Coupons===null ||this.props.Coupons.length===0)
		{
			return null;
		}
		return (
			<div className="box-line-b box-line-t" >
				<a className="checkout_item arrow_r" onClick={(e)=>{
				    let eleList = e.target.parentNode.parentNode.getElementsByTagName("div");
				    let couponsContainer =null;
				    for(let i=0;i<eleList.length;i++)
				    {
				    	let ele=eleList[i];
				    	if(ele.getAttribute("data-name")==="couponListContainer")
				    	{
							couponsContainer= ele;
							break;
				    	}
				    }
				    if(couponsContainer!==null)
				    {
						//let couponsContainer = document.getElementById("couponsContainer");
						if(couponsContainer.style.display!=="none") {
							couponsContainer.style.display="none";
						}
						else {
							couponsContainer.style.display="block";
						}
					}
				}}>优惠券（{this.props.Coupons.length}张可用）</a>
				{this.renderSelectedCoupons()}
				{this.renderCanBeUsedCoupons()}
			</div>
		);
	}
}

class SubOrder extends React.Component{
	static get propTypes(){
		return{
			showAmount:React.PropTypes.bool,
			order:React.PropTypes.object,
			onCouponSelected:React.PropTypes.func,
			onCouponCanceled:React.PropTypes.func
			//,orderIndex:React.PropTypes.number
		}
	}
	static get defaultProps(){
		return {
			showAmount:true,
			order: null,
			onCouponSelected:null,
			onCouponCanceled:null
		//	,orderIndex:null
		}
	}
	static get contextTypes() {
		return {
			router: React.PropTypes.object.isRequired
		};
	}
	renderGroupProperty(pList) {
		if(pList===null|| pList.length===0)
		{
			return null;
		}
		return(
			<p className="guige">
				{
					pList.map((item,index)=>{
						return<span key={index} className="colorGrey mr10">{item.PropertyName}：{item.PropertyValue}</span>;
					})
				}
			</p>);
	}

	render(){
		let orderInfo = this.props.order;
		if(orderInfo===null)
		{
			return null;
		}

		let isService = orderInfo.BizType !== 0;
		let orderTitle="";
		if(isService)
		{
			orderTitle="此商品请到店消费";
		}
	//	let couponListElement=(<div style={{margin:"20px"}}  onClick={(d)=>{ debugger; t= this.context; couponDialog.close();}}>优惠券列表</div>);
	//	let couponDialog =<Dialog  content={couponListElement}></Dialog>;

		let discountAmtCom=null;
		if(orderInfo.ProductDiscountAmt-orderInfo.ProductCountDownDiscountAmt>0)
		{
			discountAmtCom=<p className="clearFix"><span className="fr">商品折扣：-￥{(orderInfo.ProductDiscountAmt-orderInfo.ProductCountDownDiscountAmt).toFixed(2)}</span></p>;
		}
		let couponAmtCom=null;
		if(orderInfo.CouponDiscountAmt>0)
		{
			couponAmtCom=<p className="clearFix"><span className="fr">优惠券：-￥{orderInfo.CouponDiscountAmt.toFixed(2)}</span></p>;
		}
		let shipAmtCom=null;
		if(orderInfo.ShippingOriginAmt>0)
		{
			shipAmtCom=<p className="clearFix"><span className="fr">运费：￥{orderInfo.ShippingOriginAmt.toFixed(2)}</span></p>;
		}
		let activitCom = null;
		if(orderInfo.ShoppingCartReductionMessage!==null && orderInfo.ShoppingCartReductionMessage!=="")
		{
			activitCom=<p className="clearFix fontsize12" style={{textAlign:"left"}}><span className="fr colorRed">{orderInfo.ShoppingCartReductionMessage}，
				<a onClick={()=>{
                        this.context.router.push({
                            pathname: "/search",
                            state: { SearchArgs: { keyword: "" } }
                        });
				}}><span className="blue">去凑单</span> </a></span></p>;
		}
		 let amountCom=null;
			if(this.props.showAmount)
			{
				amountCom =<div className="checkout_tj">
					{activitCom}
					<p className="clearFix"><span className="fr">商品总额：￥{(orderInfo.ProductOriginAmt -orderInfo.ProductCountDownDiscountAmt).toFixed(2)}</span></p>
					{discountAmtCom}
					{couponAmtCom}
					{shipAmtCom}
					<p className="clearFix"><span className="fr">应付总额：￥{orderInfo.TotalPayAbleAmount.toFixed(2)}</span></p>
				</div>;
			}
		let productSysNos=[];
		for(let i=0;i<orderInfo.Items.length;i++){
			let item =orderInfo.Items[i];
			productSysNos.push(item.ProductSysNo);
		}
		if(typeof orderInfo.CanBeUsedCouponList === "undefined" || orderInfo.CanBeUsedCouponList === null|| orderInfo.CanBeUsedCouponList.length===0) {
			orderInfo.CanBeUsedCouponList = [];//[{CouponNo:"12",CouponName:"优惠券1",FaceValue:100},{CouponNo:"123",CouponName:"优惠券2",FaceValue:100}]
		}
		if(typeof orderInfo.UsedCouponNoList === "undefined" || orderInfo.UsedCouponNoList === null) {
			orderInfo.UsedCouponNoList = []
		}
		return (
			<div className="box-line-b box-line-t mb5" >
				<div className="checkout_pro_item">
					<div className="checkout_item">
						<div className="tit colorRed">{orderTitle}</div>
						{
							orderInfo.Items.map((itemInfo,index)=>{
								let productUrl = `/product/${itemInfo.ProductSysNo}`;
								let priceEles = [];

								if(itemInfo.IsSaleCountDown)
								{
									priceEles.push(<span className="colorGrey">单价：￥{itemInfo.CurrentPrice.toFixed(2)}</span>);
									priceEles.push(<span className="colorGrey ml10">x {itemInfo.Quantity}</span>);
									priceEles.push(<span className="price fr colorRed">货款<span>{itemInfo.CurrentAmount.toFixed(2)}</span></span>);
								}
								else {
									priceEles.push(<span className="colorGrey">单价：￥{itemInfo.OriginPrice.toFixed(2)}</span>);
									priceEles.push(<span className="colorGrey ml10">x {itemInfo.Quantity}</span>);
									priceEles.push(<span className="price fr colorRed">货款<span>{itemInfo.OriginAmount.toFixed(2)}</span></span>);
								}

								return <div key={index} className="checkout_pro box-line-t">
									<a>
										<img src={itemInfo.DefaultImage} onClick={()=>{
										this.context.router.push(productUrl);
									}}/>
										<div className="text">
											<p className="name" onClick={()=>{
										this.context.router.push(productUrl);
									}}>{itemInfo.ProductName}</p>
											{this.renderGroupProperty(itemInfo.GroupProps)}
											<p className="guige">
												{priceEles}
											</p>
										</div>
									</a>
								</div>;
							})
						}
					</div>

					<OrderCoupon Coupons={orderInfo.CanBeUsedCouponList} SelectedCouponNos={orderInfo.UsedCouponNoList} OnSelected={(coupon)=>{
						if(this.props.onCouponSelected!==null)
						{
							this.props.onCouponSelected(coupon.CouponNo,productSysNos)
						}
					}} OnCanceled={()=>{
					if(this.props.onCouponCanceled!==null)
						{
							this.props.onCouponCanceled(productSysNos)
						}
					}}></OrderCoupon>

					{amountCom}
				</div>
			</div>
		);
	}
}

export {
	OrderCustomerAddress,OrderCustomerAddressList ,OrderCustomerAuth,OrderCoupon,SubOrder
}