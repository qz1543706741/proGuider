
//index.js
//获取应用实例
var app = getApp();
var globalUrl = app.globalData.globalUrl
Page({
  data: {
    imageWidth:0,
    imgUrls: [],
    tutor_header:[],
    tutorlist:[],
    newlist:[],
    lastid:0,
    tutordetail:[]
  },
  onLoad: function () {
    this.loadData();
   
  },

  loadData: function (){
    wx.showLoading({
      title: '加载中'
    })
    var limit = 10 
    var that = this;
    this.setData({
      imgUrls: [
        'https://www.profguider.com/bktServer/sTutorImage/index_background1.png',
        'https://www.profguider.com/bktServer/sTutorImage/index_background2.png',
        'https://www.profguider.com/bktServer/sTutorImage/index_background3.png'
      ],
      imageWidth: wx.getSystemInfoSync().windowWidth
    })
    wx.request({
      url: globalUrl +'/GetRandomTutorData?pager=5',
      //仅为示例，并非真实的接口地址
      data: {
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data != null && res.data.length > 0) {
          setTimeout(function () {
            wx.hideLoading()
          }, 500)
        }
  
        for (var i = 0; i < res.data.length  ; i++){
           that.data.newlist.push(res.data[i])
         }
        
          that.setData({
            tutorlist: that.data.newlist
            })
      }
    })
  },

  

  gotutordetail:function(e){
    var that = this;
    var id = e.currentTarget.dataset.id
    var userid = wx.getStorageSync("openId")
    console.log(id)
    wx.request({
      url: globalUrl +'/GetTutorById',
      //仅为示例，并非真实的接口地址
      data: {
        id:id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        delete res.data.url;
        console.log(res.data);
        wx.navigateTo({
          url: '../../pages/tutordetail/tutordetail?list=' + JSON.stringify(res.data),
        }) 
        wx.request({
          url: globalUrl + '/PutUserRecord',
          data: {
            userId: userid,
            tutorId: res.data.id,
            name: res.data.name,
            provinceId:'',
            schoolId:'',
            majorId:'',
            title:''
          },
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          method: 'POST',
          success: function (res) {
    
          }
        })
      },
       fail: function (res) {
        wx.navigateTo({
          url: '../../pages/tutordetail/tutordetail',
        })
      }      
  })
  },
  searchTutor:function(){
    wx.navigateTo({
      url: '../../pages/search/search'
    })
  },
  searchStudent: function () {
    wx.navigateTo({
      url: '../../pages/searchstudent/searchstudent'
    })
  }




})
