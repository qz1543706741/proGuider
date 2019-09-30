const util = require('../../utils/util.js')
var app = getApp();
var globalUrl = getApp().globalData.globalUrl
Page({
  /**
   * 页面的初始数据
   */
  data: {
    winHeight: 2000,
    tab: 0,
    list: [],
    imageWidth: 0,
    paperList: [],
    showList: [],
    levelList: [],
    majorList: [],
    yearList: [],
    showfilter: false,
    flag: 0,
    flag1: false,
    focus: null,
    focuscode: 0,
    attention: 0,
    on_off: 0,
    param:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    this.setData({
      imageWidth: wx.getSystemInfoSync().windowWidth,
      list: JSON.parse(options.list)
    })
    this.setData({
      attention: this.data.list.attention
    })
    this.getpaperlist();
    this.getifFocus();
  },



onHide:function(){
 console.log("隐藏")
  
},

  onUnload:function(){
    
    this.focus_click(this.data.param)
  },

  

  tab_slide: function(e) { //滑动切换tab   
    var that = this;
    that.setData({
      tab: e.detail.current
    })

  },

  getpaperlist: function() {
    var that = this
    wx.request({
      url: globalUrl + '/GetPaperListData',
      //仅为示例，并非真实的接口地址
      data: {
        tutor: that.data.list.name,
        school: that.data.list.schoolName
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function(res) {
        if (res.data != null && res.data.length > 0) {
          that.setData({
            paperList: res.data,
            showList: res.data,

          })
          that.getOptionList()

        } else {
          that.setData({
            flag1: true
          })
        }
      }
    })

  },

  tab_click: function(e) { //点击tab切换  
    var that = this;
    if (that.data.tab == e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        tab: e.target.dataset.current
      })
    }
  },

  gotitledetail: function(e) {
    wx.navigateTo({
      url: '../../pages/paperdetail/paperdetail?paperinfo=' + JSON.stringify(this.data.showList[e.currentTarget.dataset.index]),
    })
  },

  getOptionList: function() {
    var levelsData = []
    var yearsData = []
    var majorData = []
    for (var i = 0; i < this.data.paperList.length; i++) {
      var levels = this.data.paperList[i].levels
      var years = this.data.paperList[i].years
      var major = this.data.paperList[i].major
      if (levelsData.indexOf(levels) === -1) {
        levelsData.push(levels)
      }
      if (yearsData.indexOf(years) === -1) {
        yearsData.push(years)
      }
      if (majorData.indexOf(major) === -1) {
        majorData.push(major)
      }
    }
    this.setData({
      levelList: levelsData,
      yearList: yearsData,
      majorList: majorData
    })
  },


  setYearIndex: function(e) {
    const dataset = e.currentTarget.dataset;
    var year = e.currentTarget.dataset.year
    var showyear = []
    console.log(this.data.paperList);
    for (var i = 0; i < this.data.paperList.length; i++) {
      console.log(this.data.paperList[i]);
      if (this.data.paperList[i].years == year) {
        showyear.push(this.data.paperList[i])
      }
    }
    this.setData({
      showList: showyear,
      showfilter: false,
      showfilterindex: null,
    })

  },

  setLevelIndex: function(e) {
    const dataset = e.currentTarget.dataset;
    var level = e.currentTarget.dataset.level
    var showlevel = []
    console.log(this.data.paperList);
    for (var i = 0; i < this.data.paperList.length; i++) {
      if (this.data.paperList[i].levels == level) {
        showlevel.push(this.data.paperList[i])
      }
    }
    this.setData({
      showList: showlevel,
      showfilter: false,
      showfilterindex: null,
    })

  },

  setMajorIndex: function(e) {
    const dataset = e.currentTarget.dataset;
    var major = e.currentTarget.dataset.major
    var showmajor = []
    for (var i = 0; i < this.data.paperList.length; i++) {
      if (this.data.paperList[i].major == major) {
        showmajor.push(this.data.paperList[i])
      }
    }
    this.setData({
      showList: showmajor,
      showfilter: false,
      showfilterindex: null,
    })

  },



  setFilterPanel: function(e) { //展开筛选面板 
    const d = this.data;
    const i = e.currentTarget.dataset.findex;
    if (d.showfilterindex == i) {
      this.setData({
        showfilter: false,
        showfilterindex: null,
      })
    } else {
      this.setData({
        showfilter: true,
        showfilterindex: i,
      })
    }

  },
  hideFilter: function() { //关闭筛选面板
    this.setData({
      showfilter: false,
      showfilterindex: null,
    })
  },

  page_focus: function (e) {
    var that = this
    this.setData({
      param: e.currentTarget.dataset,
    })
    this.data.param.openid = wx.getStorageSync("openId")
    this.data.param.type=1
    this.data.param.tutorid = that.data.list.id
    if (this.data.focus) {
      wx.showModal({
        title: '提示',
        content: '确定取消关注',
        success(res) {
          if (res.confirm) {
            that.setData({
              focus: false,
              attention: parseInt(that.data.attention) - 1,
              on_off: 1
            })
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      this.setData({
        focus: true,
        attention: parseInt(this.data.attention) + 1,
        on_off: 2
      })
    }

  },


  focus_click: function (param) {
    var params=param
    var that = this

    if (this.data.on_off == 1) {
      wx.request({
        url: globalUrl + '/DeleteFocusById',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        data: {
          id: that.data.focuscode,
          tutorid: that.data.list.id,
          attention: parseInt(that.data.attention) 
        },
        success: function(res) {
          that.setData({
            on_off: 0
          })
        }
      })
    } else if (this.data.on_off == 2 && this.data.list.chioceFunction!=0) {
      params.attention = parseInt(that.data.attention)
      wx.request({
        url: globalUrl + '/AddFocus',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        data: params,
        success: function(res) {
          that.setData({
            on_off: 0
          })
        }
      })

    }
  },

  getifFocus: function() {
    var that = this
    var params = {}
    params.code = this.data.list.id;
    params.openid = wx.getStorageSync("openId")
    params.type = 1
    wx.request({
      url: globalUrl + '/GetFocusList',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: params,
      success: function(res) {
        if (res.data.length != 0) {
          that.setData({
            focus: true,
            focuscode: res.data[0].id
          })
        }
      }
    })
  }

})