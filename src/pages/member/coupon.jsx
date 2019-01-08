
import {Header, Content} from "components/header.jsx";
import PageLayout from "components/page-layout.jsx";
import {ListView, CouponCell} from "bm/list-view.jsx"
import PageListView2 from "components/page-list-view2.jsx";
import Loading from "components/loading.jsx";
import ser from "service/coupon.service.jsx"
require("assets/css/base.css");
require("assets/css/form.css");

export default class CouponPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            couponList: [],
            totalRecordCount:0
        };
    }

    getPageData(pageIndex) {
        ser.getCouponList(pageIndex).then(res => {
            this.refs.loading.loaded();
            this.setState({
                couponList: res.data,
                clearOldData:false,
                totalRecordCount: res.recordsTotal
            });
        }).catch(() => {
            this.refs.loading.loaded();
        })
    }

    render() {
        return (
            <PageLayout>
                <Header showBackButton={true}>优惠券</Header>
                <Content>
                <section className="coupons mt10">
                    <PageListView2 template={CouponCell}
                                   onGetPageData={(pageIndex) => this.getPageData(pageIndex) }
                                   pageData={this.state.couponList}
                                   totalRecordCount={this.state.totalRecordCount}/>
                </section>
                </Content>
                <Loading ref="loading"></Loading>
            </PageLayout>
        );
    }

}