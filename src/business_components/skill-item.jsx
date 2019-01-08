
import {ListKeyValueCell} from "bm/list-view.jsx"
export default class SkillItem extends React.Component {
    static get propTypes() {
        return {
            children: React.PropTypes.any,
            header: React.PropTypes.string,
            items: React.PropTypes.array.isRequired

        }

    }

    render() {
        return (
            <div className="project-expander">
                <div className="head status-bar">
                    <span className="title">{this.props.header}</span>
                </div>

                <div className="content">

                    <div className="detail">
                    {
                        this.props.items.map((item,index)=>{
                            return (
                                 <ListKeyValueCell data={item} key={index}></ListKeyValueCell>
                            )
                        })
                    }
                    </div>
                </div>
            </div>
        )
            ;
    }

}
