// pages/core/bus/bus.js
var sliderWidth = 96;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabs: ["东—南—西", "东——南"],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,
        listData1: [{
                "east": "7:30→",
                "south": "7:40→",
                "west": "7:50→",
                "tip": "1-7"
            },
            {
                "east": "7:50←",
                "south": "7:40←",
                "west": "7:30←",
                "tip": "1-7"
            },
            {
                "east": "9:20→",
                "south": "9:30→",
                "west": "9:40→",
                "tip": "1-7"
            },
            {
                "east": "10:15←",
                "south": "10:05←",
                "west": "9:55←",
                "tip": "1-6"
            },
            {
                "east": "11:50→",
                "south": "12:00→",
                "west": "12:10→",
                "tip": "1-7"
            },
            {
                "east": "12:10←",
                "south": "12:00←",
                "west": "11:50←",
                "tip": "1-7"
            },
            {
                "east": "13:35→",
                "south": "13:45→",
                "west": "13:55→",
                "tip": "1-7"
            },
            {
                "east": "13:55←",
                "south": "13:45←",
                "west": "13:35←",
                "tip": "1-7"
            },
            {
                "east": "15:15→",
                "south": "15:25→",
                "west": "15:35→",
                "tip": "1-6"
            },
            {
                "east": "16:15←",
                "south": "16:05←",
                "west": "15:55←",
                "tip": "1-6"
            },
            {
                "east": "17:40→",
                "south": "17:50→",
                "west": "18:00→",
                "tip": "1-7"
            },
            {
                "east": "18:00←",
                "south": "17:50←",
                "west": "17:40←",
                "tip": "1-7"
            },
            {
                "east": "18:30→",
                "south": "18:40→",
                "west": "18:50→",
                "tip": "1-7"
            },
            {
                "east": "19:50←",
                "south": "19:40←",
                "west": "19:30←",
                "tip": "1-6"
            },
            {
                "east": "21:15←",
                "south": "21:05←",
                "west": "20:55←",
                "tip": "1-5"
            },
            {
                "east": "22:05←",
                "south": "21:55←",
                "west": "21:45←",
                "tip": "1-7"
            },
        ],
        listData2: [{
                "east": "7:30→",
                "south": "7:40→",
                "tip": "1-5"
            },
            {
                "east": "7:55←",
                "south": "7:45←",
                "tip": "1-5"
            },
            {
                "east": "9:25→",
                "south": "9:35→",
                "tip": "1-5"
            },
            {
                "east": "10:05←",
                "south": "9:55←",
                "tip": "1-5"
            },
            {
                "east": "11:50→",
                "south": "12:05→",
                "tip": "1-5"
            },
            {
                "east": "12:05←",
                "south": "11:50←",
                "tip": "1-5"
            },
            {
                "east": "13:35→",
                "south": "13:45→",
                "tip": "1-5"
            },
            {
                "east": "13:55←",
                "south": "13:45←",
                "tip": "1-5"
            },
            {
                "east": "15:20→",
                "south": "15:30→",
                "tip": "1-5"
            },
            {
                "east": "16:05←",
                "south": "15:55←",
                "tip": "1-5"
            },
            {
                "east": "17:40→",
                "south": "17:55→",
                "tip": "1-5"
            },
            {
                "east": "17:50←",
                "south": "17:40←",
                "tip": "1-5"
            },
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
                    sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
                });
            }
        });
    },
    tabClick: function(e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        });

    },

    /**
     * 页面分享
     */
    onShareAppMessage: function(res) {
        return {
            title: '点击查看校车时刻',
            path: 'pages/core/bus/bus'
        }
    }

})