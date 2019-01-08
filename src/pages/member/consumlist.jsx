

import PageLayout from "components/page-layout.jsx";
import {Header, Content} from "components/header.jsx";
import service from "service/mine.service.jsx";
import PageListView2 from "components/page-list-view2.jsx";
import Rate from 'antd/lib/rate'
require("assets/css/star.css");
require("assets/css/article.css");

export class consumList extends React.Component {

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
        this.state = {
            NursingDiaryStatus: 0,
            NursingDiaryStatusStr: "",
            NursingDiaryRate:5
        }
    }
    componentWillMount() {
        this.setState({
            NursingDiaryStatus: this.props.data.NursingDiaryStatus,
            NursingDiaryStatusStr: this.props.data.NursingDiaryStatusStr,
            NursingDiaryRate: this.props.data.NursingDiaryRate
        })
    }

    handleRateChange(value) {
        let newState = this.state;
        newState.NursingDiaryRate = value;
        this.setState(newState);
    }

    render() {
        let rate;
        if(this.state.NursingDiaryStatus ===0){
            rate = <Rate defaultValue={5} onChange={(value)=>{
                this.handleRateChange(value);
            }} allowHalf={false}/>;
        }else {
            rate = <Rate defaultValue={this.state.NursingDiaryRate} allowHalf={false} disabled/>;
        }
        return (
            <li className="box-line-t box-line-b">
                <div>
                    <p>商品名称：{this.props.data.ProductName}</p>
                    <span className="mr10">总消费次数：<em>{this.props.data.UseTime}</em></span>
                    <span className="mr10">本次消费次数：<em>{this.props.data.UsedQuantity}</em></span>
                    <span className="mr10">消费日期：<em>{this.props.data.NursingDateStr}</em></span>
                </div>
                <div className="btnlink mt10">
                    <p>评分:{rate}</p>
                    <a className="bntlinered" onClick={(ev)=>{
                    if(this.state.NursingDiaryStatus===0)
                    {
                    confirmBox({
                                message: '确定确认该条消费记录？',
                                onConfirm:()=>{
                                     service.confirmconsum(this.props.data.SysNo,this.state.NursingDiaryRate).then(response=> {
                                            confirmBox({});
                                            this.setState({
                                             NursingDiaryStatus:1,
                                             NursingDiaryStatusStr: "已确认"
                                         })
                                    });
                                },
                                onCancel:()=>{confirmBox({});}
                            });
            }
            }
            }>{this.state.NursingDiaryStatusStr}</a>
                </div>
            </li>
        )
    }
}
/* 消费记录
**/
export class ConsumIndex extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageData: [],
            totalRecordCount: 0
        };
    }
    getPageData(pageindex) {
        service.getconsumlist(pageindex).then((res)=> {
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
                        <h3>消费记录</h3>
                    </div>
                </section>
                    <section className="xiaofeijilu mt10">
                            <ul>
                                <PageListView2 template={consumList}
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