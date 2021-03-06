import authService from "service/auth.service.jsx";

export class Header extends React.Component {
    static get propTypes() {
        return {
            showBackButton: React.PropTypes.bool
            , children: React.PropTypes.string.isRequired
            , buttons: React.PropTypes.array
            , style: React.PropTypes.object
            , onGoBack:React.PropTypes.func
        };
    }

    static get defaultProps() {
        return {
            showBackButton: true
            , buttons: []
            , style: {}
            , onGoBack:null
        }
    }

    static get contextTypes() {
        return {
            router: React.PropTypes.object.isRequired
        };
    }

    render() {
        let headerHeight = 4.4;
        let backButtonStyle = {
            top: `-${headerHeight}rem`
        };
        let buttonsStyle = {
            top: `-${headerHeight * 2}rem`
        };
        if (!this.props.showBackButton) {
            buttonsStyle.top = `-${headerHeight}rem`;
        }

        return (
                <section id="white_header">
                    <div className="header">
                        {this.props.showBackButton && <a className="back-button"
                                                         onClick={()=>{
                        if(this.props.onGoBack!==null)
                        {
                            this.props.onGoBack();
                        }
                        else
                        {
						    this.context.router.goBack();
						}
					}} style={backButtonStyle}><i className="return"></i></a>}
                        <h3>{this.props.children}</h3>
                        {this.props.buttons.map((button, index)=> {
                            return (
                                <a key={index} onClick={button.onClick}>{button.text}</a>
                            );
                        })}
                        {()=> {
                            if (!authService.isLogin()) {
                                return <a className="right_link" onClick={()=> {
                                    this.context.router.push({pathname:"/login",state: {target:"/"}
                                    });
                                }}>登录</a>
                            }
                            }
                        }
                    </div>
                </section>
        );
    }
}
export class Content extends React.Component {
    static get propTypes() {
        return {
            children: React.PropTypes.any
        };
    }

    render() {
        return (
            <div className="page-layout-content">
                {this.props.children}
            </div>
        );
    }
}