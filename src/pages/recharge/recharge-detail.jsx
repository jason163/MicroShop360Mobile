import PageLayout from "components/page-layout.jsx";
import {Header, Content} from "components/header.jsx";
import rechargeService from "service/recharge.service.jsx";
import PageListView from "components/page-list-view.jsx";

export class rechargeDetail extends React.Component {
    static get contextTypes() {
        return {
            router:React.PropTypes.object.isRequired
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
        this.state = {
            rechargeDetail: {
                RechargeAmount: ''
            },
            validMessage: {
                RechargeAmount: {
                    isValid: true,
                    validMessage: ''
                }
            }
        }
    }
    updateValue(event, propertyName) {
        let value = event.target.value.trim();
        let newState = Object.assign({}, this.state);
        newState.rechargeDetail[propertyName] = value;
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
    checkAddress() {

        let newState = Object.assign({}, this.state);
        let isValid = true;
        if (this.checkIsNullOrWhitespace(newState.rechargeDetail.RechargeAmount)) {
            newState.validMessage.RechargeAmount.isValid = false;
            newState.validMessage.RechargeAmount.validMessage = "*充值金额不能为空";
            isValid = false;
        }
        if (!this.checkIsNullOrWhitespace(newState.rechargeDetail.RechargeAmount)) {
            let re = /^[1-9]\d*(\.\d+)?$/;
            if (!re.test(newState.rechargeDetail.RechargeAmount.trim())) {
                newState.validMessage.RechargeAmount.isValid = false;
                newState.validMessage.RechargeAmount.validMessage = '*充值金额格式不对';
                isValid = false;
            }
        }
        if (!isValid) {
            this.setState(this.state);
        }
        return isValid;
    }
    componentDidMount() {
        /*
        rechargeService.InsertRecharge().then((data)=> {
            let newState = Object.assign({}, this.state);
            newState.rechargeAmount=data.rechargeAmount;
            newState.SysNo=data.SysNo;
            this.setState(newState);
        }).catch(() => {
        });
        */
    }
    render() {
        return(
            <PageLayout>
                <Header>充值</Header>
                <Content>
                    <section className="form mt16">

                            <p><input type="text" name="rechargeAmount" value={this.state.rechargeDetail.RechargeAmount} placeholder="输入金额" onChange={(event)=>{
                                   this.updateValue(event, 'RechargeAmount');
                                    this.removeHighLight('RechargeAmount');
                                }}/></p>
                        <em className="error">{this.state.validMessage.RechargeAmount.validMessage}</em>
                            <p className="btn"onClick={()=>{
                                  if (this.checkAddress())
                                   {
                            rechargeService.InsertRecharge(this.state.rechargeDetail.RechargeAmount).then((data) => {
                                if (data.SysNo>0) {
                                  this.context.router.push(`/recharge/${data.SysNo}`)
                                } else {
                                    throwError(data.Message);
                                }
                            }).catch(() => {

                            });}
                        }

                        }><input type="button" value="立即充值"/></p>

                    </section>
                </Content>
            </PageLayout>
        );
    }
}