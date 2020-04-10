/*
 * Author: simsir-lin
 * Github: https://github.com/simsir-lin
 * Email: 15986907592@163.com
 */

const SDKVersion = wx.getSystemInfoSync().SDKVersion || '1.0.0';
const [MAJOR, MINOR, PATCH] = SDKVersion.split('.').map(Number);
const IMAGEPATH = '/images/';

const canIUse = apiName => {
    if (apiName === 'showToast.image') {
        return MAJOR >= 1 && MINOR >= 1
    }
    return true
}

var timeId = 0

function ok(data, cb) {
    show(data, 'ok.png', cb)
}

function error(data, cb) {
    if (canIUse('showToast.image')) {
        show(data, 'error.png', cb)
    } else {
        wx.showModal({
            title: '提示',
            content: data.title || data
        })
    }
}

function warning(data, cb) {
    if (canIUse('showToast.image')) {
        show(data, 'warning.png', cb)
    } else {
        wx.showModal({
            title: '提示',
            content: data.title || data
        })
    }
}

function loading(data) {
    let fn
    if (wx.showLoading) {
        fn = wx.hideLoading
        wx.showLoading({
            title: data.title || data
        })
    } else {
        fn = function() {}
        wx.showToast({
            title: data.title || data,
            icon: 'loading',
            duration: data.duration || 3000
        })
    }
    return fn
}

function show(data, image, cb) {
    let title = ''
    let duration = 1000
    if (typeof data == 'object') {
        title = data.title
        duration = data.duration
    } else {
        title = data
    }
    wx.showToast({
        title: title,
        image: IMAGEPATH + image,
        duration: duration,
        complete: () => {
            if (cb) {
                timeId = setTimeout(function() {
                    clearTimeout(timeId)
                    cb()
                }, duration)
            }
        }
    })
}

module.exports = {
    ok: ok,
    warning: warning,
    loading: loading,
    error: error
}
