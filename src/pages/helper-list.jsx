/**
 * Created by liu.yao on 2016/6/24.
 */
import PageLayout from "components/page-layout.jsx";
import {Header, Content} from "components/header.jsx";
import helperService from "service/helper.service.jsx";
import PageListView from "components/page-list-view.jsx"


class HelperCell extends React.Component {

    static get propTypes() {
        return {
            data: React.PropTypes.object
        };
    }

    static get contextTypes() {
        return {
            router: React.PropTypes.object.isRequired
        };
    }

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <li>
                <div className="box-line-b" onClick={()=>{
						this.context.router.push({
                                     pathname: `/helperList/helperDetail`
                                     , state: {
                                         sysNo:this.props.data.SysNo
                                     }
                                 });
					}}>
                    <a className="c_list clearFix">
                        <div className="c_list_left"><span>{this.props.data.Title}</span></div>
                        <div className="c_list_right"><span className="c_arrow_r"></span></div>
                    </a>
                </div>
            </li>
        )
    }
}
/**
 * 购物指南列表
 */
export class HelperIndex extends React.Component {

    static get contextTypes() {
        return {
            router: React.PropTypes.object.isRequired
        };
    }

    render() {
        let listItemOption = {
            template: HelperCell,
            ajaxUrl: '/Topic/GetHelperList',
            ajaxCallback: (res)=> {
                // res是请求的response.用户可以在里面对数据做相应的处理。
                // 把处理好后的数据return出来。组件会将返回的数据push到界面上
                return res.body.Data.data;
            },
            container: 'layer'
        }
        return (
            <PageLayout>
                <Header>购物指南</Header>
                <Content>
                    <section className="centerper_list center_list mt10">
                        <div className="centerper_item box-line-t">
                            <ul>
                                <PageListView options={listItemOption}/>
                            </ul>
                        </div>
                    </section>
                </Content>
            </PageLayout>
        )
    }
}
/**
 * 指南详情面
 */
export class HelperDetail extends React.Component {
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
            sysNo: this.props.location.state.sysNo
            , helperData: {}
        }
    }


    componentDidMount() {
        let sysNo = this.state.sysNo
        helperService.getHelperDetail(sysNo).then((data)=> {
            let newState = Object.assign({}, this.state);
            newState.helperData = data;
            this.setState(newState);
        });

    }

    render() {
        return (
            <PageLayout>
                <Header>指南详情</Header>
                <Content>
                    <section className="center_details mt10 mb10">
                        <div className="center_details_con box-line-t box-line-b">
                            <h2 className="tit">{this.state.helperData.Title}</h2>
                            <div className="text">
                                <p dangerouslySetInnerHTML={{__html:this.state.helperData.Content}}></p>
                            </div>
                        </div>
                    </section>
                </Content>
            </PageLayout>
        );
    }
}

