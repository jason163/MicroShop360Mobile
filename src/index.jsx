
require("assets/css/base.css");
import {
    Router
    , Route
    , hashHistory
    , IndexRoute
} from "react-router";
import getChildRoutes from "routes/index.route.jsx";
import routeStateManager from "utility/route-state-manager.jsx";
import client from "utility/rest-client.jsx";
import appConfig from "config/app.config.json";
import Loading from "components/loading.jsx";
import ConfirmBox from "components/confirmbox.jsx"
import AuthService from "service/auth.service.jsx";
import * as handler from "utility/handler.jsx";
import reactCookie from "utility/react-cookie.js";

let runtime = appConfig.runtime;
handler.runtime(runtime);
document.documentElement.setAttribute("data-runtime", runtime);

// if(runtime==="html5"){
// 	let appCache=new applicationCache();
// }

let isFirst = ()=> {
    // let value = cache.getCache(keys.guide);
    // return value === null;
    return false;
};

hashHistory.listen((location)=> {
    console.log("hash history change : ",location);
    client.resetRequestQueue(location.pathname);
    if (location.action === "PUSH") {
        routeStateManager.setPreviousState(location.state);
    }
});

// hashHistory.listenBefore((location)=>{
// 	console.log("leaving page : ",location);
// });

// let pageTransitionTimeout = 500;


class AppMessage extends React.Component {
    static get contextTypes() {
        return {
            router: React.PropTypes.object.isRequired
        }
    }

	constructor(props) {
		super(props);
		this.state = {
			messages: []
		};
		window.throwError = (errorMessage)=> {
			if (errorMessage && errorMessage !== "") {

				// console.log(errorMessage);
				if (typeof errorMessage === "object") {
					this.addMessage(errorMessage);
				}
				else {
					this.addMessage({
						delay: 3000,
						message: errorMessage
					});
				}
				throw new Error("break");
			}
		}
		window.showMessage = (message)=> {
			if(message && message!==""){
				this.addMessage({
					message, delay: 3000
				});
			}
		};
        window.confirmBox = (confirmOption)=>{
            this.refs.confirm_box.confirm(confirmOption);
        };
        window.ajaxLoading = ()=>{
            this.refs.loading.loading();
        }
        window.ajaxLoaded = ()=>{
            this.refs.loading.loaded();
        }
		//listen page error
		// window.addEventListener("error", (event)=>{
		// 	// debugger
		// 	// this.addMessage(event.error);
		// 	console.log(event)
		// 	let data;
		// 	try{
		// 		data=JSON.parse(event.message.substring(7));
		// 	}
		// 	catch(ex){
		// 		data={
		// 			message:event.message,
		// 			delay:3000
		// 		};
		// 	}
		// 	console.log(data);
		// 	this.addMessage(data);
		// });
	}

    addMessage(message) {
        // let isExists = this.state.messages.find((item)=> {
        // 	if (item.message === message.message) {
        // 		return true;
        // 	}
        // 	return false;
        // });
        // if (!isExists) {
        let newMessages = this.state.messages.concat([message]);
        this.setState({
            messages: newMessages
        });
        // }
    }

    componentWillMount() {
        // clear messages when route each change
        this.context.router.listen(()=> {
            this.setState({
                messages: []
            });
        })
    }

    render() {
        return (
            <ul className="prompt">
                {this.state.messages.map((item, index)=> {
                    return (
                        <AppMessageItem key={index} data={item}></AppMessageItem>
                    );
                })}
                <Loading ref="loading" isModal={true}/>
                <ConfirmBox ref="confirm_box"/>
            </ul>            
        )
    }
}
class AppMessageItem extends React.Component {

    constructor(props) {
        super(props);
        this.timer = null;
        this.state = {
            visible: true
        };

    }

    static get propTypes() {
        return {
            data: React.PropTypes.object.isRequired
            , onRemove: React.PropTypes.func
        }
    }

    componentWillMount() {
        if (this.props.data.delay) {
            this.timer = setTimeout(()=> {
                this.setState({
                    visible: false
                });
            }, this.props.data.delay);
        }
    }

    componentWillUnmount() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }

    render() {
        return this.state.visible ? <li>{this.props.data.message}</li> : null
    }
}

class App extends React.Component {

    constructor(props) {
        super(props);
        //initial page transition
        //@return
        //		transitionEnterName{string}
        //		transitionBackName{string}
        //		transitionTimeout{int}
        //
        this.pageTransition = handler.getPageTransitionName(navigator.platform, navigator.appVersion, navigator.userAgent);

    }

    static get propTypes() {
        return {
            children: React.PropTypes.any
            , location: React.PropTypes.any
        };
    }

    // static get contextTypes(){
    // 	return {
    // 		router: React.PropTypes.object.isRequired
    // 	}
    // }

    render() {
        let isPop = this.props.location.action === "POP";

        let transitionName = null;
        let transitionTimeout = 0;
        if (this.pageTransition) {
            transitionName = isPop ? this.pageTransition.transitionBackName : this.pageTransition.transitionEnterName;
            transitionTimeout = this.pageTransition.transitionTimeout;
        }

        let ele;
        if (transitionName) {
            ele = <ReactCSSTransitionGroup
                transitionName={transitionName}
                transitionEnterTimeout={transitionTimeout}
                transitionLeaveTimeout={transitionTimeout}>
                {
                    React.cloneElement(this.props.children, {
                        key: this.props.location.pathname
                    })
                }
            </ReactCSSTransitionGroup>
        }
        else {
            ele = this.props.children;
        }

        return (
            <div id="rootNodeInner">
                <AppMessage></AppMessage>
				{ele}                
			</div>
        );
    }
}

ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/"
               component={App}
               getChildRoutes={getChildRoutes}>
            <IndexRoute onEnter={
                (nextState,replace)=>{
                    // let returnurl=appConfig.mhost;
                    // let openid = window.reactCookie.load("match.weixin.openid");
                    // if (handler.default.isWechat&&(Object.is(openid,undefined)||Object.is(openid,null)||Object.is(openid,""))) {
                    //     let reqCode;
                    //     let query = window.location.search.substring(1);
                    //     if(query !==""){
                    //         let vars = query.split("&");
                    //         for (let i=0;i<vars.length;i++) {
                    //             let pair = vars[i].split("=");
                    //             if(pair[0] === 'code'){
                    //                 reqCode=pair[1];
                    //             }
                    //         }
                    //     }
                    //     if(Object.is(reqCode,undefined) || Object.is(reqCode,"")||Object.is(reqCode,null)){
                    //         document.location.href = `http://appsvc.great-land.net/WeiXin/WXLogin?ReturnUrl=${returnurl}`;
                    //     }else {
                    //         AuthService.weixinLoginBack(reqCode,`${returnurl}/?code=${reqCode}`);
                    //     }
                    //     // if(!Object.is(routers.location.state,null)&&!Object.is(routers.location.state.target,undefined)&&!Object.is(routers.location.state.target,null)&&!Object.is(routers.location.state.target,""))
                    //     // {
                    //     //     document.location.href = `http://appsvc.great-land.net/WeiXin/WXLogin?ReturnUrl=${returnurl}/#/${routers.location.state.target}`;
                    //     // }
                    // }
                }
            }
                        getComponent={
				(nextState,callback)=>{
					require.ensure([],(require)=>{
						callback(null,require("pages/index.jsx").default);
					});
			}}></IndexRoute>
        </Route>
    </Router>
    , document.getElementById("rootNode"));
