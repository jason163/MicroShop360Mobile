import client from "utility/rest-client.jsx";
import * as Cache from "utility/storage.jsx";
import keys from "config/keys.config.json";

class OrderService {
	loadShoppingCart(request) {
		if (!Object.is(request, null) && !Object.is(request, undefined)) {
			let url = "/Order/ShoppingCart";
			return client.post(url, request).then((response) => {
				return response;
			});
		}
		return new Promise((resolve, reject) => { reject(); });
	}
	buildCheckout(createOrderInfo) {
		return client.post("/Order/Checkout", createOrderInfo, "application/json").then((res) => {

			if (res.body.Success) {
				return res.body;
			}

			throwError(res.body.Message);
			return false;
		});
	}

	createOrder(createOrderInfo) {
		debugger;
		return client.post("/Order/Create", createOrderInfo, "application/json").then((res) => {
			if (res.body.Success) {
				if (typeof res.body.Data !== "undefined" && res.body.Data !== null
					&& typeof res.body.Data.OrderInfo !== "undefined" && res.body.Data.OrderInfo !== null
					&& res.body.Data.OrderInfo.HasSucceed === true) {
					let pnos = [];
					for (let i = 0; i < res.body.Data.OrderInfo.ReturnData.Items.length; i++) {
						let item = res.body.Data.OrderInfo.ReturnData.Items[i];
						pnos.push({ ProductSysNo: item.ProductSysNo });
					}
					this.removeShoppingCartProducts(pnos)
				}
				return res.body;
			}
			throwError(res.body.Message);
			return false;
		});
	}

	//添加到购物车
	addProductToLocalStorage(productSysNo, quantity, productName, productImage, currentPrice) {
		let shoppingCartProductList = Cache.getCache(keys.ShoppingCartCookie);
		if (Object.is(shoppingCartProductList, null) || Object.is(shoppingCartProductList, undefined)) {
			shoppingCartProductList = [];
		}
		let newCartProductList = [];
		shoppingCartProductList.map(product => {
			if (product.ProductSysNo === productSysNo) {
				newCartProductList.push({ ProductSysNo: productSysNo, Quantity: product.Quantity + quantity, Selected: true, ProductName: productName, DefaultImage: productImage, CurrentPrice: currentPrice,AddDate:`${new Date().getTime()}` });
			}
			else {
				newCartProductList.push(product);
			}
		});
		let index = newCartProductList.findIndex(product => { return product.ProductSysNo === productSysNo });
		if (index < 0) {
			newCartProductList.push({ ProductSysNo: productSysNo, Quantity: quantity, Selected: true, ProductName: productName, DefaultImage: productImage, CurrentPrice: currentPrice,AddDate:new Date().getTime()});
		}
		Cache.setCache(keys.ShoppingCartCookie, newCartProductList);
	}

	//立即购买
	buyNow(productSysNo, quantity, productName, productImage, currentPrice) {
		let shoppingCartProductList = Cache.getCache(keys.ShoppingCartCookie);
		if (Object.is(shoppingCartProductList, null) || Object.is(shoppingCartProductList, undefined)) {
			shoppingCartProductList = [];
		}
		let newCartProductList = [];
		shoppingCartProductList.map(product => {
			if (product.ProductSysNo === productSysNo) {
				newCartProductList.push({ ProductSysNo: productSysNo, Quantity: product.Quantity + quantity, Selected: true, ProductName: productName, DefaultImage: productImage, CurrentPrice: currentPrice ,AddDate:new Date().getTime()});
			}
			else {
				newCartProductList.push(Object.assign(product,{Selected: false}));
			}
		});
		let index = newCartProductList.findIndex(product => { return product.ProductSysNo === productSysNo });
		if (index < 0) {
			newCartProductList.push({ ProductSysNo: productSysNo, Quantity: quantity, Selected: true, ProductName: productName, DefaultImage: productImage, CurrentPrice: currentPrice,AddDate:new Date().getTime() });
		}
		Cache.setCache(keys.ShoppingCartCookie, newCartProductList);
	}

	//从购物车中获取选中的商品
	getSelectedProductsFromShoppingCart() {
		let shoppingCartProductList = Cache.getCache(keys.ShoppingCartCookie);
		if (Object.is(shoppingCartProductList, null) || Object.is(shoppingCartProductList, undefined)) {
			shoppingCartProductList = [];
		}
		let newCartProductList = [];
		shoppingCartProductList.map(product => {
			if (product.Selected) {
				newCartProductList.push(product);
			}
		});
		return { Products: newCartProductList };
	}

	//获得购物车商品件数
	getShoppingCartProductCount() {
		let shoppingCartProductList = Cache.getCache(keys.ShoppingCartCookie);
		if (!Object.is(shoppingCartProductList, null) && !Object.is(shoppingCartProductList, undefined)) {
			let totalCount = 0;
			shoppingCartProductList.map(product => {
				totalCount += product.Quantity;
			});
			if(totalCount>99)
			{
				return "99+";
			}
			return totalCount;
		}
		return "";
	}

	getSelectedProductsCount() {
		let shoppingCartProductList = Cache.getCache(keys.ShoppingCartCookie);
		if (!Object.is(shoppingCartProductList, null) && !Object.is(shoppingCartProductList, undefined)) {
			let totalCount = 0;
			shoppingCartProductList.map(product => {
				if (product.Selected) {
					totalCount += product.Quantity;
				}
			});
			return totalCount;
		}
		return "";
	}

	//清空购物车
	removeAllShoppingCartProducts() {
		Cache.removeCache(keys.ShoppingCartCookie);
	}

	//删除下单成功的商品，格式[{ProductSysNo:XXX,Qyantity:XXX}]
	removeShoppingCartProducts(products) {
		if (!Object.is(products, null) && !Object.is(products, undefined)) {
			let shoppingCartProductList = Cache.getCache(keys.ShoppingCartCookie);
			if (!Object.is(shoppingCartProductList, null) && !Object.is(shoppingCartProductList, undefined)) {
				let newCartProductList = [];
				shoppingCartProductList.map(product => {
					let index = products.findIndex(selectedProduct => { return selectedProduct.ProductSysNo === product.ProductSysNo });
					if (index < 0) {
						newCartProductList.push(product);
					}
				});
				Cache.setCache(keys.ShoppingCartCookie, newCartProductList);
			}
		}
	}

	createComment(request) {
		if (!Object.is(request, null) && !Object.is(request, undefined)) {
			let url = "/ProductComment/CreateComment";
			return client.post(url, request).then((response) => {
				return response;
			});
		}
		return new Promise((resolve, reject) => { reject(); });
	}

	getProductComment(sosysno, productSysNo) {
		let url = "/ProductComment/GetProductComment";
		if (!Object.is(sosysno, null) && !Object.is(sosysno, undefined) && !Object.is(productSysNo, null) && !Object.is(productSysNo, undefined)) {
			url = `${url}?sosysno=${sosysno}&productSysNo=${productSysNo}`;
			return client.get(url).then((response) => {
				return response;
			});
		}
		return new Promise((resolve, reject) => { reject(); });
	}

	voidso(sosysno) {
	   return client.post("/Order/AbandonSO",{sosysno}).then((res)=>{
            if (res.body.Success) {
                return res.body.Data;
            }
            throwError(res.body.Message);
            return false;
        });
	}


//获取销售员列表（对应后台员工列表）
	getSalerList() {
		return client.get("/Common/GetSalerList")
			.then((res) => {
				if (res.body.Success) {
					return res.body.Data;
				}
				throwError(res.body.Message);
				return false;
			})
	}
}

export default new OrderService();