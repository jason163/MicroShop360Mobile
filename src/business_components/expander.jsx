
import {ResumeItem} from "bm/resume-item.jsx"
export class Expander extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isExpand: false
        };
    }

    static propTypes() {
        return {
            title: React.PropTypes.string,
            children: React.PropTypes.any
        }
    }

    render() {
        return (
            <div className="expander">
                <div className="head">
                    <span className="title">
                        {this.props.title}
                        <i className="iconfont icon-arrowup" onClick={()=>{
                            this.setState({isExpand:!this.state.isExpand});
                        }}></i>
                    </span>
                </div>
                <div className={classNames("content",{'expand':this.state.isExpand})}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}