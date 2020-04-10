// pages/core/xs/detail/detail.js

Page({
  data: {
    // order_price: 0,
    // book_count: 0,
    showMore: false,
    orderList: [],
    order: {}
  },
  onLoad: function (options) {
    var queryBean = JSON.parse(decodeURIComponent(options.carts));
    var info = JSON.parse(options.info);
    console.log(info)
    this.setData({
      orderList: queryBean,
      order: info
    })
  },

  listToggle: function () {
    this.setData({
      showMore: !this.data.showMore
    })
  },

  onUnload: function () {
    wx.navigateBack()
  },
})