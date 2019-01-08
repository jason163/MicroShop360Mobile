/**
 * Created by liu.yao on 2016/7/11.
 */
import PageLayout from "components/page-layout.jsx";
import {Header, Content} from "components/header.jsx";
import ImageUpload from "bm/image-upload.jsx";
import Loading from "components/loading.jsx";
import appConfig from "config/app.config.json";
import createRMARequest from "service/rmarequest.service.jsx";
import keys from "config/keys.config.json";
import {setSessionCache} from "utility/storage.jsx";

export class RMARequestIndex extends React.Component {
    static get propTypes() {
        return {
            location: React.PropTypes.any
        };
    }
    static get contextTypes() {
        return {
            router: React.PropTypes.object.isRequired
        }
    }
    constructor(props) {
        super(props);
        this.state = {
            SoItem:Object.is(this.props.location.state,null)||Object.is(this.props.location.state.SoItem,undefined)?{}:this.props.location.state.SoItem,
            RmaRequestInfo:{
                SysNo:0,
                Quantity: 1,
                RMAType: 0,
                CustomerNote: '',
                Images:[],
                Pictures:[],
                ReturnShipTypeID: '',
                ReturnShipTrackingNumber: '',
                RMAStatus:0
            },
            Editable:true,
            IsFirstLoad:true
        };
        this.GoingToSubmit=false;
    }

    componentWillMount() {
        if (this.props.location.state === null) {
            setSessionCache(keys.tabPageActive,3);
            this.context.router.push({
                pathname: "/"
            })
        }
    }

    componentDidMount() {
        this.refreashState();
    }

    refreashState()
    {
        let newState=this.state;
        createRMARequest.getRMAMaster(this.state.SoItem.SOSysNo,this.state.SoItem.ProductSysNo).then(response=>
        {     
            if(!Object.is(response.body,null)) {
                newState.RmaRequestInfo.Quantity = response.body.Items[0].Quantity;
                newState.RmaRequestInfo = Object.assign({}, newState.RmaRequestInfo, response.body);
                newState.RmaRequestInfo.Pictures = response.body.Pictures;
                newState.RmaRequestInfo.Images=[];
                if(!Object.is(response.body.Pics,null)&&!Object.is(response.body.Pics,"")) {
                    response.body.Pics.split(',').map(pic=> {
                        newState.RmaRequestInfo.Images.push(pic);
                    });
                }
                if(response.body.RMAStatus===0||response.body.RMAStatus===10)
                {
                    newState.Editable = true;
                }
                else
                {
                    newState.Editable = false;
                }
                newState.IsFirstLoad = false;
                this.setState(newState);
            }else {
                newState.IsFirstLoad=false;
                this.setState(newState);
            }
            this.refs.loading.loaded();
        });          
    }

    modifyRmaProductQuantity(isIncrease)
    {
        if(this.state.RmaRequestInfo.RMAStatus===0) {
            if (isIncrease) {
                let newState = Object.assign({}, this.state);
                if (newState.RmaRequestInfo.Quantity === this.state.SoItem.Quantity) {
                    return {done: true};
                }
                newState.RmaRequestInfo.Quantity += 1;
                this.setState(newState);
            }
            else {
                let newState = Object.assign({}, this.state);
                if (newState.RmaRequestInfo.Quantity === 1) {
                    return {done: true};
                }
                newState.RmaRequestInfo.Quantity -= 1;
                this.setState(newState);
            }
        }
        return {done:true};
    }

    submit() {
        if(!this.GoingToSubmit) {
            let newState = this.state;
            let pics = "";
            newState.RmaRequestInfo.Images.map(pic=> {
                pics += `${pic},`
            });
            if (pics.length > 0) {
                pics = pics.substr(0, pics.length - 1);
            }
            newState.RmaRequestInfo.CustomerNote = document.getElementsByClassName("rmarequest-content")[0].value;
            newState.RmaRequestInfo.ReturnShipTypeID = document.getElementsByClassName("rmarequest-company")[0].value.trim();
            newState.RmaRequestInfo.ReturnShipTrackingNumber = document.getElementsByClassName("rmarequest-trackingnumber")[0].value.trim();
            if (!Object.is(newState.RmaRequestInfo.CustomerNote, "")) {
                this.GoingToSubmit = true;
                this.refs.loading.loading();
                let request = Object.assign({}, newState.RmaRequestInfo, {
                    SOSysNo: newState.SoItem.SOSysNo,
                    Pics: pics,
                    Items: [{
                        ProductSysNo: newState.SoItem.ProductSysNo,
                        ProductID: newState.SoItem.ProductID,
                        Quantity: newState.RmaRequestInfo.Quantity
                    }]
                });

                createRMARequest.createRMARequest(request).then(response=> {
                    if (response.body.Success) {
                        showMessage("提交成功！");
                        this.refreashState();
                    }
                    else{
                        this.refs.loading.loaded();
                        showMessage(response.body.Message);
                    }
                }).catch(() => {
                    this.refs.loading.loaded();
                })
                this.GoingToSubmit = false;
            }
            else {
                showMessage("请填写问题描述！");
            }
        }
    }

