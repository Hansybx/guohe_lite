// pages/core/library/library.js
var Constant = require('../../../lib/js/constant.js')
var HttpUtils = require('../../../lib/js/http-utils.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["推荐", "查询"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    inputShowed: false,
    inputVal: "",
    dataList: [],
    isLoad: true,
    error: '',
  },

  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });

  },

  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  getLibrary() {
    this.setData({
      isLoad: true
    })
    console.log(this.data.inputVal)
    var account = wx.getStorageSync('account');
    if (account) {
      var data = {
        username: account.username,
        password: account.password,
        bookName: this.data.bookName
      }
      HttpUtils._post(
        Constant.LIBRARY,
        data,
        this.getLibrarySuccess,
        this.getLibraryFailed
      )
    } else {
      console.log('未登录')
      wx.showModal({
        title: '提示',
        content: '请先用教务系统账号登录',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.navigateTo({
              url: '/pages/login/login',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },

  getLibrarySuccess: function (res) {
    if (res.data.code != 200) {
      this.setData({
        error: "馆藏查询失败",
        isLoad: false,
      })
    } else {
      var result = res.data.info
      console.log(result)
      for (var i = 0; i < result.length; i++) {
        result[i].book_url = result[i].book_url.split("=").pop()

      }
      this.setData({
        dataList: result,
        isLoad: false
      })
    }
  },

  getLibraryFailed: function (e) {
    this.setData({
      error: "馆藏查询失败",
      isLoad: false,
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.getLibrary()

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      isLoad: true
    })

    this.getLibrary()
  },
})