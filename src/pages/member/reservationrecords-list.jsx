

import PageLayout from "components/page-layout.jsx";
import {Header, Content} from "components/header.jsx";
import service from "service/mine.service.jsx";
import PageListView2 from "components/page-list-view2.jsx";


require("assets/css/article.css");
export class reservationRecordsList extends React.Component {

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
            ReservationStatus: 0,
            ReservationStatusStr: ""
        }
    }
    componentWillMount() {
        this.setState({
            ReservationStatus: this.props.data.ReservationStatus,
            ReservationStatusStr: this.props.data.ReservationStatusStr
        })
    }

    render() {
        return (
            <li className="box-line-t box-line-b">
                <div>
                    <p>商品名称：{this.props.data.ProductName}</p>
                    <span className="mr10">预约日期：<em>{this.props.data.ReservationDateStr}</em></span>
                    <p>
                        <span className="mr10">备注：<em>{this.props.data.Memo}</em></span>
                    </p>
                </div>
                <div className="btnlink mt10">
                 {this.state.ReservationStatusStr}
                </div>
            </li>
        )
    }
}
/* 消费记录
**/
export class ReservationIndex extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageData: [],
            totalRecordCount: 0
        };
    }
    getPageData(pageindex) {
        service.getreservationlist(pageindex).then((res)=> {
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
                        <h3>预约记录</h3>
                        <a className="right_link" onClick={()=>{
                           this.context.router.push({pathname:"/mine/reservationRecords",state: {target:"/"}});
                        }}>新增预约</a>
                    </div>
                </section>
                    <section className="xiaofeijilu mt10">
                            <ul>
                                <PageListView2 template={reservationRecordsList}
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