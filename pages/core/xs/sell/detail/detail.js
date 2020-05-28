// pages/core/xs/detail/detail.js

Page({
  data: {
    showMore: false,
    orderList: [],
    order: {}
  },
  onLoad: function (options) {
    var queryBean = JSON.parse(decodeURIComponent(options.carts));
    var info = JSON.parse(options.info);
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