import React from 'react';

export default class PageListView3 extends React.Component {

    static get propTypes() {
        return {
            clearOldData: React.PropTypes.bool,
            template: React.PropTypes.any,
            onGetPageData: React.PropTypes.func,
            pageData: React.PropTypes.array,
            totalRecordCount: React.PropTypes.number,
            pageSize: React.PropTypes.number
        }
    }

    static get defaultProps() {
        return {
            clearOldData: false,
            pageSize:10
        };
    }

    constructor(props) {
        super(props);
        this.isLoading = false;
        this.listenScrollEvent = true;
        this.clientID = Math.random().toString().substr(2);
        this.state = {
            pageIndex: 0,
            dataSource: this.props.pageData
        }
        this.dataSource=[];
    }

    getPageData(pageIndex)
    {
        this.props.onGetPageData(pageIndex).then((data)=>{
            this.isLoading = false;
            let newState = Object.assign({}, this.state);
            if(typeof data.data !== "undefined" && data.data!==null &&data.data.length>0)
            {
                //如果当页数据==PageSize 表示不是最后一页。
                if(data.data.length===this.props.pageSize)
                {
                    this.dataSource =this.dataSource.concat(data.data);
                    newState.pageIndex =pageIndex;
                }
                let tsd =[].concat(this.dataSource );
                if(data.data.length!==this.props.pageSize)
                {
                    tsd = tsd.concat(data.data);
                }
                newState.dataSource =tsd;
            }
            this.setState(newState)
        });
    }
    componentDidMount() {
        this.scrollEvent();
        this.getPageData(0);
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
                this.getPageData(nextPageIndex);
               // this.setState({pageIndex: nextPageIndex});
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

        //let preLoad = document.getElementById(`preLoad${this.clientID}`);
        //if (nextProps.totalRecordCount <= newData.length) {
        //    preLoad.style.display = 'none';
        //} else {
        //    preLoad.style.display = '';
        //}
    }

    render() {
        let contentList = this.state.dataSource.map((dataItem, index) => {
            return (
                React.createElement(this.props.template, {key: new Date() + index,data: dataItem})
            )
        });
        let preLoadID = `preLoad${this.clientID}`;
        return (
            <div>
                <ul className="clearFix">
                    {contentList}
                </ul>
                <div style={{textAlign:'center'}} className="center" id={preLoadID}>&nbsp;</div>
            </div>
        )
    }
}

