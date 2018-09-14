Page({

  /**
   * 页面的初始数据
   */
  data: {
    winHeight: 2000,
    tab:0,
    list:[],
    imageWidth: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      imageWidth: wx.getSystemInfoSync().windowWidth, 
      list: JSON.parse(options.list)
    })
  },

   tab_slide: function (e) {//滑动切换tab   
    var that = this;
    that.setData({tab: e.detail.current})
    
  },
  
  tab_click: function (e) {//点击tab切换  
    var that = this;
    if (that.data.tab == e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        tab: e.target.dataset.current
      })
    }
    console.log(e);
  },  
})

