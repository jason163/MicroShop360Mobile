import PageLayout from "components/page-layout.jsx";
import {Header, Content} from "components/header.jsx";
import authService from "service/auth.service.jsx";

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
                                <span>关于四季美</span>
                            </a>
                        </div>
                        <div className="box-line-b">
                            <a className="c_list clearFix" onClick={()=> {
            this.context.router.push("/mine/changepwd")
        }}>
                                <span>修改密码</span>
                            </a>
                        </div>
                        <div className="box-line-b">
                            <a className="c_list clearFix" onClick={()=> {
            authService.logout();
            this.context.router.replace("/");
        }}>
                                <span>退出账号</span>
                            </a>
                        </div>
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
                <Header>关于四季美</Header>
                <Content>
                    <section className="center_details mt10 mb10">
                        <div className="center_details_con box-line-t box-line-b">
                            <h2 className="tit">四季美简介</h2>
                            <div className="text">
                                <p>四季美是一个集线上销售和线下服务的电子商务平台。销售商品包括百货类和服务类，主要是面部,身体洗护保养产品以及线下门店的一些护理服务等</p>

                                <p>四季美拥有丰富优质的商品资源，包括：化妆品、母婴用品、轻奢品、食品等。四季美致力于为消费者提供便捷优质的线上线下购物体验。</p>

                            </div>
                        </div>
                    </section>
                </Content>
            </PageLayout>
        );
    }
}
