
import {ListKeyValueCell} from "bm/list-view.jsx"
export class ResumeItem extends React.Component {
    static get propTypes() {
        return {
            children: React.PropTypes.any,
            items: React.PropTypes.array.isRequired
        }
    }

    render() {
        return (
            <div>
                {
                    this.props.items.map((item, index)=> {
                        return (
                            <ListKeyValueCell key={index} data={item}></ListKeyValueCell>
                        )
                    })
                }
            </div>

        );
    }
}
/**
 * 履历详情
 */
export class ItemDetail extends React.Component {

    static get propTypes() {
        return {
            headerClass: React.PropTypes.string,
            items: React.PropTypes.array.isRequired,
            ToUrl: React.PropTypes.string,
            projectInfos: React.PropTypes.any,
            trainProject: React.PropTypes.any,
            IsTrain: React.PropTypes.any,
            data: React.PropTypes.any

        }

    }

    static get contextTypes() {
        return {
            router: React.PropTypes.object.isRequired
        };
    }

    render() {
        return (
            <div className="resumeItem clearfix" onClick={(even)=>{

              if(this.props.ToUrl!==undefined && this.props.ToUrl.length> 0){
              if(this.props.IsTrain!==undefined && this.props.IsTrain){
//todo跳转到项目培训
  this.context.router.push({
                  pathname:this.props.ToUrl
                  ,state:this.props.trainProject

                  })
              }else{
                  this.context.router.push({
                  pathname:this.props.ToUrl
                  ,state:{
                  projectInfo:this.props.projectInfos
                  }
                  });}
              }

                     }}>
                <div className={this.props.headerClass}>

                </div>
                <div className="items">
                    {
                        this.props.items.map((item, index)=> {
                            return (
                                <ListKeyValueCell key={index} data={item}></ListKeyValueCell>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}

