Page({

  /**
   * 页面的初始数据
   */
  data: {
    myList: [{
        id: 1,
        title: "个人信息编辑"
      },
      {
        id: 2,
        title: "我的查询记录"
      },
      {
        id: 3,
        title: "我关注的导师"
      },
      {
        id: 4,
        title: "我的推荐报告"
      },
      {
        id: 5,
        title: "导师信息发布"
      },
      {
        id: 6,
        title: "我的反馈"
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  link: function(e) {
                                                                                               
    if (e.currentTarget.dataset.id == 1) {
      wx.navigateTo({
        url: '../../pages/myInformation/myInformation',
      })
    } else if (e.currentTarget.dataset.id == 2) {
      wx.navigateTo({
        url: '../../pages/myrecoder/myrecoder',
      })
    } else if (e.currentTarget.dataset.id == 3) {
      wx.navigateTo({
        url: '../../pages/myfocus/myfocus',
      })
    } else if (e.currentTarget.dataset.id == 4) {
      wx.navigateTo({
        url: '../../pages/myrecommend/myrecommend',
      })
    } else if (e.currentTarget.dataset.id == 5) {
      wx.navigateTo({
        url: '../../pages/myrelease/myrelease',
      })
    } else if (e.currentTarget.dataset.id == 6) {
      wx.navigateTo({
        url: '../../pages/myfeedback/myfeedback',
      })
    } else {
      wx.navigateTo({
        url: '../../pages/my/my',
      })
    }
  }

})