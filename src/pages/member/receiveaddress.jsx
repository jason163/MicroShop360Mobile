import PageLayout from "components/page-layout.jsx";
import {Header, Content} from "components/header.jsx";
import PageListView2 from "components/page-list-view2.jsx"
import Loading from "components/loading.jsx";
import AddressService from "service/shippingaddress.service.jsx";
require("assets/css/base.css");
require("assets/css/form.css");

class AddressSummary extends React.Component {

    static get propTypes() {
        return {
            data: React.PropTypes.object,
            key:React.PropTypes.object,
            removeCallBack:React.PropTypes.func
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

    isDefault() {

        if (this.props.data.IsDefault) {
            return (
                <span className="colorRed fl">默认地址</span>
            )
        }

        return null;
    }

    render() {
        return (
            <div className="address_item mb5 box-line-t box-line-b" key={this.props.key}>
                <p onClick={() => {
                    this.context.router.goBack();
                } }><span>{this.props.data.ReceiveName}</span><span>{this.props.data.ReceiveCellPhone}</span></p>
                <p>{this.props.data.DistrictName}{this.props.data.ReceiveAddress}</p>
                <div className="add_opera clearFix mt10">
                    { this.isDefault() }
                    <a className="fr" onClick = {() => {
                        confirmBox({
                                message: '确定删除该地址？',
                                onConfirm:()=>{
                                    AddressService.deleteAddress(this.props.data.SysNo, (isSuccess) => {
                                        confirmBox({});
                                        if (isSuccess) {
                                            this.props.removeCallBack(this.props.data.SysNo);
                                        }
                                    })
                                },
                                onCancel:()=>{confirmBox({});}
                            });                        
                    } }>删除</a>
                    <a className="fr ml5" onClick={() => {
                        this.context.router.push({
                            pathname: "/mine/receiveaddress/detail",
                            state: {
                                addressSysNo: this.props.data.SysNo,
                                type: 'M',
                                saveCallBack: (response) => {
                                    if (response.Success) {
                                        history.go(-1);
                                    }
                                }
                            }
                        })
                    } }>编辑</a>
                </div>
            </div>
        )
    }
}

export default class AddressList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pageData:[],
            goPage: null,
            totalRecordCount:0
        }
    }

    static get contextTypes() {
        return {
            router: React.PropTypes.object.isRequired
        };
    }

    getPageData(pageIndex) {
        AddressService.getAddressList(pageIndex).then(res => {
            this.refs.loading.loaded();
            this.setState({
                pageData: res.data,
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
                <Header>收货地址管理</Header>
                <Content>
                    <section className="c_address_list mt10">
                        <PageListView2 template={AddressSummary}
                                       onGetPageData={(pageIndex) => this.getPageData(pageIndex) }
                                       pageData={this.state.pageData}
                                       totalRecordCount={this.state.totalRecordCount}/>
                        <div className="btnlink"><a className="btnredbg" onClick={
                            () => {
                                this.context.router.push({
                                    pathname: '/mine/receiveaddress/detail',
                                    state: {
                                        type: "N",
                                        saveCallBack: (response) => {
                                            if (response.Success) {
                                                history.go(-1);
                                            }
                                        }
                                    }
                                })
                            }
                        }>+ 新增收货地址</a></div>
                    </section>
                </Content>
                <Loading ref="loading"></Loading>
            </PageLayout>
        )
    }
}


