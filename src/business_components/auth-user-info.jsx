
export default class AuthUserInfo extends React.Component {
    static propTypes() {
        return {
            showSuccessMsg: React.PropTypes.bool,
            workerInfo: React.PropTypes.object
        }
    }

    render() {
        let worker = this.props.workerInfo;
        return (
            <div className="auth-detail">
                <div className={classNames("auth-success",{"hide":!this.props.showSuccessMsg})}>
                    <div className="msg">实名认证成功</div>
                </div>
                <div className="worker-name">
                    <div className="cycle-name">{Array.from(worker.WorkerName || '')[0]}</div>
                    <div className="normal-name">{worker.WorkerName}</div>
                </div>
                <div className="worker-detail">
                    <div className="detail-line">
                        <div className="detail-cell">
                            <span className="cell-title">身份证:</span>
                            <span className="cell-content">{worker.IDCardNumber}</span>
                        </div>
                    </div>

                    <div className="detail-line double">
                        <div className="detail-cell">
                            <span className="cell-title">性别:</span>
                            <span className="cell-content">{worker.Gender}</span>
                        </div>
                    </div>
                    <div className="detail-line double">
                        <div className="detail-cell">
                            <span className="cell-title">民族:</span>
                            <span className="cell-content">{worker.Nation}</span>
                        </div>
                    </div>
                    <div className="detail-line double">
                        <div className="detail-cell">
                            <span className="cell-title">出生日期:</span>
                            <span className="cell-content">{worker.Birthday}</span>
                        </div>

                    </div>
                    <div className="detail-line double">
                        <div className="detail-cell">
                            <span className="cell-title">年龄:</span>
                            <span className="cell-content">{worker.Age}</span>
                        </div>
                    </div>
                    <div className="detail-line double">
                        <div className="detail-cell">
                            <span className="cell-title">政治面貌:</span>
                            <span className="cell-content">{worker.PoliticsTypeStr}</span>
                        </div>

                    </div>
                    <div className="detail-line double">
                        <div className="detail-cell">
                            <span className="cell-title">文化程度:</span>
                            <span className="cell-content">{worker.CultureLevelTypeStr}</span>
                        </div>
                    </div>

                    <div className="detail-line double">
                        <div className="detail-cell">
                            <span className="cell-title">参加工作日期:</span>
                            <span className="cell-content">{worker.WorkDate}</span>
                        </div>
                    </div>
                    <div className="detail-line double">
                        <div className="detail-cell">
                            <span className="cell-title">工龄:</span>
                            <span className="cell-content">{worker.WorkAge}年</span>
                        </div>
                    </div>
                    <div className="detail-line">
                        <div className="detail-cell">
                            <span className="cell-title">是否有重大病史:</span>
                            <span className="cell-content">{worker.HasBadMedicalHistory}</span>
                        </div>
                    </div>
                    <div className="detail-line double">
                        <div className="detail-cell">
                            <span className="cell-title">是否加入工会:</span>
                            <span className="cell-content">{worker.IsJoined}</span>
                        </div>
                    </div>

                    <div className="detail-line double">
                        <div className="detail-cell">
                            <span className="cell-title">入会日期:</span>
                            <span className="cell-content">{worker.JoinedTime}</span>
                        </div>
                    </div>

                    <div className="detail-line double">
                        <div className="detail-cell">
                            <span className="cell-title">紧急联络人:</span>
                            <span className="cell-content">{worker.UrgentContractName}</span>
                        </div>
                    </div>
                    <div className="detail-line double">
                        <div className="detail-cell">
                            <span className="cell-title">联络人电话:</span>
                            <span className="cell-content">{worker.UrgentContractCellphone}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}