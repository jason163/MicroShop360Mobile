import PageLayout from "components/page-layout.jsx";
import {Header, Content} from "components/header.jsx";
import InfoService from "service/info.service.jsx";
import PageListView from "components/page-list-view.jsx";
import wxShare from "utility/wx-share.jsx";


require("assets/css/article.css");
export class infoDetail extends React.Component {
    static get contextTypes() {
        return {
            router: React.PropTypes.object.isRequired
        };
    }
    static get propTypes() {
        return {
            params: React.PropTypes.any,
            location: React.PropTypes.any


        };
    }
    constructor(props) {
        super(props);
        this.state = {
            sysNo: this.props.params.id
            , helperData: {}
        }
    }

    componentDidMount() {
        let sysNo = this.state.sysNo;
        InfoService.getHelperDetail(sysNo).then((data)=> {
            let newState = Object.assign({}, this.state);
            newState.helperData = data;
            this.setState(newState);
            // weixin share for ci 1
            let imgShare = `http://image.great-land.net/${data.DefaultImage}`
            let shareInfo = {feed_id:sysNo,title:data.Title,Desc:data.Summary,img_share:imgShare,redirectUrl:location.href};
            wxShare(shareInfo,function () {

            })
        });

    }
    render() {
        return(
            <PageLayout>
                <Header>文章详情</Header>
                <Content>
                    <section className="article_con">
                        <div className="tit box-line-b">
                            <h5>{this.state.helperData.Title}</h5>
                            <p><span className="colorGrey mr10">{this.state.helperData.PublishDateStr}</span><span className="colorGrey">阅读 {this.state.helperData.PageViews}</span></p>
                        </div>
                        <div className="text">
                            <p dangerouslySetInnerHTML={{__html:this.state.helperData.Content}}></p>
                        </div>
                    </section>
                </Content>
            </PageLayout>
        );
    }
}
