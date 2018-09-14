Page({

  /**
   * 页面的初始数据
   */
  data: {
    releaseList: [{ id: 1, title: "发布导师信息" }, { id: 2, title: "发布学生信息" }],
    searchList: [{ id: 1, title: "查询导师信息" }, { id: 2, title: "查询学生信息" }]
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
            url: '../../pages/release/release',
          })
          console.log(111111111)
        } else {
          wx.navigateTo({
            url: '../../pages/releaseStudent/releaseStudent',
          })
        }
      }
        break;
      case "2": {
        if (e.currentTarget.dataset.id == 1) {
          wx.navigateTo({
            url: '../../pages/search/search',
          })
        } else {
          wx.navigateTo({
            url: '../../pages/searchStudent/searchStudent',
          })
        }
      }
        break;
    }



  }

})