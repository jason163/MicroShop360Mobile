import keys from "config/keys.config.json";
import {setSessionCache, getSessionCache} from "utility/storage.jsx";
import authService from "service/auth.service.jsx";

export class TabPageLayout extends React.Component {

    static get contextTypes() {
        return {
            router: React.PropTypes.object.isRequired
        };
    }

    constructor(props) {
        super(props);
        this.state = {
            active: getSessionCache(keys.tabPageActive) || 0
        };
    }

    componentWillUnmount() {
        setSessionCache(keys.tabPageActive,this.state.active );
    }

    static get propTypes() {
        return {
            children: React.PropTypes.any
            , tabs: React.PropTypes.array.isRequired
            ,isHome:React.PropTypes.bool
        };
    }

    ActiveFirstTab()
    {
        this.setState({active:0});
    }

    render() {
        return (
            <div className={classNames({'page-layout-content-index':this.props.isHome})}>
                {this.props.children.map((content, index)=> {
                    let show = index === this.state.active;
                    //if(this.props.isHome===true && index===0)
                    //{
                    //    show=true;
                    //}
                    return (
                        React.cloneElement(content, {
                            key: index
                            ,show: show
                            ,dataIndex:index
                        })
                    );
                })}
                <footer>
                    <ul>
                        {this.props.tabs.map((item, index)=> {
                            return (
                                <li key={index}>
                                    <a className={classNames(item.iconClassName,{'on':this.state.active===index})}
                                       key={index}
                                       onClick={()=>{
									if(item.requireAuth&&!authService.isLogin()){
										this.context.router.push("/login");
									}
									this.setState({active:index});
									setSessionCache(keys.tabPageActive,index);
								}}>
                                        {item.text===""?"": <i>{item.text}</i>}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </footer>
            </div>
        );
    }
}

export class TabPageContent extends React.Component {
    static get propTypes() {
        return {
            children: React.PropTypes.any
            , show: React.PropTypes.bool
            , zIndex:React.PropTypes.number
            ,eleId:React.PropTypes.string
        };
    }
    static get defaultProps(){
        return {
            zIndex:20
        }
    }

    render() {
        return (
            <div id={this.props.eleId} className={classNames('tab-page-content',{'active':this.props.show})}
                 >
                {this.props.children}
            </div>
        );
    }
}