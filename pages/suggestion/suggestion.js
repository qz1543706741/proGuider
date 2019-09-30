var globalUrl = getApp().globalData.globalUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    suggestion:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  formSubmit:function(e){

    if (e.detail.value.suggestion==''){

      wx.showModal({
        title: '提示',
        content: '建议内容不能为空!',
        showCancel:false,
        success(res) {
      
        }
      })

     }else{
    var that = this
    var params=[]
    params.suggestion = e.detail.value.suggestion
    params.openid = wx.getStorageSync("openId")
    console.log(params)
    wx.request({
      url: globalUrl + '/AddUserSuggestion',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: params,
      success: function (res) {
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 1000
        })
      }

    })
    }
  }
  
})