
import PageLayout from "components/page-layout.jsx";
import {Header, Content} from "components/header.jsx";
import InfoService from "service/info.service.jsx";
import PageListView2 from "components/page-list-view2.jsx";

require("assets/css/article.css");
class itemList extends React.Component {

    static get propTypes() {
        return {
            data: React.PropTypes.object
        };
    }

    static get contextTypes() {
        return {
            router:React.PropTypes.object.isRequired
        };
    }

    constructor(props) {
        super(props);
    }

    render() {
        return (
        <li className="haveimg">
            <div onClick={()=>{
						this.context.router.push({
                                     pathname: `/infodetail/${this.props.data.SysNo}`
                                     // state: {
                                     //     sysNo:this.props.data.SysNo
                                     // }
                                 });
					} }>
                 <div className="text">
                    <p className="tit">{this.props.data.Title}</p>
                    <p className="con">{this.props.data.Summary}</p>
                     <p className="date colorGrey">{this.props.data.PublishDateStr}</p>
                     <i className="img" style={{backgroundImage:`url(${this.props.data.DefaultImageUrl})`}}></i>
                 </div>

            </div>
        </li>
        )
    }
}
/* 文章列表1
**/
export class InfoIndex extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pageData: [],
            totalRecordCount: 0
        };
    }

    getHeaderText(){
        let header = "文章列表";
        let type = this.props.params.type;
        if(type==="1"){
            header="动   态";
        }else if(type==="2"){
            header="养    生";
        }else if(type==="3"){
            header="美    容";
        }else if(type==="4"){
            header="享    利";
        }else if(type==="5"){
            header="有    約";
        }else if(type==="6"){
            header="私人定制";
        }
        return header;
    }

    getPageData(idx){
        let t = this.props.params.type;
        InfoService.getInfoListData(t,idx).then((res)=> {
            let newState = Object.assign({}, this.state);
            newState.pageData = res.data;
            newState.totalRecordCount = res.recordsTotal;
            this.setState(newState);
        });
    }

    render() {
        let headerText = this.getHeaderText();
        return (
            <PageLayout>
                <Header>{headerText}</Header>
                <Content>
                    <section className="article_list_con">
                        <PageListView2 template={itemList}
                                       onGetPageData={(pageIndex)=>this.getPageData(pageIndex)}
                                       clearOldData={false}
                                       pageData={this.state.pageData}
                                       totalRecordCount={this.state.totalRecordCount}/>
                    </section>
                </Content>
            </PageLayout>
        )
    }
}
