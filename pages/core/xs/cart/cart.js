// pages/core/xs/mall/mall.js

var HttpUtils = require('../../../../lib/js/http-utils');
var Constant = require('../../../../lib/js/constant');

var Carts = [];

Page({
  data: {
    carts: [], // 购物车列表
    hasList: false, // 列表是否有数据
    totalPrice: 0, // 总价，初始为0
    selectAllStatus: true, // 全选状态，默认全选
    obj: {
      name: "hello"
    },
    address: ''

  },
  onShow() {
    this.getTotalPrice();
  },
  /**
   * 当前商品选中事件
   */
  selectList(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    const selected = carts[index].selected;
    carts[index].selected = !selected;
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
  },

  /**
   * 删除购物车当前商品
   */
  deleteList(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    carts.splice(index, 1);
    this.setData({
      carts: carts
    });
    if (!carts.length) {
      this.setData({
        hasList: false
      });
    } else {
      this.getTotalPrice();
    }
  },

  /**
   * 购物车全选事件
   */
  selectAll(e) {
    let selectAllStatus = this.data.selectAllStatus;
    selectAllStatus = !selectAllStatus;
    let carts = this.data.carts;

    for (let i = 0; i < carts.length; i++) {
      carts[i].selected = selectAllStatus;
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      carts: carts
    });
    this.getTotalPrice();
  },

  /**
   * 绑定加数量事件
   */
  addCount(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    let num = carts[index].num;
    num = num + 1;
    carts[index].num = num;
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
  },

  /**
   * 绑定减数量事件
   */
  minusCount(e) {
    const index = e.currentTarget.dataset.index;
    const obj = e.currentTarget.dataset.obj;
    let carts = this.data.carts;
    let num = carts[index].num;
    if (num <= 1) {
      return false;
    }
    num = num - 1;
    carts[index].num = num;
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
  },

  /**
   * 计算总价
   */
  getTotalPrice() {
    let carts = this.data.carts; // 获取购物车列表
    let total = 0;
    let count = 0;
    for (let i = 0; i < carts.length; i++) { // 循环列表得到每个数据
      if (carts[i].selected) { // 判断选中才会计算价格
        total += carts[i].num * carts[i].price; // 所有价格加起来
        count += carts[i].num; // 所有数量加起来
      }
    }
    this.setData({ // 最后赋值到data中渲染到页面
      carts: carts,
      totalPrice: total.toFixed(2),
      totalCount: count
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
    wx.showLoading({
      title: '加载中…'
    })
    var that = this;
    HttpUtils._get(
      Constant.XS_ISBN + qrresult,
      // 验证成功
      function success(res) {
        wx.hideLoading()
        if (res.data.code != 200) {
          wx.showToast({
            icon: 'none',
            title: res.data.msg,
          })
        } else {
          var info = res.data.info;
          var idx = that.isExisted(info);
          if (idx == -1) {
            var obj = new Object();
            obj['id'] = info.bid;
            obj['title'] = info.name;
            obj['image'] = info.img;
            obj['num'] = 1;
            obj['price'] = info.price;
            obj['selected'] = true;
            Carts.push(obj);
          } else {
            Carts[idx]['num'] += 1;
          }
          that.setData({
            hasList: true,
            carts: Carts
          })
          that.getTotalPrice();
        }
      },
      // 验证失败
      function failed(e) {
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '网络异常,请稍后重试',
        })
      },
    )
  },

  // 判断当前扫描的书是否在已添加列表中
  isExisted: function (info) {
    for (var i = 0; i < Carts.length; i++) {
      if (info.bid == Carts[i]['id']) {
        return i;
      }
    }
    return -1;
  },

  // 跳转到订单页
  navigateToOrders: function () {
    // 使用encodeURIComponent是为了防止数据量太大
    var queryBean = encodeURIComponent(JSON.stringify(this.data.carts));
    var address = encodeURIComponent(JSON.stringify(this.data.address));
    wx.navigateTo({
      url: '../orders/orders?carts=' + queryBean + "&address=" + address,
    })
  },

  /**
   * 地址绑定事件
   */
  addressInput: function (e) {
    this.setData({
      address: e.detail.value
    })
  },


  onUnload: function () {
    Carts = [];
  }
})