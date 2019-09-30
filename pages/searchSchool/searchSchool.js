var common = require('../../utils/data.js')
var globalUrl = getApp().globalData.globalUrl
Page({
  data: {
    schoolItemSelectedMajorInfoList2: [{
      schoolName: "上海交通大学",
      majorInfo: [{
        'FushiFirstNum': 0,
        'FushiTiaoji': 0,
        'EnrollNum': 0,
        'ScoreTotal': 0,
        'Score100': 0
      }, {
        'FushiFirstNum': 1,
        'FushiTiaoji': 1,
        'EnrollNum': 1,
        'ScoreTotal': 1,
        'Score100': 1
      }]
    }],
    selectfuntion: true,
    showsearch: false, //显示搜索按钮
    searchtext: '', //搜索文字
    filterdata: {}, //筛选条件数据
    showfilter: false, //是否显示下拉筛选
    showfilterindex: true, //显示哪个筛选类目
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

    modalShow: false,
    modalShow1: false,
    modalShow2: false,
    majorItemSelected: [],
    majorItemSelectedList: [],
    majorItemSelectedListSize: '',
    schoolItemSelected: [],
    schoolItemSelectedList: [],
    schoolItemSelectedMajorInfoList1: [],
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
    years: ['2017', '2018', '2019'],
    subSchoolList: [],
    subSchoolListSearchByMajor: [],
    subMajorList: [],
    tableTitleList: ["年份", "复试人数", "录取人数", "接受调剂人数", "接受推免人数", "复试线"],
    tableTitleList2: ["学校", "复试人数", "录取人数", "接受调剂人数", "接受推免人数", "复试线"],
    subResultList2017: '',
    subResultList2018: '',
    subResultList2019: '',
    subSelectResultList2017: [],
    subSelectResultList2018: [],
    subSelectResultList2019: [],
    schoolTitleList: ["查看同专业其他学校信息", "查看同学校其他专业信息"],
    listHidden: false,
    listSearchByModalView: true,
    itemSelectId: '',

    area:'' //A区B区
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
      //this.dataRequest();
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
      //this.dataRequest();
    }
  },


  dataRequest: function() {
    let _this = this;
    var userId = wx.getStorageSync("openId")
    var params = {
      'name': this.data.name,
      'provinceId': this.data.provinceId,
      'majorId': this.data.majorId,
      'schoolId': this.data.schoolId,
      'title': this.data.title,
      'pager': this.data.pager,
      'tutorId': this.data.tutorId,
    }

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


        if (res.data != null && res.data.length > 0) {
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
          setTimeout(function() {
            wx.hideLoading()
          }, 2000)
        }
        if (_this.data.selectfuntion) {
          params.userId = userId
          params.tutorId = 0
          params.schoolName = _this.data.schoolName
          params.majorName1 = _this.data.majorName
          params.majorId = _this.data.majorId
          params.province = _this.data.provinceName
          wx.request({
            url: globalUrl + '/PutUserRecord',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            data: params,
            success: function(res) {
              //console.log("成功记录搜索用户行为！")
            }
          })
        }
        _this.setData({
          selectfuntion: true
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
    var showfilterindex1 = this.data.showfilterindex;
    this.setData({
      showfilterindex: !showfilterindex1,
      listSearchByModalView: true,

    })

    //console.log(this.data.showfilterindex )
  },

  setSubsortIndex: function(e) { //服务类别二级索引
    const dataset = e.currentTarget.dataset;

    this.setData({
      servicelist: [],
      //showfilterindex: null,
      pager: 1,
      subsortindex: dataset.subsortindex,
      provinceId: dataset.subsortid,
      provinceName: dataset.title

    })

    this.getSubSchool();
    //this.dataRequest();

  },

  setSchoolIndex: function(e) { //服务城市一级索引
    const dataset = e.currentTarget.dataset;

    this.setData({
      servicelist: [],
      pager: 1,
      schoolindex: dataset.schoolindex,
      schoolId: dataset.schoolid,
      schoolName: dataset.schoolname

      // showfilterindex: null,
    })

    this.getSubMajor();
    //this.dataRequest();
  },

  setMajorIndex: function(e) {
    const dataset = e.currentTarget.dataset;
    this.setData({
      majorindex: dataset.majorindex,
      majorId: dataset.majorid,
      majorName: dataset.majorname,
      showfilterindex: null,
      servicelist: [],
      subResultList: [],
      pager: 1,
      listHidden: false,
      modalShow1: false,
    })

    this.majorDataRequest();
    this.dataRequest();

  },

  majorDataRequest: function() {
    var sort = common.filterdata.sort;

    //查找学校所在区（A/B）
    for(let i = 1;i<3;i++){
      for (let j = 0; j < sort[i].subsort.length; j++) {
        if (sort[i].subsort[j].id == this.data.provinceId) {
          this.data.area = sort[i].id;
          break;
        }
      }
    }
    let that = this;
    var params1 = [{
      'area':this.data.area,//地区码
      'MajorCode': this.data.majorId,//专业ID
      'MajorName': this.data.majorName,
      'SchoolName': this.data.schoolName,
      'Year': '2017'
    }, {
      'area': this.data.area,
      'MajorCode': this.data.majorId,
      'MajorName': this.data.majorName,
      'SchoolName': this.data.schoolName,
      'Year': '2018'
    }, {
      'area': this.data.area,
      'MajorCode': this.data.majorId,
      'MajorName': this.data.majorName,
      'SchoolName': this.data.schoolName,
      'Year': '2019'
    }]
    wx.showLoading({
      title: '加载中'
    })
    for (let i = 0; i < 3; i++) {
      wx.request({
        url: globalUrl + '/GetEnrollInfo',
        //url: 'http://localhost:8080' + '/GetEnrollInfo',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        data: params1[i],
        success: function(res) {

          //that.setData
          if (res.data == null) {
            setTimeout(function() {
              wx.hideLoading()
            }, 1000)
            wx.showLoading({
              title: '暂无更多数据',
            })

          } else {
            //var subResultList1 = "subResultList["+i+"]";
            //把Jsondui对象转化为数组
            // var subResultList = [];
            // for (let i in res.data){
            //   let o={};

            //   o[i]=res.data[i]
            //   subResultList.push(o)
            // }

            switch (i) {

              case 0:
                that.setData({
                  subResultList2017: res.data
                })
                break;
              case 1:
                that.setData({
                  subResultList2018: res.data
                })
                break;
              case 2:
                that.setData({
                  subResultList2019: res.data
                })
                break;
            }
            // that.setData({
            //   subResultList: res.data
            // })
          }
        }
      })
    }

    setTimeout(function() {
      wx.hideLoading()
    }, 1000)

  },

  schoolSelectDataRequest: function() {
    let that = this;
    let schoolItemSelectedMajorInfoList = [];
    let list2017 = [];
    let list2018 = [];
    let list2019 = [];
    for (let j = 0; j < this.data.schoolItemSelectedList.length; j++) {
      let schooList = {
        schoolName: this.data.schoolItemSelectedList[j].schoolName,
        majorInfo: []
      }
      let params1 = [{
        'MajorName': this.data.majorName,
        'SchoolName': this.data.schoolItemSelectedList[j].schoolName,
        'Year': '2017'
      }, {
        'MajorName': this.data.majorName,
        'SchoolName': this.data.schoolItemSelectedList[j].schoolName,
        'Year': '2018'
      }, {
        'MajorName': this.data.majorName,
        'SchoolName': this.data.schoolItemSelectedList[j].schoolName,
        'Year': '2019'
      }]
      wx.showLoading({
        title: '加载中'
      })
      //console.log("j"+j)
      for (let i = 0; i < 3; i++) {
        //console.log("i"+i)
        wx.request({
          url: globalUrl + '/GetEnrollInfo',
          //url: 'http://localhost:8080' + '/GetEnrollInfo',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          method: 'POST',
          data: params1[i],
          success: function(res) {
            console.log(params1[i])
            if (params1[i].years == "2017") {
              list2017.concat(params1[i]);
            } else if (params1[i].years == "2018") {
              list2018.concat(params1[i]);
            } else if (params1[i].years == "2019") {
              list2019.concat(params1[i]);
            }
            if (res.data == null) {
              setTimeout(function() {
                wx.hideLoading()
              }, 1000)
              wx.showLoading({
                title: '暂无更多数据',
              })

            } else {

              switch (i) {
                case 0:
                  //schooList.majorInfo.push(res.data)
                  schooList.majorInfo[i] = res.data;
                  console.log(schooList.majorInfo[i]);
                  break;
                case 1:
                  //schooList.majorInfo.push(res.data) 
                  schooList.majorInfo[i] = res.data;
                  break;
                case 2:
                  //schooList.majorInfo.push(res.data)
                  schooList.majorInfo[i] = res.data;
                  console.log(schooList.majorInfo[i]);
                  break;
              }

            }
            // console.log(that.data.schoolItemSelectedMajorInfoList1)
            // that.setData({
            //   schoolItemSelectedMajorInfoList1: schoolItemSelectedMajorInfoList
            // })
            // console.log(that.data.schoolItemSelectedMajorInfoList1)
          },
          complete: function() {
            //schoolItemSelectedMajorInfoList.push(schooList)
            that.setData({
              schoolItemSelectedMajorInfoList1: schoolItemSelectedMajorInfoList
            })
          }
        })
      }

      schoolItemSelectedMajorInfoList.push(schooList)
      //console.log(schoolItemSelectedMajorInfoList)
      setTimeout(function() {
        wx.hideLoading()
      }, 1000)
    }



  },

  majorSelectDataRequest: function() {
    let that = this;
    //console.log(this.data.majorItemSelectedList)
    //console.log("349")
    for (let j = 0; j < this.data.majorItemSelectedList.length; j++) {
      console.log(j)
      let params1 = {
        'MajorName': this.data.majorItemSelectedList[j].zymc,
        'SchoolName': this.data.schoolName,
        'Year': '2017'
      }
      wx.showLoading({
        title: '加载中'
      })
      wx.request({
        url: globalUrl + '/GetEnrollInfo',
        //url: 'http://localhost:8080' + '/GetEnrollInfo',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        data: params1,
        success: function(res) {
          if (res.data == null) {
            setTimeout(function() {
              wx.hideLoading()
            }, 1000)
            wx.showLoading({
              title: '暂无更多数据',
            })

          } else {
            that.setData({
              ["subSelectResultList2017[" + j + "]"]: res.data
            })
            console.log(res.data)
            //console.log(that.data.subSelectResultList2017)
          }
        }

      })
      console.log("subSelectResultList2017:")
      console.log(that.data.subSelectResultList2017)
    }

    for (let k = 0; k < this.data.majorItemSelectedList.length; k++) {
      console.log(k)
      let params2 = {
        'MajorName': this.data.majorItemSelectedList[k].zymc,
        'SchoolName': this.data.schoolName,
        'Year': '2018'
      }
      console.log(params2.MajorName)
      wx.showLoading({
        title: '加载中'
      })
      wx.request({
        url: globalUrl + '/GetEnrollInfo',
        //url: 'http://localhost:8080' + '/GetEnrollInfo',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        data: params2,
        success: function(res) {
          if (res.data == null) {
            setTimeout(function() {
              wx.hideLoading()
            }, 1000)
            wx.showLoading({
              title: '暂无更多数据',
            })

          } else {
            that.setData({
              ["subSelectResultList2018[" + k + "]"]: res.data
            })
            console.log(res.data)
          }
        }

      })
      console.log("subSelectResultList2018:")
      console.log(that.data.subSelectResultList2018)
    }

    for (let l = 0; l < this.data.majorItemSelectedList.length; l++) {
      console.log(l)
      let params3 = {
        'MajorName': this.data.majorItemSelectedList[l].zymc,
        'SchoolName': this.data.schoolName,
        'Year': '2019'
      }
      wx.showLoading({
        title: '加载中'
      })
      wx.request({
        url: globalUrl + '/GetEnrollInfo',
        //url: 'http://localhost:8080' + '/GetEnrollInfo',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        data: params3,
        success: function(res) {
          if (res.data == null) {
            setTimeout(function() {
              wx.hideLoading()
            }, 1000)
            wx.showLoading({
              title: '暂无更多数据',
            })

          } else {
            that.setData({
              ["subSelectResultList2019[" + l + "]"]: res.data
            })
            console.log(res.data)
          }
        }

      })
      console.log("subSelectResultList2019:")
      console.log(that.data.subSelectResultList2019)
    }





    setTimeout(function() {
      wx.hideLoading()
    }, 1000)
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
      showfilterindex: 1,
      subMajorList: [],
      bindSource: [],
      provinceName: '',
      provinceId: '',
      subsortindex: 0,
      subSchoolList: []
    })
    this.dataRequest();
  },
  notChoice2: function() {
    this.setData({
      servicelist: [],
      pager: 1,
      majorId: '',
      majorName: '',
      showfilterindex: 1,
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
          if (this.data.provinceId == '') {
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
            })
          } else {
            this.data.subMajorList.forEach(function(e) {
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

  getSubMajor: function() {
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
      success: function(res) {


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

  schoolTitleEvent: function() {
    this.setData({
      modalShow: true
    })
  },

  schoolTitleSelectEvent: function(e) {
    const dataset = e.currentTarget.dataset;
    var that = this;
    //var modalShow2 = this.data.modalShow
    that.setData({
      modalShow: false,
      servicelist: [],
      subResultList: [],
      listHidden: true,
      itemSelectId: dataset.selectid
    })

    switch (dataset.selectid) {
      case 0:
        {
          this.getSchoolListSearchByMajor()
          that.setData({
            modalShow2: true,
          })
          console.log("599")
          break;
        }
      case 1:
        var newList = []
        for (let i = 0; i < that.data.subMajorList.length; i++) {
          newList[i] = true;
        }
        that.setData({
          modalShow1: true,
          majorItemSelected: newList
        })
        console.log("newList:");
        console.log(newList);
        break;
    }
  },



  getSchoolListSearchByMajor: function(e) {
    var that = this
    wx.request({
      url: globalUrl + '/GetSchoolByMajor',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: {
        'MajorName': that.data.majorName
      },
      success: function(res) {

        that.setData({
          subSchoolListSearchByMajor: res.data
        })

        //初始列表不被选取
        var newList = []
        for (let i = 0; i < that.data.subSchoolListSearchByMajor.length; i++) {
          newList[i] = true;
        }

        that.setData({
          schoolItemSelected: newList
        })

      }

    })

  },

  getMajorItemSelectList: function(e) {

    const dataset = e.currentTarget.dataset;
    var majorItemSelected1 = this.data.majorItemSelected[dataset.selectid]
    var majorItemSelectedListSize1 = 0
    var majorItemSelectedList1 = [];
    this.setData({
      majorItemSelectedList: [],
      ["majorItemSelected[" + dataset.selectid + "]"]: !majorItemSelected1
    })

    for (let i = 0; i < this.data.majorItemSelected.length; i++) {
      if (this.data.majorItemSelected[i] == false) {
        majorItemSelectedList1.push(this.data.subMajorList[i])
        majorItemSelectedListSize1++
      }
    }
    this.setData({
      majorItemSelectedList: majorItemSelectedList1,
      majorItemSelectedListSize: majorItemSelectedListSize1
    })
    console.log(this.data.majorItemSelectedList)
    console.log(this.data.majorItemSelectedListSize)
  },

  getSchooltemSelectList: function(e) {

    const dataset = e.currentTarget.dataset;
    var schoolItemSelected1 = this.data.schoolItemSelected[dataset.selectid]

    var schoolItemSelectedList1 = [];
    this.setData({
      schoolItemSelectedList: [],
      ["schoolItemSelected[" + dataset.selectid + "]"]: !schoolItemSelected1
    })

    for (let i = 0; i < this.data.schoolItemSelected.length; i++) {
      if (this.data.schoolItemSelected[i] == false) {
        schoolItemSelectedList1.push(this.data.subSchoolListSearchByMajor[i])
      }
    }
    this.setData({
      schoolItemSelectedList: schoolItemSelectedList1
    })
    console.log(this.data.schoolItemSelectedList)
  },

  myConfirm: function(e) {
    let that = this

    this.setData({
      modalShow1: false,
      modalShow2: false,
      listSearchByModalView: false
    })

    this.schoolSelectDataRequest()
    // this.setData({
    //   schoolItemSelectedMajorInfoList1: that.data.schoolItemSelectedMajorInfoList1
    // })
    this.majorSelectDataRequest()

    //console.log(this.data.majorItemSelectedListSize)

    if (this.data.majorItemSelectedListSize === 1)
      this.setData({
        listHidden: false,
        majorName: that.data.majorItemSelectedList[0].zymc,
        subResultList2017: that.data.subSelectResultList2017[0],
        subResultList2018: that.data.subSelectResultList2018[0],
        subResultList2019: that.data.subSelectResultList2019[0]
      })
  },

  //跳转复试人数详情页
  getEnrollList: function(e) {
    
    var year = e.currentTarget.dataset.year;
    if (e.currentTarget.dataset.index == 1) {
      this.enrollRequest(this.data.provinceName, year, this.data.schoolName, this.data.majorName);
    } else {
      var name = e.currentTarget.dataset.name;
      var list = this.data.schoolItemSelectedList;
      var province;
      for (let i = 0; i < list.length; i++) {
        if (list[i].schoolName == name) {
          province = list[i].provinceName;
          break;
        }
      }
      console.log("province"+province);
      console.log("year" +year);
      console.log("name" +name);
      console.log("majorName" +this.data.majorName);
      this.enrollRequest(province,year, name, this.data.majorName);
    }

  },

  enrollRequest: function (provinceName,year,schoolName, majorName){
    wx.request({
      url: globalUrl + '/GetEnrollList',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: {
        enrollYear: year,
        schoolName: schoolName,
        majorName, majorName
      },
      success: function (res) {
        console.log(res.data);
        if(res.data != ""){
          wx.navigateTo({
            url: '../enrolllist/enrolllist?provinceName=' + JSON.stringify(provinceName) + '&&schoolName=' + JSON.stringify(schoolName) + '&&majorName=' + JSON.stringify(majorName) + '&&year=' + year + "&&admissionList=" + JSON.stringify(res.data),
          })
        }else{
          wx.showToast({
            title: '暂无更多信息!',
            icon:'none',
            duration: 2000
          })
        }
      }
    })
  }


})