import client from "utility/rest-client.jsx";

class OrderListService {
    query(orderStatus, pageIndex) {
        let url = '/Order/GetOrderList';
        let data = {pageindex: pageIndex};
        if (orderStatus !== 999) {
            data.orderStatus = orderStatus;
        }
        return client.post(url, data).then((res)=> {
            if (res.body.Success) {
                if (orderStatus===101)
                {
                    res.body.Data.data.map((dataItem, index) => {
                        dataItem.SOStatusStr="待评价"
                    });
                }
                return res.body.Data;
            }
            throwError(res.body.Message);
            return false;
        });
    }
}

export default new OrderListService();