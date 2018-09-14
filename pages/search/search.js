var common = require('../../utils/data.js')
var globalUrl = getApp().globalData.globalUrl
Page({
  data: {
    selectfuntion:true,
    showsearch: false,   //显示搜索按钮
    searchtext: '',  //搜索文字
    filterdata: {},  //筛选条件数据
    showfilter: false, //是否显示下拉筛选
    showfilterindex: null, //显示哪个筛选类目
    sortindex: 0,  //一级分类索引
    sortid: null,  //一级分类id
    subsortindex: 0, //二级分类索引
    subsortid: 0, //二级分类id
    titleindex: 0,  //一级城市索引
    titleid: null,  //一级城市id
    schoolarray:[],
    schoolindex:0,
    majorarray:[],
    majorindex:0,
    bindSource: [],
    open:false,
    servicelist: [], //服务集市列表
   
    name: '',
    provinceId:'',
    provinceName:'',
    schoolId: '',
    schoolName: '',
    majorId: '',
    majorName:'',    
    title: '',
    pager: 1,  //分页
    list:[]

  },
  onLoad: function (options) { //加载数据渲染页面
    this.fetchFilterData();
    if (JSON.stringify(options) !== '{}'){
    this.setData({ list: JSON.parse(options.list)})
    this.setData({
      name: this.data.list.name,
      majorId: this.data.list.majorId,
      majorName: this.data.list.majorName,
      provinceId: this.data.list.provinceId,
      provinceName: this.data.list.provinceName,
      schoolName: this.data.list.schoolName,
      title: this.data.list.title,
      schoolId: this.data.list.schoolId,
      pager: 1,
      selectfuntion: false, 
    })
    this.dataRequest();
    }else{
      this.setData({
        name: wx.getStorageSync("name"),
        majorId: wx.getStorageSync("majorId"),
        majorName: wx.getStorageSync("majorName"),
        provinceId: wx.getStorageSync("provinceId"),
        provinceName: wx.getStorageSync("provinceName"),
        schoolName: wx.getStorageSync("schoolName"),
        title: wx.getStorageSync("title"),
        schoolId: wx.getStorageSync("schoolId"),
        pager: 1,
        selectfuntion: false,
      })
      console.log(this.data.selectfuntion)
      this.dataRequest();
      console.log(this.data.selectfuntion)
    }
  },

  onShow: function () {
   
  
  },

  dataRequest: function () {
    let _this = this;
    var userId = wx.getStorageSync("openId")
    var params = {
      'name': this.data.name,
      'provinceId': this.data.provinceId,
      'majorId': this.data.majorId,
      'schoolId': this.data.schoolId,
      'title': this.data.title,
      'pager': this.data.pager,    
    }
    wx.showLoading({
      title: '加载中'
    })
    console.log(params)
    wx.request({
      url: globalUrl + '/GetTutorById',
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
          _this.setData({
            servicelist: _this.data.servicelist.concat(newlist)
          })
        }
        else {
          wx.showLoading({
            title: '暂无更多数据'
          })
          setTimeout(function () {
            wx.hideLoading()
          }, 2000)
        }
        if (_this.data.selectfuntion){
        params.userId = userId
        params.tutorId=0
        params.schoolName = _this.data.schoolName
        params.majorName1 = _this.data.majorName
        params.province = _this.data.provinceName
        wx.request({
          url: globalUrl + '/PutUserRecord',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          method: 'POST',
          data: params,
          success: function (res) {
            console.log("==========")
          }
        })
      }
        _this.setData({
          selectfuntion: true
        })
      }
    })
  },


  fetchFilterData: function () { //获取筛选条件
   this.setData({
     filterdata: common.filterdata,
     schoolarray: common.filterdata.school,
     majorarray: common.filterdata.major,

   })
  },

  inputSearch: function (e) {  //输入搜索文字
    this.setData({
      showsearch: e.detail.cursor > 0,
      searchtext: e.detail.value
    })
  },
  submitSearch: function () {  //提交搜索
    this.setData({
      servicelist: [],
      pager:1,
      name:this.data.searchtext
    })
    this.dataRequest();
  },
  setFilterPanel: function (e) { //展开筛选面板 
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
        bindSource: []
      })
    }
   
  },

  setSortIndex: function (e) { //服务类别一级索引
    const d = this.data;
    const dataset = e.currentTarget.dataset;
    if (dataset.sortid==0){
      this.setData({
        servicelist: [],
        provinceId:'',
        pager:1,
        showfilterindex: null,
        provinceName:''
      })
      this.dataRequest();
    }
    this.setData({
      sortindex: dataset.sortindex,
      sortid: dataset.sortid,
      subsortindex: d.sortindex == dataset.sortindex ? d.subsortindex : 0
    })
    console.log('服务类别id：一级--+++' + this.data.sortid + ',二级--' + this.data.subsortid);
  },
  setSubsortIndex: function (e) { //服务类别二级索引
    const dataset = e.currentTarget.dataset;
    console.log(e);
    this.setData({
      servicelist: [],
      showfilterindex: null,
      pager: 1,
      subsortindex: dataset.subsortindex,
      provinceId: dataset.subsortid,
      provinceName: dataset.title
    })
    this.dataRequest();
    console.log('服务类别id：一级--' + this.data.sortid + ',二级--' + this.data.subsortid);
  },

  setSchoolIndex: function(e) { //服务城市一级索引
    const dataset = e.currentTarget.dataset;
    this.setData({
      schoolindex: dataset.schoolindex,
      schoolId: dataset.schoolid,
      schoolName: dataset.schoolname,
      showfilterindex: null,
      servicelist: [],
      pager: 1,
    })
    this.dataRequest();
  },

  setMajorIndex: function (e) {
    const dataset = e.currentTarget.dataset;
    this.setData({
      majorindex: dataset.majorindex,
      majorId: dataset.majorid,
      majorName: dataset.majorname,
      showfilterindex: null, 
      servicelist: [],
      pager: 1,
    })
    this.dataRequest();
  },

  setTitleIndex: function (e) { //服务城市一级索引
    const dataset = e.currentTarget.dataset;
    if (dataset.titleindex==0){
      this.setData({
        title:''
      })
    }else{
      this.setData({
        title: dataset.title
      })
    }
    this.setData({
      titleindex: dataset.titleindex,
      titleid: dataset.titleid,
      servicelist: [],
      pager: 1,
      showfilterindex: null,
    })
    this.dataRequest();
  },

  hideFilter: function () { //关闭筛选面板
    this.setData({
      showfilter: false,
      showfilterindex: null,
      bindSource: []
    })
  },
  scrollLoading: function () { //滚动加载
    this.setData({
      pager:this.data.pager+1,
      selectfuntion:false
    })
    this.dataRequest();
  },


  gotutordetail: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id
    var userId = wx.getStorageSync("openId")
    console.log("+++++++++++++"+id)
    wx.request({
      url: globalUrl +'/GetTutorById',
      //仅为示例，并非真实的接口地址
      data: {
        id: id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        delete res.data.url;
        wx.navigateTo({
          url: '../../pages/tutordetail/tutordetail?list=' + JSON.stringify(res.data),
        })

        wx.request({
          url: globalUrl + '/PutUserRecord',
          data: {
            userId: userId,
            tutorId: res.data.id,
            name: res.data.name
          },
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          method: 'POST',
          success: function (res) {
            console.log("++++++++++++++++++")
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

  notChoice:function(){
    this.setData({
      servicelist: [],
      pager: 1,
      schoolId: '',
      schoolName:'',
      showfilterindex: null,
    })
    this.dataRequest();
  },
  notChoice2: function () {
    this.setData({
      servicelist: [],
      pager:1,
      majorId: '',
      majorName:'',
      showfilterindex: null,
    })
    this.dataRequest();
  },

  bindblurSearch: function (e) {
    if (e.detail.value==''){
      this.setData({
        name:''
      })
    }
    console.log(e)
  },

  bindinput: function (e) {
    this.setData({
      open:true
    })
    var prefix = e.detail.value//用户实时输入值
    var newSource = []//匹配的结果
    var name = e.currentTarget.dataset.findex
    if (prefix != "") {
      switch (name) {
        case "1":
          this.data.schoolarray.forEach(function (e) {
            if (e.schoolName.indexOf(prefix) != -1) {
              newSource.push(e)
            }
          })
          break;
        case "2":
          this.data.majorarray.forEach(function (e) {
            if (e.name.indexOf(prefix) != -1) {
              newSource.push(e)
            }
          })
          break;
      }
      if (newSource.length != 0) {
        this.setData({
          bindSource: newSource
        })
      } else {
        this.setData({
          bindSource: []
        })
      }


    }
  },

  onHide: function () {
    wx.setStorageSync("name", this.data.name)
    wx.setStorageSync("provinceId", this.data.provinceId)
    wx.setStorageSync("majorId", this.data.majorId)
    wx.setStorageSync("schoolId", this.data.schoolId)
    wx.setStorageSync("title", this.data.title)
    wx.setStorageSync("majorName", this.data.majorName)
    wx.setStorageSync("schoolName", this.data.schoolName)
    wx.setStorageSync("provinceName", this.data.provinceName)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.setStorageSync("name", this.data.name)
    wx.setStorageSync("provinceId", this.data.provinceId)
    wx.setStorageSync("majorId", this.data.majorId)
    wx.setStorageSync("schoolId", this.data.schoolId)
    wx.setStorageSync("title", this.data.title)
    wx.setStorageSync("majorName", this.data.majorName)
    wx.setStorageSync("schoolName", this.data.schoolName)
    wx.setStorageSync("provinceName", this.data.provinceName)
  },


})