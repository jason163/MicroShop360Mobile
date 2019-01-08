
import {Link} from "react-router";
export default class DetailContainer extends React.Component {
    static propTypes() {
        return {
            title: React.PropTypes.string,
            detail_link: React.PropTypes.string,
            children: React.PropTypes.any
        }
    }

    render() {
        return (
            <div className="detail-container" onClick={(ev)=>{
                return;
            }}>
                <div className="head">
                    <Link to={this.props.detail_link}>
                        {this.props.title}
                        <i className="iconfont icon-jiantou"></i>
                    </Link>
                </div>
                <div className="content">
                    {this.props.children}
                </div>
            </div>
        );
    }
}