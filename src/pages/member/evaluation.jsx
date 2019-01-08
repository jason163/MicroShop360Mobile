import PageLayout from "components/page-layout.jsx";
import {Header, Content} from "components/header.jsx";
import ImageUpload from "bm/image-upload.jsx";
import Loading from "components/loading.jsx";
import OrderService from "service/order.service.jsx";
import keys from "config/keys.config.json";
import {setSessionCache} from "utility/storage.jsx";
import appConfig from "config/app.config.json";
import Rate from 'antd/lib/rate'
require("assets/css/star.css");


export default class Evaluation extends React.Component {
    static get propTypes() {
        return {
            location: React.PropTypes.any
        };
    }

    static get contextTypes() {
        return {
            router: React.PropTypes.object.isRequired
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            SoItem: Object.is(this.props.location.state, null) || Object.is(this.props.location.state.SoItem, undefined) ? {} : this.props.location.state.SoItem,
            EvaluationInfo: {
                Score: 0,
                Content: "",
                Pictures: []
            },
            Editable: true,
            IsFirstLoad: true
        }
        this.GoingToSubmit = false;
    }

    componentWillMount() {
        if (this.props.location.state === null) {
            setSessionCache(keys.tabPageActive, 3);
            this.context.router.push({
                pathname: "/"
            })
        }
    }

    componentDidMount() {
        this.refreashState();
    }

    refreashState() {
        let newState = this.state;
        OrderService.getProductComment(this.state.SoItem.SOSysNo, this.state.SoItem.ProductSysNo).then(response=> {
            if (!Object.is(response.body, null)) {
                newState.EvaluationInfo.Score = response.body.Rate;
                newState.EvaluationInfo.Content = response.body.Comment;
                newState.EvaluationInfo.Pictures = response.body.Pictures;
                newState.Editable = false;
                newState.IsFirstLoad = false;
                this.setState(newState);
            } else {
                newState.IsFirstLoad = false;
                this.setState(newState);
            }
            this.refs.loading.loaded();
        });
    }

    handleChange(value) {
        let newState = this.state;
        newState.EvaluationInfo.Score = value;
        this.setState(newState);
    }

    commitEvaluation() {
        if (!this.GoingToSubmit) {
            let newState = this.state;
            newState.EvaluationInfo.Content = document.getElementsByClassName("evaluation-content")[0].value;
            let request = {
                SOSysNo: newState.SoItem.SOSysNo,
                ProductSysNo: newState.SoItem.ProductSysNo,
                Rate: newState.EvaluationInfo.Score,
                Comment: newState.EvaluationInfo.Content
            };
            let pics = "";
            newState.EvaluationInfo.Pictures.map(pic=> {
                pics += `${pic},`
            });
            if (pics.length > 0) {
                pics = pics.substr(0, pics.length - 1);
            }
            if (!Object.is(newState.EvaluationInfo.Content, "")) {
                this.GoingToSubmit = true;
                this.refs.loading.loading();
                request = Object.assign({}, request, {Pics: pics});
                OrderService.createComment(request).then(response=> {                   
                    if (response.body.Success) {
                        showMessage("评价成功！");
                        this.refreashState();
                    }
                    else {
                        this.refs.loading.loaded();
                        showMessage(response.body.Message);
                    }
                }).catch(() => {
                    this.refs.loading.loaded();
                })
                this.GoingToSubmit = false;
            }
            else {
                showMessage("请填写评价内容！");
            }
        }
    }

    render() {
        let that = this;
        let pics;
        let rate;
        let evaluationcontent;
        let uploaderinput;
        let commitbtn;
        if (that.state.Editable) {
            rate = <Rate onChange={(value)=>{
                                    that.handleChange(value);
                                }} allowHalf={true}/>;
            evaluationcontent = <textarea className="evaluation-content" placeholder="评价内容" maxLength="500"></textarea>;
            if (!that.state.IsFirstLoad) {
                uploaderinput = <ImageUpload uploadtype={'comment'} callback={(imgList)=>{
                                      let newState = Object.assign({}, that.state);
                                      newState.EvaluationInfo.Pictures=imgList;
                                      that.setState(newState);
                                }} imgList={that.state.EvaluationInfo.Pictures}/>;
                commitbtn = <div className="btnlink mt20 mb10"><a className="btnredbg" onClick={()=>{
                                that.commitEvaluation();
                            }}>提交评价</a></div>;
            }
        }
        else {
            pics = that.state.EvaluationInfo.Pictures.map((picpath, index)=> {
                let imgpath = picpath;
                if (!picpath.startsWith(appConfig.contentSourceUrl)) {
                    imgpath = appConfig.contentSourceUrl + picpath;
                }

                return <li key={index}>
                    <a style={{backgroundImage:`url(${imgpath})`}}></a>
                </li>
            });
            rate = <Rate value={this.state.EvaluationInfo.Score} allowHalf={true} disabled/>;
            evaluationcontent =
                <textarea className="evaluation-content" placeholder="评价内容" value={that.state.EvaluationInfo.Content}
                          readOnly></textarea>;
        }
        return (
            <PageLayout>
                <Header>商品评价</Header>
                <Content>
                    <section className="c_evaluation mt10 box-line-t box-line-b">
                        <div className="c_eval_pro clearFix">
                            <img src={that.state.SoItem.ProductImg} onClick={()=>{
                    this.context.router.push(`/product/${that.state.SoItem.ProductSysNo}`)
                }}/>
                            <p className="name" onClick={()=>{
                    this.context.router.push(`/product/${that.state.SoItem.ProductSysNo}`)
                }}>{that.state.SoItem.ProductName}</p>
                            <p className="c_price"><em>{that.state.SoItem.CurrentPrice}</em></p>
                        </div>
                        <div className="c_eval_con mt10">
                            <div className="c_eval_score box-line-t">
                                评分：
                                {rate}
                                <span className="colorGrey ml5">{that.state.EvaluationInfo.Score}分</span>
                            </div>
                            <div className="c_eval_textarea">
                                {evaluationcontent}
                            </div>
                            <div className="c_eval_photo mt10">
                                <ul className="clearFix">
                                    {pics}
                                    {uploaderinput}
                                </ul>
                            </div>
                            {commitbtn}
                        </div>
                    </section>
                </Content>
                <Loading ref="loading" isModal={true}></Loading>
            </PageLayout>
        )
    }

}