

import PageLayout from "components/page-layout.jsx";
import {Header, Content} from "components/header.jsx";
import rechargeService from "service/recharge.service.jsx";
import PageListView2 from "components/page-list-view2.jsx";


require("assets/css/article.css");
class rechargeList extends React.Component {

    static get propTypes() {
        return {
            data: React.PropTypes.object
        };
    }

    static get contextTypes() {
        return {
            router:React.PropTypes.object.isRequired
        }
    }

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <li className="box-line-t box-line-b">
                <div onClick={()=>{
                 if(this.props.data.RechargeStatus===0) {
						this.context.router.push(`/recharge/${this.props.data.SysNo}`)
                                 }
                        else {
                        showMessage("该充值单状态不是未支付！");
                    }}}>
                    <div>
                        <p>{this.props.data.RechargeActionStr}</p>
                        <span>{this.props.data.InDateStr}</span>
                    </div>

                    <em className="cz_status">{this.props.data.RechargeStatusStr}</em>
                    <em className="cz_price">{this.props.data.RechargeAmount}</em>
                </div>
            </li>

        )
    }
}
/* 充值列表
**/
export class RechargeIndex extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageData: [],
            totalRecordCount: 0
        };
    }
    getPageData(pageindex) {
        rechargeService.getRechargeListData(pageindex).then((res)=> {
            let newState = Object.assign({}, this.state);
            newState.pageData = res.data;
            newState.totalRecordCount = res.recordsTotal;
            this.setState(newState);
        });
    }
	

    static get contextTypes(){
        return {
            router:React.PropTypes.object.isRequired
        };
    }
	
    render() {
        return (
            <PageLayout>
                <section id="white_header">
                    <div className="header">
                        <a className="return" onClick={()=>{
                            this.context.router.push("/");
                        }}></a>
                        <h3>明细</h3>
                        <a className="right_link" onClick={()=>{
                           this.context.router.push({pathname:"/mine/recharge",state: {target:"/"}});
                        }}>充值</a>
                    </div>
                </section>
                    <section className="chongzhi mt10">
                            <ul>
                                <PageListView2 template={rechargeList}
                                               onGetPageData={(pageIndex)=>this.getPageData(pageIndex)}
                                               clearOldData={false}
                                               pageData={this.state.pageData}
                                               totalRecordCount={this.state.totalRecordCount}/>
                            </ul>
                    </section>
            </PageLayout>
        )
    }
}