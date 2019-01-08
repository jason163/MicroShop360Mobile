import React from 'react';
/***
 *
 * 使用说明
 *
 *
 */
export default class PageListView2 extends React.Component {

    static get propTypes() {
        return {
            clearOldData: React.PropTypes.bool,
            template: React.PropTypes.any,
            onGetPageData: React.PropTypes.func,
            pageData: React.PropTypes.array,
            totalRecordCount: React.PropTypes.number
        }
    }

    static get defaultProps() {
        return {clearOldData: false}
    }


    constructor(props) {
        super(props);
        this.isLoading = false;
        this.listenScrollEvent = true;
        this.clientID = Math.random().toString().substr(2);
        this.state = {
            pageIndex: 0,
            dataSource: []
        }
    }

    componentDidMount() {
        this.scrollEvent();
        this.props.onGetPageData(0);
    }

    scrollEvent() {
        let preLoad = document.getElementById(`preLoad${this.clientID}`);
        document.addEventListener("scroll", () => {
            if (this.isLoading ||!this.listenScrollEvent) {
                return;
            }
            let preLoadTop = preLoad.getBoundingClientRect().top;
            if (preLoadTop > 0 && preLoadTop < window.screen.height - 10) {
                this.isLoading = true;
                let nextPageIndex = this.state.pageIndex + 1;
                this.props.onGetPageData(nextPageIndex);
                this.setState({pageIndex: nextPageIndex});
            }
        });
    }

    componentWillReceiveProps(nextProps) {
        this.isLoading = false;
        let newData = [];
        let currentPageIndex = this.state.pageIndex;
        if (nextProps.clearOldData) {
            newData = nextProps.pageData;
            currentPageIndex = 0;
        } else {
            newData = this.state.dataSource.concat(nextProps.pageData);
        }

        this.listenScrollEvent = false;
        this.setState({dataSource: newData, pageIndex: currentPageIndex}, ()=> {
            this.listenScrollEvent = true;
        });

        let preLoad = document.getElementById(`preLoad${this.clientID}`);
        if (nextProps.totalRecordCount <= newData.length) {
            preLoad.style.display = 'none';
        } else {
            preLoad.style.display = '';
        }
    }

    removeItem(dataSysNo)
    {
        let newSource=[];
        this.state.dataSource.map(data=>{
            if(data.SysNo!==dataSysNo)
            {
                newSource.push(data);
            }
        });
        this.setState({dataSource:newSource});
    }

    render() {
        let contentList = this.state.dataSource.map((dataItem, index) => {
            return (
                React.createElement(this.props.template, {key: new Date() + index,data: dataItem,removeCallBack:(dataSysNo)=>{this.removeItem(dataSysNo)}})
            )
        });
        let preLoadID = `preLoad${this.clientID}`;
        return (
            <div>
                <ul className="clearFix">
                    {contentList}
                </ul>

                <div style={{display:this.state.dataSource !==undefined && this.state.dataSource.length ===this.state.totalRecordCount?"":"none",textAlign:'center'}} className="center" id={preLoadID}>数据加载中, 请稍等...</div>
            </div>
        )
    }
}

