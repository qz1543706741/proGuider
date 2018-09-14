Page({

  /**
   * 页面的初始数据
   */
  data: {
    myList: [{ id: 1, title: "我的查询记录" }, { id: 2, title: "我的发布记录" }],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  link: function (e) {
    console.log(e)
    var name = e.currentTarget.dataset.title;
    switch (name) {
      case "1": {
        if (e.currentTarget.dataset.id == 1) {
          wx.navigateTo({
            url: '../../pages/myrecoder/myrecoder',
          })
          console.log(111111111)
        } else {
          wx.navigateTo({
            url: '../../pages/myrelease/myrelease',
          })
        }
      }
        break;
    }



  }

})




