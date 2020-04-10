var Constant = require('../../../lib/js/constant');
var HttpUtils = require('../../../lib/js/http-utils');
var toastr = require('../../../lib/js/toastr-wxapp');


Page({
  data: {
    name: '',
    contact: '',
    location: '',
    isbn: '点我扫描',
  },

  contactInput(e) {
    this.setData({
      contact: e.detail.value
    })
  },
  nameInput(e) {
    this.setData({
      name: e.detail.value
    })
  },
  locationInput(e) {
    this.setData({
      location: e.detail.value
    })
  },
  submit() {
    if (this.data.content != '' && this.data.contact != '') {
      var that = this
      wx.getStorage({
        key: 'account',
        success: function (res) {

          var param = {
            'name': that.data.name,
            'contact': that.data.contact,
            'location': that.data.location,
            'uid': res.data.username,
            'origin': '1'
          }

          var jsonText = JSON.stringify(param);

          //发送订单请求
          HttpUtils._post_json(
            Constant.XS_ORDER_BUY,
            jsonText,
            //两个回调函数
            that.orderBuySuccess,
            that.orderBuyFail
          )
        },
      })
    } else {
      wx.showToast({
        title: '数据不能为空',
        icon: 'none'
      })
    }
  },
  //反馈成功的回调函数
  orderBuySuccess: function (res) {
    console.log(res.data)
    if (res.data.code != 200) {
      toastr.error({
        title: '订单添加失败,请稍后重试',
        duration: 1000,
      });
    } else {
      wx.showToast({
        title: '成功添加订单',
        icon: 'success',
        duration: 2000
      })
    }
  },
  //反馈失败的回调函数
  orderBuyFail: function (e) {
    toastr.error({
      title: '反馈失败,请稍后重试',
      duration: 1000,
    });
  },
  navigateToSell: function () {
    wx.navigateTo({
      url: './cart/cart',
      success: function (res) {
        console.log("跳转成功");
      }
    })
  }
})