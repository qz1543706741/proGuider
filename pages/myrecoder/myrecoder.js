var app = getApp()
var globalUrl = getApp().globalData.globalUrl
Page({
  data: {
    open: false,
    items: [],
    startX: 0, //开始坐标
    startY: 0
  },
  onLoad: function () {
    if (this.data.items.length == 0) {
      this.setData({
        open: true
      })
    }
    else {
      this.setData({
        open: false
      })
    }

  },

  onShow: function () {
    var openid = wx.getStorageSync("openId")
    console.log("++++++++++++++++++++" + openid)
    let _this = this;
    var params = {
      'userId': openid
    }
    wx.showLoading({
      title: '加载中'
    })
    console.log(params)
    wx.request({
      url: globalUrl + '/GetUserRecord',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      method: 'POST',
      data: params,
      success: function (res) {
        console.log(res.data)
        if (res.data != null && res.data.length > 0) {
          setTimeout(function () {
            wx.hideLoading()
          }, 500)
          const newlist = [];
          for (var i = 0; i < res.data.length; i++) {
            newlist.push(res.data[i])
          }
          var list_length = newlist.length
            _this.setData({
              items: newlist,
              open: false
            })
        }
        else {
          setTimeout(function () {
            wx.hideLoading()
          }, 500)
          _this.setData({
            open: true
          })
        }

      }
    })

  },





  goSearch: function (e) {
    console.log(e)
    var tutorId = e.currentTarget.dataset.params.tutorId
    var that = this;
     if (tutorId!=0){
     wx.request({
        url: globalUrl + '/GetTutorById',
        //仅为示例，并非真实的接口地址
        data: {
          id: tutorId
        },
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        method: 'POST',
        success: function (res) {
          delete res.data.url;
            wx.navigateTo({
              url: '../../pages/tutordetail/tutordetail?list=' + JSON.stringify(res.data),
            })
        }
        })
    }else{
           wx.navigateTo({
             url: '../../pages/search/search?list=' + JSON.stringify(e.currentTarget.dataset.params)
           })
      
    }

    
  },

})

