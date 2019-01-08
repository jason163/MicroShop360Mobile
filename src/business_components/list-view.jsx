import {Link} from "react-router"
export class ListView extends React.Component {
    static get propTypes() {
        return {
            children: React.PropTypes.any
            , style: React.PropTypes.object
        };
    }

    static get defaultProps() {
        return {
            style: {}
        };
    }

    render() {
        return (
            <div className="list-view" style={this.props.style}>
                {this.props.children}
            </div>
        );
    }
}

export class ListKeyValueCell extends React.Component {
    static propTypes() {
        return {
            data: React.PropTypes.object
        }
    }

    render() {
        return (
            <div
                className={classNames("list-key-value-cell",{"list-key-value-cell-divider":this.props.data.showDivider})}>
                <div className="list-cell-key">
                    <span>{this.props.data.key}</span>
                </div>
                <div className="list-cell-value">
                    <span>{this.props.data.value}</span>
                </div>
            </div>
        );
    }
}

/*
 * 可编辑的key-value
 * children:html (date,select会出现右箭头)
 *  * valueType
 *  1-input
 *  2-select
 *  3-textarea
 * */
export class ListKeyValueEditCell extends React.Component {
    static propTypes() {
        return {
            title: React.PropTypes.string,
            children: React.PropTypes.any,
            showDivider: React.PropTypes.bool,
            valueType: React.PropTypes.number
        }
    }

    render() {
        let hideIconArrow;
        switch (this.props.valueType) {
            case 1:
                hideIconArrow = true;
                break;
            case 2:
                hideIconArrow = false;
                break;
            case 3:
                hideIconArrow = true;
                break;
            default:
                hideIconArrow = false;
        }
        return (
            <div className={
                classNames(
                    "list-key-value-cell-edit",
                    {"list-key-value-cell-divider":this.props.showDivider})}>
                <div>
                    <div className="cell-key">
                        <span>{this.props.title}</span>
                    </div>
                    <div className={classNames("cell-value",{"hide-icon":hideIconArrow})}>
                        {this.props.children}
                        <i className="iconfont icon-jiantou"></i>
                    </div>
                </div>
            </div>
        );
    }
}

/*
 * 复杂的List Cell(包括左边图标,文字;右边箭头以及箭头前的文字)
 * */
export class ComplexCell extends React.Component {
    static get contextTypes() {
        return {
            router: React.PropTypes.object.isRequired
        };
    }

    static propTypes() {
        return {
            options: {
                iconClassName: React.PropTypes.string,
                title: React.PropTypes.string.isRequired,
                tip: React.PropTypes.string,
                count: React.PropTypes.number
            },
            to: React.prototype.any.isRequired
        }
    }

    static get defaultProps() {
        return {
            options: {
                count: 0
            }
        }
    }

    render() {
        return (
            <div className="list-view-complex-item" onClick={()=>{
                this.context.router.push(this.props.to);
            }}>
                {this.props.options.iconClassName && <div className="item-icon">
                    <i className={this.props.options.iconClassName}></i>
                </div>}
                <div className="item-tip">
                    {this.props.options.tip && <span>{this.props.options.tip}</span>}
                    <i className="right-arrow iconfont icon-jiantou1"></i>
                </div>
                <div className="item-title">{this.props.options.title}{this.props.options.count > 0 ?
                    <em>({this.props.options.count})</em> : null}</div>
            </div>
        )
    }
}

export class CouponCell extends React.Component {
    static propTypes() {
        return {
            data: React.PropTypes.any,
            key:React.PropTypes.object
        };
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
    render() {
        let endDateEle =null;
        if(this.props.data.UseEndDate===null)
        {
            endDateEle=<p className="colorGrey">长期有效</p>
        }
        else if(this.jsonDateTimeToJsDate(this.props.data.UseEndDate)<=new Date().getTime())
        {
            endDateEle=<p className="colorRed">已过期</p>
        }else
        {
            endDateEle=<p className="colorGrey">截止 {this.jsonDateTimeToServiceDateTime(this.props.data.UseEndDate,true)} 有效</p>
        }
        let facevalue=this.props.data.FaceValue;
        if(this.props.data.FaceValue>10)
        {
            let re = /([0-9]+\.[0-9]{1})[0-9]*/;
            facevalue=this.props.data.FaceValue.toString().replace(re,"$1");
        }
        return (
            <li key={this.props.key}>
                <div className="box-line-t box-line-b mb5">
                    <div className="coupons_item clearFix">
                        <div className="cq fl">
                            <em>￥</em>{facevalue}
                        </div>
                        <div className="sm fl">
                            <p>{this.props.data.Remark}</p>
                            {endDateEle}
                        </div>
                    </div>
                </div>
            </li>
        );
    }
}

export class SOItemCell extends React.Component {
    static propTypes() {
        return {
            detail: React.PropTypes.any,
            sostatus: React.PropTypes.number
        };
    }

    static get contextTypes() {
        return {
            router: React.PropTypes.object.isRequired
        }
    }

    render() {
        return (
            <div className="o_details_item box-line-t">
                <Link to={`/product/${this.props.detail.ProductSysNo}`}>
                    <img src={this.props.detail.ProductImg}/>
                    <p className="name">{this.props.detail.ProductName}</p>
                    <p className="mt5">
                        <span className="colorGrey">x {this.props.detail.Quantity}</span>
                        <span className="c_price ml10">价格：<em>{this.props.detail.OriginPrice}</em></span>

                    </p>
                </Link>
                <div className="btn_cd">
                    <a onClick={()=>{

                       this.context.router.push({
                                pathname: "/mine/evaluation",
                                state: {
                                    SoItem:this.props.detail
                                }
                            })

                }} className={classNames("fr","btn_aftersales",{"hide":this.props.sostatus!==100})}>评价</a>
                    <a onClick={()=>{
                    if(this.props.detail.BizType===0)
                    {
                        this.context.router.push({
                                pathname: "/mine/rmarequest",
                                state: {
                                    SoItem:this.props.detail
                                }
                            })
                             }
                    else {
                        showMessage("您购买的服务类型商品请直接联系客服处理售后！");
                    }
                }} className={classNames("fr","btn_aftersales",{"hide":this.props.sostatus!==100})}>售后</a>
                </div>
            </div>
        );
    }
}