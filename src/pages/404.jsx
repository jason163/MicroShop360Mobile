import PageLayout from "components/page-layout.jsx";
import {Header} from "components/header.jsx";

require("assets/css/base.css");
require("assets/css/error.css");

class NoMatch extends React.Component {
    static get contextTypes() {
        return {
            router: React.PropTypes.object.isRequired
        };
    }

    render() {
        return (
            <PageLayout>
                <Header>出错了</Header>
                <section className="errorpage">
                    <div className="errorpage_con">
                        <img src={require("assets/img/errorbg.png")}/>
                        <p className="text">
                            可能原因：<br />
                            网络信号弱<br />
                            找不到请求页面<br />
                            输入网址不正确

                        </p>
                        <p className="error_link">
                            <a href="#" className="e_refresh"><i></i>刷新</a><a onClick={()=>{
						this.context.router.goBack();
					}} className="e_return"><i></i>返回</a>
                        </p>
                    </div>

                </section>
            </PageLayout>
        );
    }
}

export default NoMatch;