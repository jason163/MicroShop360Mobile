/**
 * Created by Nick on 2016/7/4.
 */
import appConfig from "config/app.config.json";
import uploader from "utility/uploader.jsx";
import strings from "config/strings.config.json";
import Loading from "components/loading.jsx";

export class UploaderBtn extends React.Component {
    static propTypes() {
        return {
            uploadtype: React.PropTypes.string.isRequired,
            callback: React.PropTypes.func.isRequired,
            onupload: React.PropTypes.func
        }
    }
    static get defaultProps() {
        return { onupload: () => { } }
    }
 

    render() {
        return (
            <div>
                <input type="file" ref="file" accept="image/jpg,image/jpeg,image/png,image/gif" capture="camera" onChange={() => {                
                    if (this.refs.file.files[0]) {
                        let fileExtension = this.refs.file.files[0].name.split('.').pop();
                        if (/[png|jpg|jpeg]+$/.test(fileExtension)) {
                            let posturl = `${appConfig.fileUploaderUrl}?appName=${this.props.uploadtype}`;
                            this.props.onupload();
                            ajaxLoading();
                            uploader.uploadFile(posturl,this.refs.file.files[0]).then((data) => {
                                ajaxLoaded();
                                if (data.state === "SUCCESS") {                                    
                                    this.props.callback(data.url);
                                }
                                else {
                                    showMessage(data.message);
                                }
                            }).catch((error) => {
                                ajaxLoaded();
                                throwError("上传失败，请稍后再试!");
                            });
                        } else {
                            this.refs.file.value = "";
                            showMessage(strings.avatarImageSupport);
                        }
                    }
                }}/>
            </div>
        );
    }
}