    render() {
        let that = this;
        let pics = that.state.RmaRequestInfo.Pictures.map((picpath,index)=>{
            let imgpath=picpath;
            if(!picpath.startsWith(appConfig.contentSourceUrl)) {
                imgpath = appConfig.contentSourceUrl + picpath;
            }
            return <li key={index}>
                <a style={{backgroundImage:`url(${imgpath})`}}></a>
            </li>
        });

        let customernote;
        if(this.state.RmaRequestInfo.RMAStatus===0) {
            customernote = <textarea className="rmarequest-content" placeholder="问题描述" maxLength="400"
                      defaultValue={that.state.RmaRequestInfo.CustomerNote}></textarea>;
            pics=<ImageUpload uploadtype={'rma'} callback={(imgList)=>{
                                      let newState = Object.assign({}, that.state);
                                      newState.RmaRequestInfo.Images=imgList;
                                      that.setState(newState);
                                }} imgList={that.state.RmaRequestInfo.Pictures}/>;
        }else {
            customernote = <textarea className="rmarequest-content" placeholder="问题描述" maxLength="400"
                                     defaultValue={that.state.RmaRequestInfo.CustomerNote} readOnly></textarea>;
        }

        let timelineObj=[{
            RMAStatus:0,
            RMAStatusText:"待审核",
            Date:that.state.RmaRequestInfo.InDateText,
            Description:"您的服务单已申请成功，待售后审核中"
        },{
            RMAStatus:10,
            RMAStatusText:"审核通过",
            Date:that.state.RmaRequestInfo.AuditDateText,
            Description:"审核通过"
        },{
            RMAStatus:50,
            RMAStatusText:"确认收货",
            Date:that.state.RmaRequestInfo.CollectDateText,
            Description:"已确认收货"
        },{
            RMAStatus:70,
            RMAStatusText:"退款中",
            Date:that.state.RmaRequestInfo.RefundTimeText,
            Description:"正在退款，请注意查收"
        },{
            RMAStatus:100,
            RMAStatusText:"售后完成",
            Date:that.state.RmaRequestInfo.RefundDateText,
            Description:"您的售后服务单已完成"
        },{
            RMAStatus:-1,
            RMAStatusText:"作废",
            Date:that.state.RmaRequestInfo.EditDateText,
            Description:"您的售后服务单已作废"
        }];

        let timeline=[];
        //这个地方只管时间不管状态就好了，设计上其实可以优化的，这样代码就简单多了，不过现在这样写虽然代码多，但是可靠啊
        if(that.state.RmaRequestInfo.RMAStatus===0) {
            if (!Object.is(that.state.RmaRequestInfo.InDate, null) && !Object.is(that.state.RmaRequestInfo.InDate, undefined) && !Object.is(that.state.RmaRequestInfo.InDate, "")) {
                timeline.push(timelineObj[0]);
            }
        }
        if(that.state.RmaRequestInfo.RMAStatus===10) {
            if (!Object.is(that.state.RmaRequestInfo.AuditDate, null) && !Object.is(that.state.RmaRequestInfo.AuditDate, undefined) && !Object.is(that.state.RmaRequestInfo.AuditDate, "")) {
                timeline.push(timelineObj[1]);
            }
            if (!Object.is(that.state.RmaRequestInfo.InDate, null) && !Object.is(that.state.RmaRequestInfo.InDate, undefined) && !Object.is(that.state.RmaRequestInfo.InDate, "")) {
                timeline.push(timelineObj[0]);
            }
        }
        if(that.state.RmaRequestInfo.RMAStatus===50) {
            if (!Object.is(that.state.RmaRequestInfo.CollectDate, null) && !Object.is(that.state.RmaRequestInfo.CollectDate, undefined) && !Object.is(that.state.RmaRequestInfo.CollectDate, "")) {
                timeline.push(timelineObj[2]);
            }
            if (!Object.is(that.state.RmaRequestInfo.AuditDate, null) && !Object.is(that.state.RmaRequestInfo.AuditDate, undefined) && !Object.is(that.state.RmaRequestInfo.AuditDate, "")) {
                timeline.push(timelineObj[1]);
            }
            if (!Object.is(that.state.RmaRequestInfo.InDate, null) && !Object.is(that.state.RmaRequestInfo.InDate, undefined) && !Object.is(that.state.RmaRequestInfo.InDate, "")) {
                timeline.push(timelineObj[0]);
            }
        }
        if(that.state.RmaRequestInfo.RMAStatus===70) {
            if (!Object.is(that.state.RmaRequestInfo.RefundTime, null) && !Object.is(that.state.RmaRequestInfo.RefundTime, undefined) && !Object.is(that.state.RmaRequestInfo.RefundTime, "")) {
                timeline.push(timelineObj[3]);
            }
            if (!Object.is(that.state.RmaRequestInfo.CollectDate, null) && !Object.is(that.state.RmaRequestInfo.CollectDate, undefined) && !Object.is(that.state.RmaRequestInfo.CollectDate, "")) {
                timeline.push(timelineObj[2]);
            }
            if (!Object.is(that.state.RmaRequestInfo.AuditDate, null) && !Object.is(that.state.RmaRequestInfo.AuditDate, undefined) && !Object.is(that.state.RmaRequestInfo.AuditDate, "")) {
                timeline.push(timelineObj[1]);
            }
            if (!Object.is(that.state.RmaRequestInfo.InDate, null) && !Object.is(that.state.RmaRequestInfo.InDate, undefined) && !Object.is(that.state.RmaRequestInfo.InDate, "")) {
                timeline.push(timelineObj[0]);
            }
        }
        if(that.state.RmaRequestInfo.RMAStatus===100) {
            if (!Object.is(that.state.RmaRequestInfo.RefundDate, null) && !Object.is(that.state.RmaRequestInfo.RefundDate, undefined) && !Object.is(that.state.RmaRequestInfo.RefundDate, "")) {
                timeline.push(timelineObj[4]);
            }
            if (!Object.is(that.state.RmaRequestInfo.RefundTime, null) && !Object.is(that.state.RmaRequestInfo.RefundTime, undefined) && !Object.is(that.state.RmaRequestInfo.RefundTime, "")) {
                timeline.push(timelineObj[3]);
            }
            if (!Object.is(that.state.RmaRequestInfo.CollectDate, null) && !Object.is(that.state.RmaRequestInfo.CollectDate, undefined) && !Object.is(that.state.RmaRequestInfo.CollectDate, "")) {
                timeline.push(timelineObj[2]);
            }
            if (!Object.is(that.state.RmaRequestInfo.AuditDate, null) && !Object.is(that.state.RmaRequestInfo.AuditDate, undefined) && !Object.is(that.state.RmaRequestInfo.AuditDate, "")) {
                timeline.push(timelineObj[1]);
            }
            if (!Object.is(that.state.RmaRequestInfo.InDate, null) && !Object.is(that.state.RmaRequestInfo.InDate, undefined) && !Object.is(that.state.RmaRequestInfo.InDate, "")) {
                timeline.push(timelineObj[0]);
            }
        }
        if(that.state.RmaRequestInfo.RMAStatus===-1) {
            if (!Object.is(that.state.RmaRequestInfo.EditDate, null) && !Object.is(that.state.RmaRequestInfo.EditDate, undefined) && !Object.is(that.state.RmaRequestInfo.EditDate, "")) {
                timeline.push(timelineObj[5]);
            }
            if (!Object.is(that.state.RmaRequestInfo.RefundDate, null) && !Object.is(that.state.RmaRequestInfo.RefundDate, undefined) && !Object.is(that.state.RmaRequestInfo.RefundDate, "")) {
                timeline.push(timelineObj[4]);
            }
            if (!Object.is(that.state.RmaRequestInfo.RefundTime, null) && !Object.is(that.state.RmaRequestInfo.RefundTime, undefined) && !Object.is(that.state.RmaRequestInfo.RefundTime, "")) {
                timeline.push(timelineObj[3]);
            }
            if (!Object.is(that.state.RmaRequestInfo.CollectDate, null) && !Object.is(that.state.RmaRequestInfo.CollectDate, undefined) && !Object.is(that.state.RmaRequestInfo.CollectDate, "")) {
                timeline.push(timelineObj[2]);
            }
            if (!Object.is(that.state.RmaRequestInfo.AuditDate, null) && !Object.is(that.state.RmaRequestInfo.AuditDate, undefined) && !Object.is(that.state.RmaRequestInfo.AuditDate, "")) {
                timeline.push(timelineObj[1]);
            }
            if (!Object.is(that.state.RmaRequestInfo.InDate, null) && !Object.is(that.state.RmaRequestInfo.InDate, undefined) && !Object.is(that.state.RmaRequestInfo.InDate, "")) {
                timeline.push(timelineObj[0]);
            }
        }

        let timelineHtml=timeline.map((tl,index)=>{
            let jditemClass="jd_item";
            if(index===0)
            {
                jditemClass+=" on";
            }
            return <div className={jditemClass}>
                <p className="tit">{tl.RMAStatusText}</p>
                <p><time className="colorGrey fontsize12">{tl.Date}</time></p>
                <p className="colorGrey fontsize12">{tl.Description}</p>
            </div>
        })

        let progress;
        if(that.state.RmaRequestInfo.SysNo>0) {
            progress=<div className="box-line-t box-line-b mb5">
                <div className="c_aftersales_item box-line-b">
                    <b>审核进度</b>
                </div>
                <div className="c_aftersales_item">
                    <div className="jd">
                        {timelineHtml}
                    </div>
                </div>
            </div>;
        }

        let content;
        if(that.state.Editable)
        {
            if(!that.state.IsFirstLoad) {
                content = <Content>
                    <section className="c_aftersales mt10"/>
                    <div className="c_aftersales_item box-line-t">
                        <div className="c_aftersales_pro clearFix">
                            <img src={that.state.SoItem.ProductImg} onClick={()=>{
                    this.context.router.push(`/product/${that.state.SoItem.ProductSysNo}`)
                }}/>
                            <p className="name" onClick={()=>{
                    this.context.router.push(`/product/${that.state.SoItem.ProductSysNo}`)
                }}>{that.state.SoItem.ProductName}</p>
                            <p className="mt5">
                                <span className="colorGrey">x {that.state.SoItem.Quantity}</span>
                                <span
                                    className="c_price fr">货款：<em>{that.state.SoItem.CurrentPrice * that.state.SoItem.Quantity}</em></span>
                            </p>
                        </div>
                    </div>
                    <div className="box-line-t box-line-b mb5">
                        <div className="c_aftersales_item box-line-t">
                            <label>服务类型</label>
			                	<span className="radioBox fr">
                                 <input type="radio" name="formSex" defaultChecked="checked" className="on"
                                        defaultValue="退货" readOnly/>
                                    <label htmlFor="formSex">退货</label>
				                </span>
                        </div>
                        <div className="c_aftersales_item box-line-t">
                            <label>数量</label>
                            <p className="num fr">
                                <a onClick={() => {
                                    that.modifyRmaProductQuantity(false);
                                 }}>-</a>
                                    <span className="input_wrap">
                                        <input type="text" value={that.state.RmaRequestInfo.Quantity}/>
                                    </span>
                                <a onClick={() => {
                                    that.modifyRmaProductQuantity(true);
                                 }}>+</a>
                            </p>
                        </div>
                        <div className="c_aftersales_item box-line-t">
                            <div className="c_eval_textarea">
                                {customernote}
                            </div>
                        </div>
                        <div className="c_aftersales_item box-line-t">
                            <div className="c_eval_photo">
                                <ul className="clearFix">
                                    {pics}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="box-line-t box-line-b">
                        <div className="c_aftersales_item box-line-b">
                            <p className="p_text">
                                <span className="right_tit">回寄快递公司：</span>
                                <input className="checkout_text rmarequest-company" type="text" placeholder="输入快递公司" maxLength="10" defaultValue={that.state.RmaRequestInfo.ReturnShipTypeID}/>
                            </p>
                        </div>
                        <div className="c_aftersales_item">
                            <p className="p_text">
                                <span className="right_tit">回寄物流单号 ：</span>
                                <input className="checkout_text rmarequest-trackingnumber" type="text"
                                       placeholder="输入快递单号" maxLength="25" defaultValue={that.state.RmaRequestInfo.ReturnShipTrackingNumber}/>
                            </p>
                        </div>
                    </div>
                    <div className="btnlink mt20 mb10 ml10 mr10"><a className="btnredbg" onClick={()=>{
                                     this.submit();
                                 }}>提交售后申请</a></div>
                    {progress}
                </Content>;
            }
            else
            {
                content = <Content>
                    <section className="c_aftersales mt10"/>
                    <div className="c_aftersales_item box-line-t">
                        <div className="c_aftersales_pro clearFix">
                            <img src={that.state.SoItem.ProductImg} onClick={()=>{
                    this.context.router.push(`/product/${that.state.SoItem.ProductSysNo}`)
                }}/>
                            <p className="name" onClick={()=>{
                    this.context.router.push(`/product/${that.state.SoItem.ProductSysNo}`)
                }}>{that.state.SoItem.ProductName}</p>
                            <p className="mt5">
                                <span className="colorGrey">x {that.state.SoItem.Quantity}</span>
                                <span
                                    className="c_price fr">货款：<em>{that.state.SoItem.CurrentPrice * that.state.SoItem.Quantity}</em></span>
                            </p>
                        </div>
                    </div></Content>;
            }
        }
        else {
            if(!that.state.IsFirstLoad) {
            content = <Content>
                <section className="c_aftersales mt10">
                    <div className="box-line-t box-line-b mb5">
                        <div className="c_aftersales_pro clearFix">
                            <img src={that.state.SoItem.ProductImg} onClick={()=>{
                    this.context.router.push(`/product/${that.state.SoItem.ProductSysNo}`)
                }}/>
                            <p className="name" onClick={()=>{
                    this.context.router.push(`/product/${that.state.SoItem.ProductSysNo}`)
                }}>{that.state.SoItem.ProductName}</p>
                            <p className="mt5">
                                <span className="colorGrey">x {that.state.SoItem.Quantity}</span>
                                <span
                                    className="c_price fr">货款：<em>{that.state.SoItem.CurrentPrice * that.state.SoItem.Quantity}</em></span>
                            </p>
                        </div>
                        <div className="c_aftersales_item box-line-t">
                            <div className="clearFix">
                                <label>服务类型</label>
                                <span className="colorGrey fr">{that.state.RmaRequestInfo.RMATypeText}</span>
                            </div>
                        </div>
                        <div className="c_aftersales_item box-line-t">
                            <div className="clearFix">
                                <label>数量</label>
                                <p className="colorGrey fr">{that.state.RmaRequestInfo.Quantity}</p>
                            </div>
                        </div>
                        <div className="c_aftersales_item box-line-t">
                            <div className="pus">
                                <span>问题描述</span>
                                <p className="colorGrey">{that.state.RmaRequestInfo.CustomerNote}</p>
                            </div>
                            <div className="c_eval_photo">
                                <ul className="clearFix">
                                    {pics}
                                </ul>
                            </div>
                        </div>
                        <div className="box-line-t box-line-b mb5">
                            <div className="c_aftersales_item box-line-b">
                                <p className="p_text clearFix"><span className="right_tit">回寄快递公司</span><span
                                    className="colorGrey fr">{this.state.RmaRequestInfo.ReturnShipTypeID}</span></p>

                            </div>
                            <div className="c_aftersales_item">
                                <p className="p_text clearFix"><span className="right_tit">回寄物流单号 </span><span
                                    className="colorGrey fr">{this.state.RmaRequestInfo.ReturnShipTrackingNumber}</span></p>
                            </div>
                        </div>
                        {progress}
                    </div>
                </section>
            </Content>
            }
            else
            {
                content = <Content>
                    <section className="c_aftersales mt10"/>
                    <div className="c_aftersales_item box-line-t">
                        <div className="c_aftersales_pro clearFix">
                            <img src={that.state.SoItem.ProductImg} onClick={()=>{
                    this.context.router.push(`/product/${that.state.SoItem.ProductSysNo}`)
                }}/>
                            <p className="name" onClick={()=>{
                    this.context.router.push(`/product/${that.state.SoItem.ProductSysNo}`)
                }}>{that.state.SoItem.ProductName}</p>
                            <p className="mt5">
                                <span className="colorGrey">x {that.state.SoItem.Quantity}</span>
                                <span
                                    className="c_price fr">货款：<em>{that.state.SoItem.CurrentPrice * that.state.SoItem.Quantity}</em></span>
                            </p>
                        </div>
                    </div></Content>;
            }
        }


        return (
            <PageLayout>
                <Header>售后申请</Header>
                {content}
                <Loading ref="loading" isModal={true}></Loading>
            </PageLayout>
        );
    }
}