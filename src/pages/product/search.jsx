/**
 * Created by duguk on 2016/6/25.
 */
import PageLayout from "components/page-layout.jsx";
import SearchService from "service/search.service.jsx";

require("assets/css/base.css");
require("assets/css/product.css");

export class ProductList extends React.Component{

    static get propTypes() {
        return {
            dataSource:React.PropTypes.array
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
            dataSource: [],
            isFirstLoad:true
        }
    }

    componentWillReceiveProps(nextProps)
    {
        this.setState({
            dataSource:nextProps.dataSource,
            isFirstLoad:false
        });
    }



    render() {
        let that = this;
        let contentList = that.state.dataSource.map((data,index) => {
            return (
                <li key={index}>
                    <a onClick={()=>{
                    this.context.router.push(`/product/${data.ProductSysNo}`)
                }}>
                        <div className="img" style={{backgroundImage:`url(${data.DefaultImage})`}}></div>
                        <div className="text">
                            <p className="name"><span className="labelred">{data.TradeTypeText}</span>{data.ProductName}</p>
                            <p className="sales_word">{data.PromotionTitle}</p>
                            <p className="price"><span className="mr5"><em>{data.CurrentPrice}</em></span>
                                <del>￥{data.MarketPrice}</del>
                            </p>
                        </div>
                    </a>
                </li>
            )
        });

        let childContent;
        if(!that.state.isFirstLoad){
            childContent=<div className="notfound">
                <p>抱歉，没有找到符合条件的商品</p>
            </div>;
        }
        if (that.state.dataSource.length > 0) {
            childContent =
                <ul className="clearFix">
                    {contentList}
                </ul>
        }

        return <section className="list_con pt40 page-layout-content">
            <section>{childContent}
                <div className="l_more" id='preLoad'>
                    <i>--------</i>上拉查看更多<i>--------</i>
                </div>
            </section>
            </section>
    }
}

export class Filter extends React.Component{
    static get propTypes() {
        return {
            dataSource:React.PropTypes.object,
            researchCallback:React.PropTypes.func
        }
    }

    static get contextTypes() {
        return {
            router: React.PropTypes.object.isRequired
        };
    }

