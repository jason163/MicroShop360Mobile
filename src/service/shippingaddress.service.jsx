import client from "utility/rest-client.jsx";

class AddressMgr {    
    getAddressList(pageIndex) {
        return client.get(`/ShippingAddress/Query?pageindex=${pageIndex}`).then((res)=>{
            if (res.body.Success){
                return res.body.Data;
            }
            throwError(res.body.Message);
            return false;
        })
    }

    getAddressDetail(sysNo, callback) {

        return client.get(`/ShippingAddress/Load?sysno=${sysNo}`).then((response) => {
            if (response.body.Success) {
                if (callback !== undefined || callback !== null) {
                    callback(response.body.Data);
                }
            }
        })
    }

    deleteAddress(sysNo, callback) {
        return client.get(`/ShippingAddress/Delete?sysno=${sysNo}`).then((response) => {
            if (response.body.Success) {
                callback(true);
            } else {
                callback(false);
            }
        })
    }

    // 保持地址,type用于区分是update还是create
    saveAddress(data, type, callback) {
        if (type === 'N') {
            this.createAddress(data, callback);
        }
        else {
            this.updateAddress(data, callback);
        }
    }

    updateAddress(data, callback) {

        return client.post('/ShippingAddress/Update', data).then((response) => {
            if (response.body.Success) {
                callback(response.body);
            } else {
                callback(response.body);
                throwError(response.body.Message);
            }
        })
    }

    createAddress(data, callback) {
        return client.post('/ShippingAddress/Create', data).then((response) => {
            if (response.body.Success) {
                callback(response.body);
                return {done: true};
            }
            throwError(response.body.Message);
            return false;
        })
    }

    // 获取地址列表,没有获取到就返回[]空数组
    addressCallback(response, callback) {
        if (response.status === 200) {
            let data = response.body.data;
            if (data !== undefined || data !== null) {
                let validData = data.filter((item) => {
                    return item.Status === 1;
                });
                callback(validData);
            } else {
                callback([]);
            }
        } else {
            callback([]);
        }
    }

    getProvinceList(callback) {
        return client
            .post('/Common/AreaQuery')
            .then((response) => {
                this.addressCallback(response, callback);
            })
    }

    getCityList(provinceSysNo, callback) {
        return client
            .post("/Common/AreaQuery", {
                provinceSysNo: provinceSysNo
            })
            .then((response) => {
                this.addressCallback(response, callback);
            })
    }

    getAreaList(provinceSysNo, citySysNo, callback) {
        return client
            .post("/Common/AreaQuery", {
                provinceSysNo: provinceSysNo,
                citySysNo: citySysNo
            })
            .then((response) => {
                this.addressCallback(response, callback);
            })
    }
}

export default new AddressMgr();