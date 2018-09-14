//app.js


App({

globalData:{
  globalUrl: 'https://www.profguider.com/bktServer'
//globalUrl: 'http://localhost:8080/zdserver'
},

  onLaunch: function () {
    // 展示本地存储能力
    var that=this
    // 登录
    wx.login({
      success: function (res) {
        that.getOpenId(res.code);
      }
    })
  },

  getOpenId: function (code) {
    var that = this
    var params = { 
      'appid': "wx1330e42447ea45ef",
      'secret': 'cc6449edb688ea6d8f162f6322c3eee8',
      'grant_type': 'authorization_code',
      'js_code': code, }
    wx.request({
      url: this.globalData.globalUrl+'/GetOpenId',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      method: 'POST',
      data: params,
      success: function (res) {
        console.log(res)
        wx.setStorageSync('openId', res.data.openid)                  
      }
    })
  },
})