    constructor(props) {
        super(props);
        this.state={
            title:"",
            valueList:[],
            isFilter:true,
            muiltiSelect:false
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState(Object.assign({},nextProps.dataSource,{defaultState:nextProps.dataSource}));
    }

    newGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c)=>{
            let r = Math.random()*16|0, v = c === 'x' ? r : r&0x3|0x8;
            return v.toString(16);
        });
    }

    goBack()
    {
        if(this.state.isFilter)
        {
            let filter = document.getElementsByClassName("filter-expand")[0];
            filter.style.display="none";
        }
        else
        {
            this.setState(this.state.defaultState);
        }
    }

    selectValue(value)
    {
        if(this.state.isFilter)
        {
            this.setState(Object.assign(value.valueList,{defaultState:this.state.defaultState}));
        }
        else
        {
            let oldValueList=this.state.valueList;
            let newValueList=[];
            let count=0;
            oldValueList.map(oldValue=>{
                if(oldValue.item===value.item)
                {
                    if(count===5)
                    {
                        showMessage("最多选择5个哦");
                    }
                    else {
                        newValueList.push({item: value.item, selected: !value.selected});
                        count++;
                    }
                }
                else
                {
                    if(this.state.muiltiSelect) {
                        newValueList.push(oldValue);
                    }
                    else
                    {
                        newValueList.push({item:oldValue.item,selected:false});
                    }
                }
            });
            this.setState({
                valueList:newValueList
            });
        }
    }

    confirm()
    {
        if(this.state.isFilter) {
            let filterArgs = [];
            this.state.valueList.map(value=> {
                if (value.selectedValues.length > 0) {
                    let argValue = "";
                    value.selectedValues.map(sv=> {
                        argValue += `${sv},`;
                    });
                    argValue = argValue.substring(0, argValue.length - 1);
                    filterArgs.push({key: value.key, value: argValue});
                }
            });
            this.props.researchCallback(filterArgs);
            let filter = document.getElementsByClassName("filter-expand")[0];
            filter.style.display="none";
        }
        else
        {
            let selectedValues=[];
            this.state.valueList.map(value=>{
                if(value.selected)
                {
                    selectedValues.push(value.item);
                }
            });
            let oldValueList=this.state.defaultState.valueList;
            let newValueList=[];
            oldValueList.map(oldValue=>{
                if(oldValue.title===this.state.title)
                {
                    newValueList.push(Object.assign({},oldValue,{selectedValues:selectedValues}));
                }
                else
                {
                    newValueList.push(oldValue);
                }
            });
            let newState=Object.assign({},this.state.defaultState,{valueList:newValueList});
            newState=Object.assign({},newState,{defaultState:newState});
            this.setState(newState);
        }
    }

    clear()
    {
        let valueList=[];
        this.state.valueList.map(value=>{
           valueList.push(Object.assign({},value,{selectedValues:[]}));
        });
        let newState=Object.assign({},this.state,{valueList:valueList});
        newState=Object.assign({},newState,{defaultState:newState});
        this.setState(newState);
    }

    render() {
        let that = this;

        return (
            <section className="shaixuan_layer layer1 filter-expand" style={{display:'none'}}>
                <div className="shaixuan_up">
                    <div className="sx_header">
                        <div className="header">
                            <a className="return" onClick={()=>{
                                that.goBack();
                            }}></a>
                            <h3>{that.state.title}</h3>
                            <a className="right_link" onClick={()=>{
                                that.confirm();
                            }}>确定</a>
                        </div>
                    </div>

                    <div className="sx_list">
                        <div className="box-line-t">
                            <ul>
                                {
                                    that.state.valueList.map(value=> {
                                        let selectedValues = "";
                                        if (that.state.isFilter) {
                                            value.selectedValues.map(sv=> {
                                                selectedValues += `${sv},`;
                                            });
                                            if (selectedValues.length > 0) {
                                                selectedValues = selectedValues.substr(0, selectedValues.length - 1);
                                            }
                                        }
                                        let rightSection;
                                        if (that.state.isFilter) {
                                            rightSection = <div className="c_list_right"><span className="colorGrey c_arrow_r">{selectedValues}</span></div>
                                        }
                                        else {
                                            rightSection = <i className="tick"></i>
                                        }
                                        return <li
                                            className={that.state.isFilter?"sx_list_item":value.selected?"sx_list_item2 sx_list_item2_on":"sx_list_item2"}
                                            key={that.newGuid()} onClick={()=>{
                                        that.selectValue(value);
                                    }}>
                                            <div className="box-line-b"><a className="c_list clearFix">
                                                <div className="c_list_left">
                                                    <span>{that.state.isFilter ? value.title : value.item}</span></div>
                                                {rightSection}
                                            </a></div>
                                        </li>
                                    })
                                }
                                <a className="clear_options" onClick={()=>{
                                    that.clear();
                                }} style={{display:that.state.isFilter?"block":"none"}}>清除选项</a>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

export default class Searcher extends React.Component{
    static get propTypes() {
        return {
            location: React.PropTypes.object
        };
    }

    static get contextTypes() {
        return {
            router: React.PropTypes.object.isRequired
        };
    }

    constructor(props) {
        super(props);
        let searchArgs={
            keyword:"",//关键字
            ctg:"",//分类
            bn:"",//品牌
            cn:"",//国家
            p:"",//分类属性
            tr:"", //贸易类型
            s:10,//排序
            index:1//分页
        };
        if(!Object.is(this.props.location.state,null)&&!Object.is(this.props.location.state.SearchArgs,undefined))
        {
            searchArgs=Object.assign({},searchArgs,this.props.location.state.SearchArgs);
        }
        this.state={
            SearchArgs:searchArgs,
            filterState:{},
            CategoryNames:[],
            BrandNames:[],
            Properties:[],
            Products:[],
            isLoading:false,
            isPriceSorterSelected:searchArgs.s===30,
            isSaleVolumeSorterSelected:searchArgs.s===50
        };
    }

    refreshState(response)
    {
        let newState=Object.assign({},this.state,response.body);
        let filterState = {
            title: "筛选",
            valueList: [],
            isFilter: true,
            muiltiSelect: false
        };

        //分类过滤
        let categoryNameItems = [];
        let categoryArgs=[];
        let cateSelectedValues=[];
        if(!Object.is(this.state.SearchArgs,null)&&!Object.is(this.state.SearchArgs,undefined)&&
            !Object.is(this.state.SearchArgs.ctg,null)&&!Object.is(this.state.SearchArgs.ctg,undefined)&&this.state.SearchArgs.ctg.length>0)
        {
            categoryArgs=this.state.SearchArgs.ctg.split(',');
        }
        newState.CategoryNames.map(categoryName=> {
            let index = categoryArgs.findIndex(category=>{ return category===categoryName});
            categoryNameItems.push({
                item: categoryName,
                selected: index>=0
            });
            if(index>=0)
            {
                cateSelectedValues.push(categoryName);
            }
        });
        filterState.valueList.push({
            title: "分类",
            key:"ctg",
            valueList: {
                title: "分类",
                valueList: categoryNameItems,
                isFilter: false,
                muiltiSelect: true
            },
            selectedValues:cateSelectedValues
        });

        //品牌过滤
        let brandItems = [];
        let brandArgs=[];
        let brandSelectedValues=[];
        if(!Object.is(this.state.SearchArgs,null)&&!Object.is(this.state.SearchArgs,undefined)&&
            !Object.is(this.state.SearchArgs.bn,null)&&!Object.is(this.state.SearchArgs.bn,undefined)&&this.state.SearchArgs.bn.length>0)
        {
            brandArgs=this.state.SearchArgs.bn.split(',');
        }
        newState.BrandNames.map(brandName=> {
            let index = brandArgs.findIndex(brand=>{ return brand===brandName});
            brandItems.push({
                item: brandName,
                selected: index>=0
            });
            if(index>=0)
            {
                brandSelectedValues.push(brandName);
            }
        });
        filterState.valueList.push({
            title: "品牌",
            key:"bn",
            valueList: {
                title: "品牌",
                valueList: brandItems,
                isFilter: false,
                muiltiSelect: true
            },
            selectedValues:brandSelectedValues
        });

        //属性过滤
        let propertyArgs=[];
        if(!Object.is(this.state.SearchArgs,null)&&!Object.is(this.state.SearchArgs,undefined)&&
            !Object.is(this.state.SearchArgs.p,null)&&!Object.is(this.state.SearchArgs.p,undefined)&&this.state.SearchArgs.p.length>0)
        {
            propertyArgs=this.state.SearchArgs.p.split(',');
        }
        newState.Properties.map(property=> {
            let propertyItems = [];
            let propSelectedValues=[];
            property.PropertyValues.map(pv=> {
                let index = propertyArgs.findIndex(prop=>{ return prop===pv});
                propertyItems.push({
                    item: pv,
                    selected: index>=0
                });
                if(index>=0)
                {
                    propSelectedValues.push(pv);
                }
            });
            filterState.valueList.push({
                title: property.PropertyKey,
                key:"p",
                valueList: {
                    title: property.PropertyKey,
                    valueList: propertyItems,
                    isFilter: false,
                    muiltiSelect: false
                },
                selectedValues:propSelectedValues
            });
        });
        this.setState(Object.assign(newState,{filterState:filterState}));
    }

    componentDidMount(){
        SearchService.search(this.state.SearchArgs).then(response=>{
            this.refreshState(response);
            // 第一次加载如何发现数据加载完毕就隐藏底部的加载div
            let preLoad = document.getElementById('preLoad');
            if(preLoad ===null )
            { return;}

            if(response.body.CurrentPage >= response.body.PageAmount) {
                debugger;
                preLoad.style.display = "none";
            }
            else {
                preLoad.style.display = "block";
            }

            let that = this;
            let layOutContent = document;
            layOutContent.addEventListener("scroll", () => {
                if (this.state.isLoading) {
                    return;
                }

                let preLoadTop = preLoad.getBoundingClientRect().top;
                if (preLoadTop > 0 && preLoadTop < window.screen.height - 10) {
                    that.state.isLoading = true;
                    this.state.SearchArgs.index++;
                    SearchService.search(this.state.SearchArgs).then(res=> {
                        res.body.Products.map(product=> {
                            that.state.Products.push(product);
                        });

                        that.setState({
                            Products: that.state.Products
                        });
                        that.setState({isLoading:false});

                        if (res.body.CurrentPage >= res.body.PageAmount) {
                            preLoad.style.display = "none";
                        }
                        else {
                            preLoad.style.display = "block";
                        }
                    });
                }
            });
        });
    }

    search() {
        let searchArgs = Object.assign({}, this.state.SearchArgs, {
            keyword:  document.getElementsByClassName("searcher-keyword")[0].value,//关键字
            ctg: "",//分类
            bn: "",//品牌
            cn: "",//国家
            p: "",//分类属性
            tr:"",//贸易类型
            s: 10,//排序
            index: 1//分页
        });
        this.setState(Object.assign({},this.state,{SearchArgs:searchArgs,isPriceSorterSelected:false,isSaleVolumeSorterSelected:false}));
        let preLoad = document.getElementById('preLoad');
        SearchService.search(searchArgs).then(response=> {
            this.refreshState(response);
            if (response.body.CurrentPage >= response.body.PageAmount) {
                preLoad.style.display = "none";
            }
            else {
                preLoad.style.display = "block";
            }
        });

        let that = this;
        let layOutContent = document;
        let handler=() => {
            if (this.state.isLoading) {
                return;
            }

            let preLoadTop = preLoad.getBoundingClientRect().top;
            if (preLoadTop > 0 && preLoadTop < window.screen.height - 10) {
                that.state.isLoading = true;
                this.state.SearchArgs.index++;
                SearchService.search(this.state.SearchArgs).then(res=> {
                    res.body.Products.map(product=> {
                        that.state.Products.push(product);
                    });

                    that.setState({
                        Products: that.state.Products
                    });
                    that.setState({isLoading:false});

                    if (res.body.CurrentPage >= res.body.PageAmount) {
                        preLoad.style.display = "none";
                    }
                    else {
                        preLoad.style.display = "block";
                    }
                });
            }
        };
        layOutContent.addEventListener("scroll",handler);
    }

    sort(isPriceSorter)
    {//20:售价降序    30:售价升序   40:销量降序   50:销量升序
        let newState={};
        if(isPriceSorter)
        {
            newState=Object.assign({},this.state,{isPriceSorterSelected:!this.state.isPriceSorterSelected,isSaleVolumeSorterSelected:false});
            if(newState.isPriceSorterSelected)
            {
                let searchArgs=Object.assign({},this.state.SearchArgs,{s:30,index:1});
                newState=Object.assign({},newState,{SearchArgs:searchArgs});
            }
            else
            {
                let searchArgs=Object.assign({},this.state.SearchArgs,{s:20,index:1});
                newState=Object.assign({},newState,{SearchArgs:searchArgs});
            }
        }
        else
        {
            newState=Object.assign({},this.state,{isPriceSorterSelected:false,isSaleVolumeSorterSelected:!this.state.isSaleVolumeSorterSelected});
            if(newState.isSaleVolumeSorterSelected)
            {
                let searchArgs=Object.assign({},this.state.SearchArgs,{s:50,index:1});
                newState=Object.assign({},newState,{SearchArgs:searchArgs});
            }
            else
            {
                let searchArgs=Object.assign({},this.state.SearchArgs,{s:40,index:1});
                newState=Object.assign({},newState,{SearchArgs:searchArgs});
            }
        }
        this.setState(newState);
        SearchService.search(newState.SearchArgs).then(response=> {
            this.refreshState(response);

            let preLoad = document.getElementById('preLoad');
            if (response.body.CurrentPage >= response.body.PageAmount) {
                preLoad.style.display = "none";
            }
            else {
                preLoad.style.display = "block";
            }
        });
        document.body.scrollTop=0;
    }

    research(filterArgs)
    {
        let researchArgs = [];
        let pValue = "";
        filterArgs.map(fv=> {
            if (fv.key !== "p") {
                researchArgs.push(fv);
            }
            else {
                pValue += `${fv.value},`
            }
        });
        if (pValue.length > 0) {
            pValue = pValue.substr(0, pValue.length - 1);
            researchArgs.push({key: "p", value: pValue});
        }
        let searchArgs = {};
        researchArgs.map(arg=> {
            if (arg.key === "ctg") {
                searchArgs = Object.assign(searchArgs, {ctg: arg.value});
            }
            if (arg.key === "bn") {
                searchArgs = Object.assign(searchArgs, {bn: arg.value});
            }
            if (arg.key === "p") {
                searchArgs = Object.assign(searchArgs, {p: arg.value});
            }
        });
        if(researchArgs.length>0) {
            searchArgs = Object.assign({}, this.state.SearchArgs, searchArgs);
        }else
        {
            searchArgs = Object.assign({}, this.state.SearchArgs, {
                ctg:"",//分类
                bn:"",//品牌
                p:"",//分类属性
                index:1
            });
        }

        this.setState(Object.assign({},this.state,{SearchArgs:searchArgs,isPriceSorterSelected:searchArgs.s===30,isSaleVolumeSorterSelected:searchArgs.s===50}));
        SearchService.search(searchArgs).then(response=> {
            this.refreshState(response);

            let preLoad = document.getElementById('preLoad');
            if (response.body.CurrentPage >= response.body.PageAmount) {
                preLoad.style.display = "none";
            }
            else {
                preLoad.style.display = "block";
            }
        });

    }

    newGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c)=>{
            let r = Math.random()*16|0, v = c === 'x' ? r : r&0x3|0x8;
            return v.toString(16);
        });
    }

    render() {
        let that = this;
        let salevolumeSorterClass = "";
        let priceSorterClass = "";
        let salevolumeSorterUpAndDownClass = "sort";
        let priceSorterUpAndDownClass = "sort";
        //20:售价降序    30:售价升序   40:销量降序   50:销量升序
        if (this.state.SearchArgs.s === 20) {
            priceSorterClass = "on";
            salevolumeSorterClass = "";
            priceSorterUpAndDownClass = "sort_down";
            salevolumeSorterUpAndDownClass = "sort";
        }
        if (this.state.SearchArgs.s === 30) {
            priceSorterClass = "on";
            salevolumeSorterClass = "";
            priceSorterUpAndDownClass = "sort_up";
            salevolumeSorterUpAndDownClass = "sort";
        }
        if (this.state.SearchArgs.s === 40) {
            salevolumeSorterClass = "on";
            priceSorterClass = "";
            salevolumeSorterUpAndDownClass = "sort_down";
            priceSorterUpAndDownClass = "sort";
        }
        if (this.state.SearchArgs.s === 50) {
            salevolumeSorterClass = "on";
            priceSorterClass = "";
            salevolumeSorterUpAndDownClass = "sort_up";
            priceSorterUpAndDownClass = "sort";
        }

        return (
            <PageLayout>
                <section id="white_header">
                    <div className="header">
                        <a className="return" onClick={()=>{
                            this.context.router.push("/");
                        }}></a>
                        <div className="list_search">                            
                                <form onSubmit={()=>{
                                    that.search();
                                }}><p><input className="searcher-keyword" type="search"
                                                        placeholder={Object.is(that.state.SearchArgs.keyword,"")?"搜索关键字":that.state.SearchArgs.keyword}
                                                        onKeyUp={e=>{
                                      if(e.keyCode===13)
                                      {
                                         that.search();
                                      }
                             }}/></p></form>                            
                        </div>
                        <a className="right_link" onClick={()=>{
                            that.search();
                        }}>搜索</a>
                    </div>
                </section>
                <section className="list_tit box-line-b box-line-t">
                    <ul className="clearFix">
                        <li className={salevolumeSorterClass} onClick={()=>{
                                that.sort(false);
                            }}><span className={salevolumeSorterUpAndDownClass}>销量</span></li>
                        <li className={priceSorterClass} onClick={()=>{
                                that.sort(true);
                            }}><span className={priceSorterUpAndDownClass}>价格</span></li>
                        <li className="on" onClick={()=>{
                                    let filter = document.getElementsByClassName("filter-expand")[0];
                                    if(filter.style.display==="none"){
                                        filter.style.display="block";
                                    }
                                    else{
                                        filter.style.display="none";
                                    }
                                }}><span className="sort_sx">筛选</span></li>
                    </ul>
                </section>
                <ProductList dataSource={that.state.Products}/>
                <Filter dataSource={that.state.filterState} researchCallback={searchArgs=>that.research(searchArgs)}/>
            </PageLayout>
        );
    }
}



