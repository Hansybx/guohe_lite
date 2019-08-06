var HttpUtils = require('../../../utils/http-utils.js')
var Constant = require('../../../utils/constant.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: '',
    tabs: ["早操", "俱乐部"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    dataList: [],
    isLoad: true,
    showModal: true,
    inputVal: '', //密码框中输入的内容
    isNoPassword: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.isPassExisted();
  },

  //判断本地是否有体育密码
  isPassExisted: function() {
    console.log('判断本地是否有体育密码')
    var that = this;
    var password = '';
    wx.getStorage({
      key: 'sport',
      success(res) {
        //如果存在
        console.log('密码存在' + res.data)
        that.setData({
          isNoPassword: false
        })
        console.log(res.data)
        password = res.data;
        that.getExerciseData(password);
      },
    })
  },

  //密码对话框点击确定后
  onConfirm: function() {
    this.hideModal();

    //获取早操数据
    this.getExerciseData(this.data.inputVal)

  },

  //获取早操数据
  getExerciseData: function(password) {
    var account = wx.getStorageSync('account')

    if (account) {
      //已经登陆
      var username = account.username;
      console.log(username)
      console.log(password)
      var param = {
        'username': username,
        'password': password
      }
      //发送获取学生早操信息的请求
      HttpUtils._post(
        Constant.EXERCISE,
        param,
        //两个回调函数
        this.getExerciseSuccess,
        this.getExerciseFail
      )
    }
  },

  //获取早操信息成功的回调函数
  getExerciseSuccess: function(res) {
    if (res.data.code == 500) {
      wx.showToast({
        title: '体育系统异常',
        icon: 'loading'
      })
    }

    if (res.data.code == 200) {
      //响应成功，说明体育系统密码正确
      //如果当前是无密码状态，将密码缓存到本地
      if (this.data.isNoPassword) {
        wx.setStorageSync('sport', this.data.inputVal)
      }

      //全部早操信息
      var data = res.data.info;
      console.log(data);

      //更新早操数据
      this.setData({
        info: data[0].name + "\n" + data[0].sum + "\n" + data[0].year + data[0].total,
        isLoad: false,
        dataList: data[1],
      })
    } else {
      wx.showToast({
        title: res.data.msg,
        icon: 'loading'
      })
      this.setData({
        isLoad: false
      })
    }
  },

  //获取早操信息失败的回调函数
  getExerciseFail: function(res) {
    console.log(res)
    wx.showToast({
      title: '体育系统异常，请稍后重试',
      icon: 'loading'
    })
  },

  //tab切换时的操作
  tabClick: function(e) {
    //更换tab的状态
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
      isLoad: true,
    });

    var choice = e.currentTarget.id;
    //获取体育密码
    var password = wx.getStorageSync('sport');
    if (choice == 1) {
      this.getClubData(password);
    } else {
      this.getExerciseData(password);
    }
  },

  //获取俱乐部刷卡的数据
  getClubData: function(password) {
    var account = wx.getStorageSync('account')
    if (account) {
      //已经登陆
      var username = account.username;
      console.log(username)
      console.log(password)
      var param = {
        'username': username,
        'password': password
      }
      //发送获取学生早操信息的请求
      HttpUtils._post(
        Constant.CLUB,
        param,
        //两个回调函数
        this.getClubSuccess,
        this.getClubFail
      )
    }
  },

  //获取俱乐部刷卡信息成功的回调函数
  getClubSuccess: function(res) {
    console.log(res)
    if (res.data.code == 200) {
      console.log(res.data.info)
      var data = res.data.info;
      this.setData({
        info: data[0].name + "\n" + data[0].sum + "\n" + data[0].year + data[0].total,
        isLoad: false,
        dataList: data[1],
      })
    } else {
      wx.showToast({
        title: res.data.msg,
        icon: 'loading'
      })
      this.setData({
        isLoad: false
      })
    }
  },

  //获取俱乐部刷卡信息失败的回调函数
  getClubFail: function(e) {
    console.log(e)
  },

  showInfo() {
    console.log(this.data.info)
    wx.showModal({
      title: '小提示',
      showCancel: false,
      content: this.data.info,
      success: function(res) {
        console.log(res);
      }
    })
  },
  inputChange(e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  hideModal: function() {
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function() {
    this.hideModal();
    this.setData({
      isLoad: false
    })
    wx.navigateBack();
  },
  /**
   * 对话框确认按钮点击事件
   */
  showDialogBtn: function() {
    this.setData({
      showModal: true
    })
  },
})