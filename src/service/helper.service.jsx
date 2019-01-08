/**
 * Created by liu.yao on 2016/6/27.
 */
import client from "utility/rest-client.jsx";
class HelperService {
    /**
     * 购物指南列表
     * @param param
     * @returns {*|Request|Promise|Promise.<TResult>}
     */
    getHelperListData(param) {
        let url = "/Topic/GetHelperList";
        if (param !== undefined && param !== -1) {
            url = `${url}/?pageIndex= ${param}`;
        }
        return client.get(url).then((res)=> {
            let retData = [];
            if (res.body.Success) {

                let items = res.body.Data.data;
                if (items.length > 0) {
                    for (let i = 0; i < items.length; i++) {
                        let item = {};
                        item.SysNo = items[i].SysNo;
                        item.TopicCategorySysNo = items[i].TopicCategorySysNo;
                        item.Title = items[i].Title;
                        item.SubTitle = items[i].SubTitle;
                        item.DefaultImage = items[i].DefaultImage;
                        item.DefaultImageUrl=items[i].DefaultImageUrl;
                        item.Summary = items[i].Summary;
                        item.Content = items[i].Content;
                        item.Keywords = items[i].Keywords;
                        item.Tag = items[i].Tag;
                        item.IsRed = items[i].IsRed;
                        item.IsTop = items[i].IsTop;
                        item.PageViews = items[i].PageViews;
                        item.PublishDate=items[i].PublishDate;
                        item.PublishDateStr=item[i].PublishDateStr;
                        retData.push(item);
                    }
                }
            } else {
                showMessage(res.body.message);
            }
            return retData;
        });

    }

    /**
     * 购物指南详情
     * @param param
     * @returns {Request|*|Promise|Promise.<TResult>}
     */
    getHelperDetail(param) {
        let url = "/Topic/Detail";
        if (param !== undefined && param !== -1) {
            url = `${url}/?sysno= ${param}`;
        }
        console.log(url);
        return client.get(url).then((res)=> {
            let retData = {};
            if (res.body.Success) {
                let item = res.body.Data;
                retData = item
            }
            else {
                showMessage(res.body.Message);
            }
            return retData;
        });
    }
}
export default new HelperService();