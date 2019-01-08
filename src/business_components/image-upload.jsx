/**
 * Created by Nick on 2016/7/4.
 */
import {UploaderBtn} from "components/uploaderbtn.jsx"
import appConfig from "config/app.config.json";

export default class ImageUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imgList: this.props.imgList
        };
    }

    static get propTypes() {
        return {
            uploadtype: React.PropTypes.string,
            callback: React.PropTypes.func,
            imgList:React.PropTypes.array
        }
    }

    componentWillReceiveProps(nextProps)
    {
        this.setState({
            imgList:nextProps.imgList
        });
    }

    UploadBack(img) {
        let newState = Object.assign({}, this.state);
        newState.imgList.push(img);
        this.setState(newState);
        this.props.callback(newState.imgList);
    }

    render() {
        let uploadbtn;
        if(this.state.imgList.length<5)
        {
            uploadbtn=<li className="add_photo"><span style={{backgroundImage:`url(${require("assets/img/add_photo.png")})`}}>
                <UploaderBtn uploadtype={this.props.uploadtype} callback={(img)=>this.UploadBack(img)}></UploaderBtn>
                </span></li>
        }
        return (
            <div>
                <ul>
                    {
                        this.state.imgList.map((img,index)=> {
                            let imgpath=img
                            if(!img.startsWith(appConfig.contentSourceUrl)) {
                                imgpath = (appConfig.contentSourceUrl + img).replace("Original","P120");
                            }
                            return <li key={index}>
                                <a style={{backgroundImage:`url(${imgpath})`}}></a>
                            </li>
                        })
                    }
                </ul>
                    {uploadbtn}
            </div>
        );
    }
}