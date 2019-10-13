import PageLayout from "components/page-layout.jsx";
import {Header, Content} from "components/header.jsx";
import authService from "service/auth.service.jsx";
import * as handler from "utility/handler.jsx";

require("assets/css/base.css");
require("assets/css/account.css");
require("assets/css/accountindex.css");

export class Setting extends React.Component {
    static get contextTypes() {
        return {
            router: React.PropTypes.object.isRequired
        };
    }

    render() {
        return (
            <PageLayout>
                <Header>更多</Header>
                <section className="centerper_list c_set mt10">
                    <div className="centerper_item box-line-t">
                 

                        <div className="box-line-b">
                            <a className="c_list clearFix" onClick={()=> {
            this.context.router.push("/about")
        }}>
                                <span>关于讯驰商城</span>
                            </a>
                        </div>
                        <div className="box-line-b">
                            <a className="c_list clearFix" onClick={()=> {
            this.context.router.push("/mine/changepwd")
        }}>
                                <span>修改密码</span>
                            </a>
                        </div>
                        {handler.default.isWechat &&
                        <div className="box-line-b">
                            <a className="c_list clearFix" onClick={()=> {
            authService.logout();
            this.context.router.replace("/");
        }}>
                                <span>退出账号</span>
                            </a>
                        </div>}
                    </div>
                </section>
            </PageLayout>
        );
    }
}

export class About extends React.Component {
    render() {
        return (
            <PageLayout>
                <Header>关于讯驰商城</Header>
                <Content>
                    <section className="center_details mt10 mb10">
                        <div className="center_details_con box-line-t box-line-b">
                            <h2 className="tit">讯驰商城简介</h2>
                            <div className="text">
                                <p>讯驰商城是一个集线上销售和线下服务的电子商务平台。 讯驰商城是金恩讯科技有限公司针对新零售提供的一套电子商务平台解决方案，
                                    我们以服务客户为中心，以客户需求为向导，提供一系列定制化开化服务。</p>

                                <p>我们提供一整套移动电商解决方案，包含 APP、微信商城、微信小程序，让用户随时随地感受到商家提供的优质服务</p>

                                <p>我们提供全面标准的电商解决方案，品牌管理、品类管理、商品管理、订单管理、财务管理、采购管理等</p>

                                <p>我们是年轻并有丰富电商行业经验和深厚的技术底蕴，产品团队来自电商行业专家，技术团队来从有电商黄埔军校之称的新蛋科技</p>
                                <p>整个团队拥有专业电商及跨境电商行业经验，欢迎一起共谋新零售之路</p>

                                <p>有疑问请联系客服，联系方式 QQ：23023204，微信：18922890759 </p>
                            </div>
                        </div>
                    </section>
                </Content>
            </PageLayout>
        );
    }
}
