/**
 * Created by jean.h.ma on 5/13/16.
 */
import agent from "superagent";
import appConfig from "config/app.config.json";
import * as cache from "utility/storage.jsx";
import keys from "config/keys.config.json";
import strings from "config/strings.config.json";
import * as handler from "utility/handler.jsx";
 
let getTokenValue = ()=> {
    return cache.getCache(keys.token);
};

let beforeSend = ()=> {

};
let complete = (res)=> {
    // console.log(res);
    // switch(handler.runtime()){
    // 	case "html5":
    // 	case "app":
    // 		cache.setCache(res.url,res);
    // 		break;
    // 	default:
    // }
    // if (res && res.body) {
    // 	if (!res.body.Success) {
    // 		throwError({
    // 			message: res.body.Message,
    // 			delay: 3000
    // 		});
    // 	}
    // }
};
let promiseCatch = (ex)=> {
    if (ex) {
        if (ex.status) {
            switch (ex.status) {
                case 404:
                    throwError(strings.serviceNotFound);
                    break;
                default:
                    throwError(ex.response.body.Message);
            }
        }
        else {
            throwError(strings.serviceError);
        }
    }
    else {
        throwError(strings.unknownError);
    }
};

let getHeaders = (defaultValue = {})=> {
    let headers = Object.assign({}, defaultValue);
    let tokenValue = getTokenValue();
    if (tokenValue !== "") {
        headers[keys.token] = tokenValue;
    }
    headers["client-info"] = `${appConfig.version};${window.screen.width}x${window.screen.height}`;
    if (appConfig.appid !== "") {
        headers["x-matchec-app-id"] = appConfig.appid;
    }

    return headers;
};

window.$currentRequestQueue = {};


class RestClient {

    constructor() {
        this.resetPathname = null;
    }

    get(url, data) {
        beforeSend();

        if (!handler.isOnline()) {
            return new Promise((resolve)=> {
                resolve(cache.getCache(url));
            });
        }

        let headers = getHeaders();
        let newUrl;
        if (url.indexOf("?") >= 0) {
            newUrl = `${url}&_=${Math.random()}`;
        }
        else {
            newUrl = `${url}?_=${Math.random()}`;
        }
        let sa = agent.get(appConfig.apihost + newUrl).set(headers);
        this.addRequestQueue(url, sa);
        if (data) {
            sa = sa.send(data);
        }
        return new Promise((resolve, reject)=> {
            if (!handler.isOnline()) {
                reject(strings.connectionIsNotUsed);
                throwError(strings.connectionIsNotUsed);
            }
            sa.end((err, res)=> {
                this.removeRequestQueue(url);
                complete(res);
                if (err) {
                    reject(err);
                }
                else {
                    resolve(res);
                }
            });
        }).catch(promiseCatch);
    }

    post(url, data, contentType) {
        beforeSend();

        if (!handler.isOnline()) {
            return new Promise((resolve)=> {
                resolve(cache.getCache(url));
            });
        }

        let content_type=contentType;
        if (typeof contentType === "undefined" || contentType === null || contentType === "") {
            content_type = "application/x-www-form-urlencoded";
        }
        let headers = getHeaders({
            "content-type": content_type
        });

        let sa = agent.post(appConfig.apihost + url).set(headers);
        this.addRequestQueue(url, sa);
        if (data) {

            sa = sa.send(data);
        }
        return new Promise((resolve, reject)=> {
            if (!handler.isOnline()) {
                reject(strings.connectionIsNotUsed);
                throwError(strings.connectionIsNotUsed);
            }
            sa.end((err, res)=> {
                this.removeRequestQueue(url);
                complete(res);
                if (err) {
                    reject(err);
                }
                else {
                    resolve(res);
                }
            });
        }).catch(promiseCatch);
    }

    addRequestQueue(key, req) {
        window.$currentRequestQueue[key] = req;
    }

    removeRequestQueue(key) {
        Reflect.deleteProperty(window.$currentRequestQueue, key);
    }

    resetRequestQueue(pathname) {
        if (pathname !== this.resetPathname) {
            this.resetPathname = pathname;
            for (let key in window.$currentRequestQueue) {
                if (window.$currentRequestQueue[key].abort && handler.isOnline()) {
                    window.$currentRequestQueue[key].abort();
                }
            }
            window.$currentRequestQueue = {};
        }
    }
}

export default new RestClient();