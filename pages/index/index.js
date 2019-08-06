//index.js
//获取应用实例
var app = getApp();
var order = ['red', 'yellow', 'blue', 'green', 'red']
var util = require('../../utils/util.js');
var Constant = require('../../utils/constant.js')
var HttpUtils = require('../../utils/http-utils.js')
var Bmob = require('../../utils/Bmob-1.6.7.min.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    toast: '',
    music_flag: true,
    news_flag: true,
    todayData: [],
    tdIsNull: true,
    toView: 'red',
    scrollTop: 100,
    cores: [], //首页头部的图标item
    semester: '',
    card: {},
    user: {},
    disabledItemTap: false, //点击了不可用的页面
    isTodayKb: false, //判断今天是否有课,true表示有课，false表示没有课
    todayKb: [], //今天的课的数组
    //日知录部分的相关信息
    oneImg: '',
    oneWord: '',
    oneWordFrom: '',
    oneDate: '',
    oneImgAuthor: '',
    // 顶部活动预告
    activities: [{
        url: 'https://ytools.xyz/1563601360904.jpg'
      },
      {
        url: 'https://ytools.xyz/1234_abcd_2019071521512553.jpg'
      },
      {
        url: 'https://ytools.xyz/1562404410698.jpg'
      }
    ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.onLoad()
  },
  onLoad: function() {
    Bmob.initialize("9e77d93cb20fc1422dcc80b7084f65f6", "12e3371ba93881c4f71043c7ab7740c7");

    //初始化首页头部信息
    this.initHeader()

    //获取学生的校历信息
    this.getXiaoli()

    //获取云端推送消息
    this.getMess()

    //初始化首页课表信息
    this.initTodayKb()

    //获取日知录信息
    this.getOneContent()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
    wx.getStorage({
      key: 'music_flag',
      success: function(res) {
        that.setData({
          music_flag: res.data
        })
      },
    })
    wx.getStorage({
      key: 'news_flag',
      success: function(res) {
        that.setData({
          news_flag: res.data
        })
      },
    })

    this.initTodayKb()
  },

  tap: function(e) {
    for (var i = 0; i < order.length; ++i) {
      if (order[i] === this.data.toView) {
        this.setData({
          toView: order[i + 1]
        })
        break
      }
    }
  },
  tapMove: function(e) {
    this.setData({
      scrollTop: this.data.scrollTop + 10
    })
  },

  //获取云端推送消息
  getMess: function() {
    var that = this
    const query = Bmob.Query("push_message");
    query.find().then(res => {
      var message = res[res.length - 1]['content']
      console.log(message)
      that.setData({
        toast: message
      })
    });
  },

  //获取日知录信息
  getOneContent: function() {
    var that = this
    util.getOneContent(function(data) {
      var data = data.data
      that.setData({
        oneImg: data.img_url,
        oneWord: data.forward,
        oneWordFrom: data.words_info,
        oneDate: data.post_date.split(' ')[0].replace(/\-/g, "\/"),
        oneImgAuthor: data.title + ' | ' + data.pic_info
      })
    })
  },

  //获取校历信息
  getXiaoli: function() {
    console.log('获取校历信息')
    var that = this
    try {
      //查看是否已经登录
      var account = wx.getStorageSync('account')
      if (account) {
        //已经登陆
        var username = account.username;
        var password = account.password;
        var param = {
          'username': username,
          'password': password
        }
        console.log(param)
        //发送获取学生校历信息的请求
        HttpUtils._post(
          Constant.XIAO_LI,
          param,
          //两个回调函数
          this.getXiaoliSuccess,
          this.getXiaoliFail
        )
      } else {
        //没有登录
        wx.navigateTo({
          url: '/pages/login/login',
        })
      }
    } catch (e) {
      // Do something when catch error
      console.log(e)
    }
  },

  //获取校历成功的回掉函数
  getXiaoliSuccess: function(res) {
    console.log('获取校历成功的回掉函数:')
    console.log(res)
    if (res.data.code == 500) {
      wx.showToast({
        title: '教务系统异常',
        icon: 'loading'
      })
    }
    if (res.data.code == 200) {
      //全部校历信息
      var info = res.data.info;
      console.log(info)
      //该学生全部学年信息
      var all_year = info['allYear'];
      //当前周次
      var weekNum = info['weekNum'];
      try {
        wx.setStorageSync('all_year', all_year)
        if (weekNum > 0 && weekNum < 21)
          wx.setStorageSync('week_num', weekNum)
        else
          wx.setStorageSync('week_num', 1)
      } catch (e) {
        console.log(e)
      }
    }
  },

  //获取校历失败的回掉函数
  getXiaoliFail: function(e) {
    console.log('获取校历失败的回掉函数：' + e)
  },

  //点击首页的item跳转到相应的页面
  navigateTo: function(event) {
    var info = event.currentTarget.dataset.info
    console.log(info)
    var id = info.id
    var enable = info.enable
    if (id == 'kb') {
      this.showAllKb()
    } else {
      if (!enable) {
        wx.showModal({
          title: '👷‍♀️',
          content: '前方施工，敬请期待！',
        })
      } else {
        wx.navigateTo({
          url: '/pages/core/' + id + '/' + id
        })
      }
    }
  },

  //初始化首页头部内容
  initHeader: function() {
    var that = this
    const query = Bmob.Query("header");
    var headers = new Array();
    query.find().then(res => {
      for (var i = 0; i < res.length; i++) {
        var obj = new Object();
        obj.name = res[i]['name']
        obj.id = res[i]['id']
        obj.order = res[i]['order']
        // 判断是否显示在前端
        obj.isShow = res[i]['isShow']
        // 判断能否使用
        obj.enable = res[i]['enable']
        headers.push(obj)
      }
      that.setData({
        //根据order的次序排序
        cores: headers.sort(util.compareByKeys('order')),
      })
    });

    this.setData({
      // cores: Constant.CORE,
      card: Constant.CARD
    })
  },

  //初始化首页课表信息
  initTodayKb: function() {
    var that = this
    var todayKbList = []
    try {
      var allKb = wx.getStorageSync('allKb')
      var value = wx.getStorageSync('week_num')
      var week = 1
      if (value) {
        if (value > 0 && value < 21)
          week = value
      }
      if (allKb) {
        var date = new Date().getDay()
        for (var i = 0; i < allKb.length; i++) {
          var o = allKb[i]
          if (o.xqj == date) {
            var zhouci = o.des.split('@')[3]
            var zhoucis = zhouci.substring(-1, zhouci.length - 3).split(',')
            for (var j = 0; j < zhoucis.length; j++) {
              var ss = zhoucis[j].split('-')
              var begin = ss[0]
              var end = ss[1]
              if (week >= begin && week <= end || week == begin || week == end) {
                console.log(o)
                var jieci = o.skjc
                var couese = o.des.split('@')
                var cName = couese[1]
                var cRoom = couese[4]
                var day = {
                  "when": jieci + "-" + (new Number(jieci) + 1),
                  "what": cName,
                  "where": cRoom,
                };
                if (day) {
                  todayKbList.push(day)
                }
              }
            }
          }
        }
      }
    } catch (e) {
      console.log('今日课表获取失败：' + e)
    }
    if (todayKbList.length > 0) {
      this.setData({
        todayKb: todayKbList,
        isTodayKb: true
      })
    }
  },

  //点击图片弹出大图
  imgPreview: function() {
    var imgUrl = this.data.oneImg
    var urls = []
    if (imgUrl) {
      urls.push(imgUrl)
      wx.previewImage({
        urls: urls // 需要预览的图片http链接列表
      })
    }
  },

  //显示完整课表
  showAllKb: function() {
    wx.switchTab({
      url: '../core/kb/kb',
    })
  },

  // 显示活动信息
  showActInfo: function(event) {
    var info = event.currentTarget.dataset.info
    console.log(info)
  }
})