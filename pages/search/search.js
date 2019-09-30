var common = require('../../utils/data.js')
var globalUrl = getApp().globalData.globalUrl
Page({
  data: {
    selectfuntion: true,
    showsearch: false, //显示搜索按钮
    searchtext: '', //搜索文字
    filterdata: {}, //筛选条件数据
    showfilter: false, //是否显示下拉筛选
    showfilterindex: null, //显示哪个筛选类目
    sortindex: 0, //一级分类索引
    sortid: null, //一级分类id
    subsortindex: 0, //二级分类索引
    subsortid: 0, //二级分类id
    titleindex: 0, //一级城市索引
    titleid: null, //一级城市id
    schoolarray: [],
    schoolindex: 0,
    majorarray: [],
    majorindex: 0,
    bindSource: [],
    open: true,
    servicelist: [], //服务集市列表


    name: '',
    provinceId: '',
    provinceName: '',
    schoolId: '',
    schoolName: '',
    majorId: '',
    majorName: '',
    title: '', 
    pager: 1, //分页
    list: [],

    subSchoolList: [],
    subMajorList:[],
  },
  onLoad: function(options) { //加载数据渲染页面
    this.fetchFilterData();
    if (JSON.stringify(options) !== '{}') {
      this.setData({
        list: JSON.parse(options.list)
      })
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
    } else {
      this.setData({
        name: wx.getStorageSync("name"),
        majorId: wx.getStorageSync("majorId"),
        majorName: wx.getStorageSync("majorName"),
        provinceId: wx.getStorageSync("provinceId"),
        provinceName: wx.getStorageSync("provinceName"),
        schoolName: wx.getStorageSync("schoolName"),
        title: wx.getStorageSync("title"),
        schoolId: wx.getStorageSync("schoolId"),
        subSchoolList: wx.getStorageSync("subSchoolList"),
        subMajorList: wx.getStorageSync("subMajorList"),
        pager: 1,
        selectfuntion: false,
      })
      this.dataRequest();
    }
  },


  dataRequest: function() {
    let _this = this;
    var userId = wx.getStorageSync("openId");
    var params = {
      'name': this.data.name,
      'provinceId': this.data.provinceId,
      'majorId': this.data.majorId,
      'schoolId': this.data.schoolId,
      'title': this.data.title,
      'pager': this.data.pager,
      'tutorId':this.data.tutorId,
    }
    console.log("params:")
    console.log(params)
    wx.showLoading({
      title: '加载中'
    })
    wx.request({
      url: globalUrl + '/GetTutorById',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: params,
      success: function(res) {
        console.log("res.data:")
        console.log(res.data)
        if (res.data != null && res.data.length > 0) {
          _this.showDeleteBtn(params);
          setTimeout(function() {
            wx.hideLoading()
          }, 500)
          const newlist = [];
          for (var i = 0; i < res.data.length; i++) {
            newlist.push(res.data[i])
          }
          _this.setData({
            servicelist: _this.data.servicelist.concat(newlist)
          })
        } else {
          wx.showLoading({
            title: '暂无更多数据'
          })
          setTimeout(function() {
            wx.hideLoading()
          }, 2000)
        }
        if (_this.data.selectfuntion) {
          params.userId = userId;
          params.tutorId = 0;
          params.schoolName = _this.data.schoolName;
          params.majorName = _this.data.majorName;
          params.provinceName = _this.data.provinceName;

          _this.showDeleteBtn(params);

          wx.request({
            url: globalUrl + '/PutUserRecord',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            data: params,
            success: function(res) {
              console.log("成功记录搜索用户行为！")
            }
          })
        }
        _this.setData({
          selectfuntion: true,
        })
      }
    })
  },


  fetchFilterData: function() { //获取筛选条件
    this.setData({
      filterdata: common.filterdata,
      schoolarray: common.filterdata.school,
      majorarray: common.filterdata.major,

    })
  },

  inputSearch: function(e) { //输入搜索文字
    this.setData({
      showsearch: e.detail.cursor > 0,
      searchtext: e.detail.value
    })
  },
  submitSearch: function() { //提交搜索
    this.setData({
      servicelist: [],
      pager: 1,
      name: this.data.searchtext
    })
    this.dataRequest();
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

      if(i==2){
        this.setData({
          showfilter: true,
          showfilterindex: i,
          bindSource: this.data.subSchoolList
        })
      } else if (i == 3){
        this.setData({
          showfilter: true,
          showfilterindex: i,
          bindSource: this.data.subMajorList
        })
      }else{
        this.setData({
          showfilter: true,
          showfilterindex: i,
          bindSource: []
        })
      }
    
    }

  },

  setSortIndex: function(e) { //服务类别一级索引
    const d = this.data;
    const dataset = e.currentTarget.dataset;
    if (dataset.sortid == 0) {
      this.setData({
        servicelist: [],
        provinceId: '',
        pager: 1,
        showfilterindex: null,
        provinceName: '',
        subSchoolList:[],
        subMajorList: []
      })
      this.dataRequest();
    }
    this.setData({
      sortindex: dataset.sortindex,
      sortid: dataset.sortid,
      subsortindex: d.sortindex == dataset.sortindex ? d.subsortindex : 0
    })
  },


  setSubsortIndex: function(e) { //服务类别二级索引
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

    this.getSubSchool();
    this.dataRequest();

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
    this.getSubMajor();
    this.dataRequest();
  },

  setMajorIndex: function(e) {
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

  setTitleIndex: function(e) { //服务城市一级索引
    const dataset = e.currentTarget.dataset;
    if (dataset.titleindex == 0) {
      this.setData({
        title: ''
      })
    } else {
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

  hideFilter: function() { //关闭筛选面板
    this.setData({
      showfilter: false,
      showfilterindex: null,
      bindSource: []
    })
  },
  scrollLoading: function() { //滚动加载
    this.setData({
      pager: this.data.pager + 1,
      selectfuntion: false
    })
    this.dataRequest();
  },

  gotutordetail: function(e) {
    var that = this;
    var id = e.currentTarget.dataset.id
    var userId = wx.getStorageSync("openId")
    wx.request({
      url: globalUrl + '/GetTutorById',
      //仅为示例，并非真实的接口地址
      data: {
        id: id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
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
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          method: 'POST',
          success: function(res) {
            console.log("成功记录用户行为！")
          }
        })
      },
      fail: function(res) {
        wx.navigateTo({
          url: '../../pages/tutordetail/tutordetail',
        })
      }
    })
  },

  notChoice: function() {
    this.setData({
      servicelist: [],
      pager: 1,
      schoolId: '',
      schoolName: '',
      showfilterindex: null,
      subMajorList:[],
      bindSource:[]
    })
    this.dataRequest();
  },
  notChoice2: function() {
    this.setData({
      servicelist: [],
      pager: 1,
      majorId: '',
      majorName: '',
      showfilterindex: null,
      bindSource: []
    })
    this.dataRequest();
  },

  bindblurSearch: function(e) {
    if (e.detail.value == '') {
      this.setData({
        name: ''
      })
    }
    console.log(e)
  },

  bindinput: function(e) {

    this.setData({
      open: true
    })
    var prefix = e.detail.value //用户实时输入值
    var newSource = [] //匹配的结果
    var name = e.currentTarget.dataset.findex
    if (prefix != "") {
      switch (name) {
        case "1":
          if (this.data.provinceId =='') {
            this.data.schoolarray.forEach(function(e) {
              if (e.schoolName.indexOf(prefix) != -1) {
                newSource.push(e)
              }
            })
          } else {
            this.data.subSchoolList.forEach(function(e) {
              if (e.schoolName.indexOf(prefix) != -1) {
                newSource.push(e)
              }
            })
          }

          break;
        case "2":
          if (this.data.schoolId == '') {
          this.data.majorarray.forEach(function(e) {
            if (e.zymc.indexOf(prefix) != -1) {
              newSource.push(e)
            }
          })}else{
            this.data.subMajorList.forEach(function (e) {
              if (e.zymc.indexOf(prefix) != -1) {
                newSource.push(e)
              }
            })
          }
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

  getSubSchool: function() {
    var that = this
    that.setData({
      subSchoolList: []
    })
    console.log(that.data.provinceId)
    wx.request({
      url: globalUrl + '/GetSubSchoolList',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: {
        provinceId: that.data.provinceId
      },
      success: function(res) {
        that.setData({
          subSchoolList: res.data
        })
      }

    })
  },

  getSubMajor: function () {
    var that = this
    that.setData({
      subMajorList: []
    })
    wx.request({
      url: globalUrl + '/GetSubMajorList',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: {
        schoolId: that.data.schoolId
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          subMajorList: res.data
        })
      }

    })
  },

  onHide: function() {
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
  onUnload: function() {
    wx.setStorageSync("name", this.data.name)
    wx.setStorageSync("provinceId", this.data.provinceId)
    wx.setStorageSync("majorId", this.data.majorId)
    wx.setStorageSync("schoolId", this.data.schoolId)
    wx.setStorageSync("title", this.data.title)
    wx.setStorageSync("majorName", this.data.majorName)
    wx.setStorageSync("schoolName", this.data.schoolName)
    wx.setStorageSync("provinceName", this.data.provinceName)
    wx.setStorageSync("subSchoolList", this.data.subSchoolList)
    wx.setStorageSync("subMajorList", this.data.subMajorList)
  },

  deleteSearchCache:function(){
    wx.showLoading({
      title: '清除成功!'
    })

    setTimeout(function () {
      wx.hideLoading()
    }, 1000)

    this.setData({
      name: '',
      provinceId: '',
      provinceName: '',
      schoolId: '',
      schoolName: '',
      majorId: '',
      majorName: '',
      title:'',
      showDelete:false
    })
    
    wx.setStorageSync("name", this.data.name)
    wx.setStorageSync("provinceId", this.data.provinceId)
    wx.setStorageSync("provinceName", this.data.provinceName)
    wx.setStorageSync("schoolId", this.data.schoolId)
    wx.setStorageSync("schoolName", this.data.schoolName)
    wx.setStorageSync("majorId", this.data.majorId)
    wx.setStorageSync("majorName", this.data.majorName)
    wx.setStorageSync("majorName", this.data.title)
  },
  showDeleteBtn: function (params){
    var flag = false;
    if (params.majorId != "") {
      flag = true;
    }
    if (params.name != "") {
      flag = true;
    }
    if (params.provinceId != "") {
      flag = true;
    }
    if (params.schoolId != "") {
      flag = true;
    }
    if (params.title != "") {
      flag = true;
    }
    this.setData({
      showDelete: flag
    })
  }
})