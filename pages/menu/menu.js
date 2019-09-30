Page({

  /**
   * 页面的初始数据
   */
  data: {
    serviceList: [
      {
        id: 1,
        title: "院校招生信息查询"
      },
       {
       id: 2,
        title: "同学校不同专业信息对比"
      },
       {
        id: 3,
        title: "同专业不同学校信息对比"
      }
    ],
    releaseList: [
      {
        id: 1,
        title: "向学生推荐导师"
      }, 
      {
        id: 2,
        title: "向导师推荐学生"
      }, 
      {
        id: 3,
        title: "生成推荐报告"
      }
    ],
    searchList: [
      {
        id: 1,
        title: "常见问题列表"
      }, 
      {
        id: 2,
        title: "问题反馈"
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  link: function(e) {
    console.log(e)
    var name = e.currentTarget.dataset.title;
    switch (name) {
      case "0":
          if(e.currentTarget.dataset.id == 1){
            wx.navigateTo({
              url: '../../pages/searchSchool/searchSchool',
            })
          }
          break;
      case "1":
        {
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
      case "2":
        {
          // if (e.currentTarget.dataset.id == 1) {
          //   wx.navigateTo({
          //     url: '../../pages/search/search',
          //   })
          // } else  {
          //   wx.navigateTo({
          //     url: '../../pages/searchStudent/searchStudent',
          //   })
          // }

          switch (e.currentTarget.dataset.id) {
            case 1:
              wx.navigateTo({
                url: '../../pages/search/search',
              })
              break;
            case 2:
              wx.navigateTo({
                url: '../../pages/searchStudent/searchStudent',
              })
              break;
            
          }
        }
        break;
    }
  }

})