import React from 'react';
import client from "utility/rest-client.jsx";
/***
 *   options 是设置
 *   返回给item的时候,listView返回了pagelistviewobject
 */
export default class PageListView extends React.Component {

    static get propTypes() {
        return {
            options: React.PropTypes.object
        }
    }

    initState() {
        this.state = {
            dataSource: [],
            load: () => this.load(),
            reset: () => this.reset()
        }
    }

    initOptions() {

        // 设置默认参数
        this.options = {
            ajaxCallback: (res) => {
                return res.body.Data.data;
            },
            container: 'page-layout-content',
            ajaxUrl: '',
            param: {}
        }

        if (this.props.options !== undefined || this.props.options !== null) {
            Object.keys(this.props.options).forEach((key) => {
                this.options[key] = this.props.options[key]
            });
        }

        this.options.param.pageIndex = 0;
        this.options.isLoading = false;
    }

    // 拼接get请求的参数
    getQueryUrl() {
        let getUrlParam = '';
        Object.keys(this.options.param).map((key) => {
            debugger;
            getUrlParam += `${key}=${this.options.param[key]}&`;
        });

        getUrlParam = getUrlParam.substring(0, getUrlParam.length - 1);

        return `${this.options.ajaxUrl}?${getUrlParam}`;
    }

    initData() {
        client
            .get(this.getQueryUrl())
            .then((res) => {
                if (res.body.Success) {
                    if (res.body.Data !== null
                        && res.body.Data.data !== undefined
                        && res.body.Data.data !== null) {
                        this.options.ajaxCallback(res)
                            .map((item) => {
                                this.state.dataSource.push(item);
                                this.setState({ dataSource: this.state.dataSource });
                            });
                        if (res.body.Data.recordsTotal <= res.body.Data.PageSize) {
                            setTimeout(function () {
                                document.getElementById('preLoad').style.display = 'none';
                            }, 100)
                        } else {
                            this.scrollEvent();
                        }
                    }
                }
            })
    }

    scrollEvent() {

        let layOutContent = document.getElementsByClassName(this.options.container)[0];
        let preLoad = document.getElementById('preLoad');
        let that = this;
        layOutContent.addEventListener("scroll", () => {
            this.getPage(layOutContent, preLoad)
        });
    }

    getPage(layOutContent, preLoad) {

        // 如果加载条隐藏了. 就不获取
        if (preLoad.style.display === 'none') {
            return;
        }

        let newState = Object.assign({}, this.state)

        if (this.options.isLoading) {
            return;
        }


        if (preLoad.offsetTop <= layOutContent.offsetHeight + layOutContent.scrollTop) {
            
            this.options.isLoading = true;
            this.options.param.pageIndex++;
            client.get(this.getQueryUrl()).then((res) => {

                if (res.body.Success) {

                    this.options.ajaxCallback(res).map((item) => {
                        newState.dataSource.push(item);
                    });

                    if (res.body.Data.recordsTotal <= (this.options.param.pageIndex + 1) * res.body.Data.PageSize) {
                        preLoad.style.display = "none";
                    }

                    this.options.isLoading = false;
                    this.setState(newState);
                }
            })
        }
    }

    // 重置PageListView
    reset() {
        this.initData();
    }

    // 手动调用可视区域的load.主要是方式用户删除item后，无法触发滚动事件
    load() {
        let layOutContent = document.getElementsByClassName(this.options.container)[0];
        let preLoad = document.getElementById('preLoad');
        this.getPage(layOutContent, preLoad);
    }

    constructor(props) {
        super(props);
        this.initState();
        this.initOptions();
    }

    componentDidMount() {
        this.initData();
    }

    render() {

        let that = this;
        let contentList = that.state.dataSource.map((data, key) => {
            return (
                React.createElement(that.props.options.template, {
                    data: data,
                    listView: that,
                    key: key
                })// 将pagelistview对象传递回去一级当前的data.主要用于item要操作pagelist的数据
            )
        })

        return (
            <div>
                {contentList}
                <div id='preLoad' className="center" style={{textAlign:'center'}}>数据加载中, 请稍等... </div>
            </div>
        )
    }
}

