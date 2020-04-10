// pages/core/xs/orders/orders.js

var HttpUtils = require('../../../../lib/js/http-utils');
var Constant = require('../../../../lib/js/constant');


Page({
  data: {
    totalPrice: 0,
    totalCount: 0, //商品总数
    orders: [],
    address: ''
  },

  onLoad: function (options) {
    var queryBean = JSON.parse(decodeURIComponent(options.carts));
    var address = JSON.parse(decodeURIComponent(options.address));
    this.setData({
      orders: queryBean,
      address: address
    })

  },

  onReady() {
    this.getTotalPrice();
  },

  onShow: function () {
    const self = this;
    wx.getStorage({
      key: 'address',
      success(res) {
        self.setData({
          address: res.data,
          hasAddress: true
        })
      }
    })
  },

  /**
   * 计算总价
   */
  getTotalPrice() {
    let orders = this.data.orders;
    let price = 0;
    let count = 0;
    for (let i = 0; i < orders.length; i++) {
      price += orders[i].num * orders[i].price;
      count += orders[i].num; // 所有数量加起来
    }
    this.setData({
      totalPrice: price,
      totalCount: count
    })
  },
  
  // 提交订单
  submitOrder: function () {

    wx.showLoading({
      title: '订单提交中...',
    })

    // 使用encodeURIComponent是为了防止数据量太大
    var carts = this.data.orders;
    var price = this.data.totalPrice;
    var count = this.data.totalCount;
    var address = this.data.address;

    var books = []
    console.log(carts)
    for (let cart of carts) {
      console.log(cart)
      var book = new Object();
      book['bid'] = cart['id']
      book['bname'] = cart['title']
      book['price'] = cart['price']
      book['count'] = cart['num']
      books.push(book)
    }

    console.log(books)

    var account = wx.getStorageSync('account');
    var param = new Object();
    param['uid'] = account.username
    param['address'] = address
    param['count'] = count
    param['price'] = price
    param['book_list'] = books

    var jsonText = JSON.stringify(param);
    console.log(jsonText)

    //发送订单请求
    HttpUtils._post_json(
      Constant.XS_ORDER_SELL,
      jsonText,
      //两个回调函数
      this.orderSellSuccess,
      this.orderSellFail
    )
  },

  orderSellSuccess: function (res) {
    wx.hideLoading()

    console.log(res)

    if (res.data.code != 200) {
      wx.showToast({
        title: res.data.msg,
        icon: "loading"
      })
    } else {
      var info = res.data.info;
      var queryBean = encodeURIComponent(JSON.stringify(this.data.orders));
      wx.redirectTo({
        url: '../detail/detail?carts=' + queryBean + '&info=' + JSON.stringify(info),
      })
    }

  },

  orderSellFail: function (e) {
    wx.showToast({
      icon: "none",
      title: '网络异常，请稍后重试',
    })
  }

})