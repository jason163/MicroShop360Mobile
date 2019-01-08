/**
 * Created by duguk on 2016/6/25.
 */
import PageLayout from "components/page-layout.jsx";
import CategoryService from "service/category.service.jsx";
import * as Cache from "utility/storage.jsx";
import keys from "config/keys.config.json";
require("assets/css/base.css");
require("assets/css/product.css");

export class SubCategoryList extends React.Component{
    static get propTypes() {
        return {
            dataSource:React.PropTypes.array,
            template:React.PropTypes.any
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            dataSource: []
        }
    }

    static get contextTypes(){
        return{
            router:React.PropTypes.object.isRequired
        }
    }

    componentWillReceiveProps(nextProps)
    {
        this.setState({
            dataSource:nextProps.dataSource
        });
    }


    render() {
        let that = this;

        let contentList = that.state.dataSource.map((data,index) => {
            var noPicUrl = data.DefaultImage;
            if(data.DefaultImage=="http://118.178.18.118:8091//NoPicture.png"){
                noPicUrl = require("assets/img/logo.png");
            }
            return (
                <li key={index} onClick={()=>{
                that.context.router.push({
                    pathname:"/search",
                    state:{
                    SearchArgs:{
                        ctg:data.Name
                        }
                    }
                })
            }}>
                    <a><i style={{backgroundImage:`url(${noPicUrl})`}}/>
                        <em>{data.Name}</em>
                    </a>
                </li>
            )
        })

        return (
            <div className="tabc">
                <ul className="clearFix">
                    {contentList}
                </ul>
            </div>
        )
    }
}

export default class Categorizer extends React.Component{
    static get propTypes() {
        return {
            goBackCallback:React.PropTypes.func
        }
    }

    static get contextTypes() {
        return {
            router: React.PropTypes.object.isRequired
        };
    }

    constructor(props) {
        super(props);
        this.state = {
            TopCategories:[],
            SubCategories:[]
        }
    }

    componentDidMount(){
        let newState={};
        CategoryService.loadTopCategories().then(response=>
        {
            newState=Object.assign({},this.state,{TopCategories:response.body});
            if(!Object.is(newState,null)&&!Object.is(newState,undefined)&&
                !Object.is(newState.TopCategories,null)&&!Object.is(newState.TopCategories,undefined)&&newState.TopCategories.length>0) {
                let newTcs=[];
                newState.TopCategories.map((tc,index)=>{
                    if(index===0)
                    {
                        let newTc = Object.assign({}, tc, {IsActive: true});
                        newTcs.push(newTc);
                    }
                    else {
                        let newTc = Object.assign({}, tc, {IsActive: false});
                        newTcs.push(newTc);
                    }
                });
                newState=Object.assign({},this.state,{TopCategories:newTcs});
                CategoryService.loadCategoriesByParentCategoryCode(newState.TopCategories[0].CategoryCode).then(res=>{
                    newState=Object.assign({},newState,{SubCategories:res.body});
                    this.setState(Object.assign({},this.state,newState));
                })
            }
        })
    }

    refreshCategories(parentCategorySysNo)
    {
        CategoryService.loadCategoriesByParentCategoryCode(parentCategorySysNo).then(response=>{
            let newTcs=[];
            this.state.TopCategories.map(tc=>{
               if(tc.CategoryCode===parentCategorySysNo)
               {
                   let newTc = Object.assign({}, tc, {IsActive: true});
                   newTcs.push(newTc);
               }
               else {
                   let newTc = Object.assign({}, tc, {IsActive: false});
                   newTcs.push(newTc);
               }
            });
            let newState=Object.assign({},this.state,{TopCategories:newTcs,SubCategories:response.body});
            this.setState(Object.assign({},this.state,newState));
        })
    }

    render() {
        let that = this;
        return (
            <PageLayout isIndex={1}>
                <section id="white_header" className="notfix" >
                    <div className="header">
                        <div className="list_search category_search">
                            <form onSubmit={()=>{
                                    that.context.router.push({
                                pathname:"/search",
                                state:{
                                    SearchArgs:{
                                        keyword:document.getElementsByClassName("searcher-keyword")[0].value
                                        }
                                }
                            });
                                }}><p><input className="searcher-keyword" type="search" placeholder="输入关键字"/>
                               </p></form>
                        </div>
                        <a className="right_link" onClick={()=>{
                            that.context.router.push({
                                pathname:"/search",
                                state:{
                                    SearchArgs:{
                                        keyword:document.getElementsByClassName("searcher-keyword")[0].value
                                        }
                                }
                            })
                        }}>搜索</a>
                    </div>
                </section>
                <section className="category">
                    <div className="catelist clearFix" >
                        <div className="tab">
                            <ul trigger="click">
                                {
                                    this.state.TopCategories.map((tc, index)=> {
                                        return <li key={index} className={tc.IsActive?"current":""} onClick={()=>{
                                        that.refreshCategories(tc.CategoryCode);
                                    }}>
                                            <a>{tc.Name}</a>
                                        </li>
                                    })
                                }
                            </ul>
                        </div>
                        <SubCategoryList dataSource={that.state.SubCategories}/>
                    </div>
                </section>
            </PageLayout>
        )
    }
}