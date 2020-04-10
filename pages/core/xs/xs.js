Page({
  data: {
    name: '',
    contact: '',
    location: '',
  },
  navigateToBuy: function () {
    wx.navigateTo({
      url: './buy/buy',
      success: function (res) {
        console.log("跳转成功");
      }
    })
  },
  navigateToSell: function () {
    wx.navigateTo({
      url: './sell/cart/cart',
      success: function (res) {
        console.log("跳转成功");
      }
    })
  }
})