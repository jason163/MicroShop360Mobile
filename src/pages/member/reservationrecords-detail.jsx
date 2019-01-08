
import PageLayout from "components/page-layout.jsx";
import {Header, Content} from "components/header.jsx";
import service from "service/mine.service.jsx";
import DatePicker from 'antd/lib/date-picker'
require("assets/css/base.css");
require("assets/css/form.css");
require("assets/css/antd.min.css");

export class reservationDetail extends React.Component {
    static get contextTypes() {
        return {
            router: React.PropTypes.object.isRequired
        }
    }

    static get propTypes() {
        return {
            params: React.PropTypes.any,
            location: React.PropTypes.any,
            options: React.PropTypes.object
        };
    }

    constructor(props) {
        super(props);
        const reservationProductList = service.getReservationProduct().then((res) => {
            this.setState({
                ReservationProductList: res
            })
        });
        this.state = {
            ReservationProductList: reservationProductList,
            reservationDetail: {
                OrderSysNo: '',
                ProductSysNo: '',
                ProductName: '',
                Memo: '',
                ReservationDate: ''
            },
            validMessage: {
                ProductSysNo: {
                    isValid: true,
                    validMessage: ''
                },
                ReservationDate: {
                    isValid: true,
                    validMessage: ''
                }
            }
        };
    }

    updateValue(evt, propertyName) {
        let value = evt.target.value.trim();
        let newState = Object.assign({}, this.state);
        newState.reservationDetail[propertyName] = value;
        this.setState(newState);
    }

    removeHighLight(propertyName) {
        let newState = Object.assign({}, this.state);
        newState.validMessage[propertyName].isValid = true;
        newState.validMessage[propertyName].validMessage = '';
        this.setState(newState);
    }

    formatDate(date, str) {
        let format = str;
        let _this = date;
        let o = {
            "M+": _this.getMonth() + 1,//month
            "d+": _this.getDate(),//day
            "h+": _this.getHours(),//hour
            "m+": _this.getMinutes(),//minute
            "s+": _this.getSeconds(),//second
            "q+": Math.floor((_this.getMonth() + 3) / 3),//quarter
            "S": _this.getMilliseconds() //millisecond
        }
        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1,
                String(_this.getFullYear()).substr(4 - RegExp.$1.length));
        }

        for (let k in o) {
            if (new RegExp(String.prototype.concat('(',k,')')).test(format)) {
                format = format.replace(RegExp.$1,
                    RegExp.$1.length === 1 ? o[k] :
                        String.prototype.concat("00",o[k]).substr(String(o[k]).length));
            }
        }

        return format;
    }

    checkIsNullOrWhitespace(value) {
        return value === undefined || value === null;
    }

    checkYuyue() {
        let newState = Object.assign({}, this.state);
        let isValid = true;
        if (this.checkIsNullOrWhitespace(newState.ProductSysNo)) {
            newState.validMessage.ProductSysNo.isValid = false;
            newState.validMessage.ProductSysNo.validMessage = "*请选择预约商品";
            isValid = false;
        }
        if (this.checkIsNullOrWhitespace(newState.ReservationDate)) {
            newState.validMessage.ReservationDate.isValid = false;
            newState.validMessage.ReservationDate.validMessage = "*请选择预约时间年";
            isValid = false;
        }
        if (!isValid) {
            this.setState(this.state);
        }
        return isValid;
    }

    componentWillMount() {
    }

    render() {
        let options = [];
        options.push(<option value="0">选择预约商品</option>);
        //往options中添加子option
        for (let option in this.state.ReservationProductList) {
            options.push(<option value={this.state.ReservationProductList[option].ProductSysNo}
                                 id={this.state.ReservationProductList[option].OrderSysNo}> {this.state.ReservationProductList[option].ProductName}</option>)
        }

        return (
            <PageLayout>
                <Header>预约</Header>
                <Content>
                    <section className="form mt16">
                        <p>
						<span className="selectBox row">
						<span className="col col-e1">
									<select style={{background:'#fff'}} value={this.state.reservationDetail.ProductSysNo} id={this.state.OrderSysNo} onChange={(evt) => {
                                        this.setState(Object.assign({}, this.state, { ProductSysNo: evt.target.value }));
                                        this.updateValue(evt, 'ProductSysNo');
                                        this.removeHighLight('ProductSysNo');
                                    }
                                    } name="ProductSysNo">
                                        {options}
									</select>
								</span>
								</span>
                        </p>
                        <em className="error">{this.state.validMessage.ProductSysNo.validMessage}</em>

                        <DatePicker showTime format="yyyy-MM-dd HH:mm" style={{width:'100%'}} placeholder="选择预约时间"
                                    onChange={(value)=>{
                                        let strDate = this.formatDate(value,"yyyy-MM-dd hh:mm");
                                        this.setState(Object.assign({}, this.state, { ReservationDate: strDate}));
                                    }}/>

                        <em className="error">{this.state.validMessage.ReservationDate.validMessage}</em>

                        <p style={{height:'50px'}}><input type="text" maxLength={50} value={this.state.Memo} placeholder="亲，备注不能超过50个字哦！" onChange={(e)=>{
                            this.setState(Object.assign({}, this.state, { Memo: e.target.value }));
                        }}/></p>


                        <p className="btn">

                            <input type="submit" id="" value="确 定" onClick={() => {
                                if (this.checkYuyue()) {
                                    let reservationDetail1 = this.state.reservationDetail;
                                    reservationDetail1.ProductSysNo = this.state.ProductSysNo;
                                    reservationDetail1.ReservationDate = this.state.ReservationDate;
                                    reservationDetail1.Memo = this.state.Memo;
                                    service.createReservationRecords(reservationDetail1).then((data) => {
                                        if (data.SysNo > 0) {
                                            this.context.router.push(`/mine/reservationRecordsList`)
                                        } else {
                                            throwError(data.Message);
                                        }
                                    }).catch(() => {
                                    });
                                }
                            }}></input>

                        </p>
                    </section>
                </Content>
            </PageLayout>
        )
    }
}

    
