var Constant = require('../../../utils/constant');
var HttpUtils = require('../../../utils/http-utils');
var toastr = require('../../../utils/toastr-wxapp');


Page({
  data: {
    is_sell: true, //判断是卖书还是买书
    name: '',
    contact: '',
    location: '',
    isbn: '点我扫描',
  },
  // 切换卖书/买书状态
  changeStatus: function () {
    this.setData({
      is_sell: !this.data.is_sell
    });
  },
  // 扫描条形码
  scanCode: function () {
    var _this = this;
    wx.scanCode({ //扫描API
      success: function (res) {
        console.log(res); //输出回调信息
        _this.verifyISBN(res.result);

      }
    })
  },
  // 验证条形码是否合法
  verifyISBN: function (qrresult) {
    HttpUtils._get(
      Constant.XS_ISBN,
      // 验证成功
      function success(res) {
        if (res.data.code != 200) {
          toastr.error({
            title: 'res.data.msg',
            duration: 1000,
          });
        } else {
          this.setData({
            isbn: qrresult
          });
        }
      },
      // 验证失败
      function failed(res) {
        toastr.error({
          title: '网络异常,请稍后重试',
          duration: 1000,
        });
      },
    )
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

          // 如果是卖书，就再添加一个字段
          if (that.data.is_sell) {
            param['isbn'] = that.data.isbn
          }

          var jsonText = JSON.stringify(param);
          
          // 根据状态切换url
          var url = that.data.is_sell ? Constant.XS_ORDER_SELL : Constant.XS_ORDER_BUY;

          //发送订单请求
          HttpUtils._post_json(
            url,
            jsonText,
            //两个回调函数
            that.orderSellSuccess,
            that.orderSellFail
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
  orderSellSuccess: function (res) {
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
  orderSellFail: function (e) {
    toastr.error({
      title: '反馈失败,请稍后重试',
      duration: 1000,
    });
  }
})