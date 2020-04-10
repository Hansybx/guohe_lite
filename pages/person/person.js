var app = getApp()

let interstitialAd = null

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    info: {},
    appId: "wx8abaf00ee8c3202e",
    extraData: {
      id: 140296
    }
  },
  changeAccount() {
    wx.showModal({
      title: '提示',
      content: '确认切换账户吗？（将会清除缓存）',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.clearStorageSync()
          wx.navigateTo({
            url: '/pages/login/login',
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  onLoad: function () {
    // 在页面onLoad回调事件中创建插屏广告实例
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-a758944960a18f2b'
      })
      interstitialAd.onLoad(() => {})
      interstitialAd.onError((err) => {})
      interstitialAd.onClose(() => {})
    }
    var that = this
    wx.getStorage({
      key: 'account',
      success: function (res) {
        that.setData({
          info: res.data
        })
      },
    })
  },
  showAd: function () {
    console.log("显示广告")
    wx.showModal({
      title: '支持我们',
      content: '程序员小哥哥开发不易，如果你觉得「果核Lite」还不错，不妨点击「确定」按钮支持我们！',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          // 在适合的场景显示插屏广告
          if (interstitialAd) {
            interstitialAd.show().catch((err) => {
              console.error(err)
            })
          }
        }
      }
    })
  }
})