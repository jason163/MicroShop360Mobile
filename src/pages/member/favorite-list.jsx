import {Header} from "components/header.jsx";
import service from "service/mine.service.jsx";
import {Link} from "react-router"
import PageLayout from "components/page-layout.jsx";
import PageListView2 from "components/page-list-view2.jsx";


export class FavoriteCell extends React.Component {
    static propTypes() {
        return {
            data: React.PropTypes.any,
            removeCallBack:React.PropTypes.func
        };
    }
    static get contextTypes() {
        return {
            router: React.PropTypes.object.isRequired
        }
    }
    render() {
        return (
            <li>
                <div className="c_coll_item box-line-t box-line-b mb5">
                    <a className="pro clearFix">
                        <img src={this.props.data.ProductPic} onClick={()=>{
                    this.context.router.push(`/product/${this.props.data.ProductSysNo}`)
                }}/>
                        <p className="name" onClick={()=>{
                    this.context.router.push(`/product/${this.props.data.ProductSysNo}`)
                }}>{this.props.data.ProductName}</p>
                        <p className="mt5">
                            <span className="c_price">价格：<em>{this.props.data.ProductPrice}</em></span>
                        </p>
                    </a>
                    <div className="btn_del" onClick={(ev)=>{
                     service.removefavoriteproduct(this.props.data.ProductSysNo).then((res)=> {
                        this.props.removeCallBack(this.props.data.SysNo);
                     });
            }}>
                    </div>
                </div>
            </li>
        );
    }
}

export default class FavoriteList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageData: [],
            totalRecordCount: 0
        };
    }

    getPageData(pageindex) {
        service.queryfavoriteproduct(pageindex).then((res)=> {
            let newState = Object.assign({}, this.state);
            newState.pageData = res.data;
            newState.totalRecordCount = res.recordsTotal;
            this.setState(newState);
        });
    }

    render() {
        return (
            <PageLayout>
                <Header>我的收藏</Header>
                <section className="c_collection mt10 mb10">
                    <PageListView2 template={FavoriteCell}
                                   onGetPageData={(pageIndex)=>this.getPageData(pageIndex)}
                                   clearOldData={false}
                                   pageData={this.state.pageData}
                                   totalRecordCount={this.state.totalRecordCount}/>
                </section>

            </PageLayout>
        );
    }
}
