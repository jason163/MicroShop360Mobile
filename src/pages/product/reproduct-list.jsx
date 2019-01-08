import PageLayout from "components/page-layout.jsx";
import {Header, Content} from "components/header.jsx";
import PageListView2 from "components/page-list-view2.jsx";
import RPCell from "bm/recommendproduct-item.jsx"
import CountdownService from "service/promotion.service.jsx"

export default class RecommendProductPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            totalRecord: 0
            , pageData: []
        }
    }

    componentWillMount() {
    }

    componentWillUnmount(){
    }

    getPageData(pageIndex) {
        CountdownService.getRecommendProductList(pageIndex, 10).then((result)=> {
            let newState = Object.assign({}, this.state);
            newState.totalRecord = result.recordsTotal;
            newState.pageData = result.data;
            this.setState(newState);
        });
    }

    render() {
        return (
            <PageLayout>
                <Header>推荐商品</Header>
                <Content>
                    <section className="flash_sale box-line-t2 mt10">
                        <div className="bd list_con">
                            <PageListView2 template={RPCell} totalRecordCount={this.state.totalRecord}
                                           pageData={this.state.pageData}
                                           clearOldData={false}
                                           onGetPageData={(pageIndex)=>this.getPageData(pageIndex)}/>
                    </div>
                    </section>

                </Content>
            </PageLayout>
        );
    }
}