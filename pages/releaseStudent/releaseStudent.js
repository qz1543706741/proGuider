//logs.js
var common = require('../../utils/data.js')
var util = require('../../utils/util.js');
var globalUrl = getApp().globalData.globalUrl
Page({
  data: {
    showfilter: false, //是否显示下拉筛选
    showfilterindex: null, //显示哪个筛选类目
    inputValue: '',//点击结果项之后替换到文本框的值
    inputValue1: '',
    inputValue2: '',
    inputValue3: '',
    inputValue4: '',
    schoolArray: [],//本地匹配源
    bindSource: [],//绑定到页面的数据，根据用户输入动态变化
    provinceArray: [],
    provinceindex: 0,
    majorArray: [],
    uploadimgs: [],

    name: '',
    qq: '',
    email: '',
    phone: '',
    introduction: '',
    politicsScore: '',
    foreginScore: '',
    profession1Score: '',
    profession2Score: '',
    request: '',
    choiceSchoolId: '',
    choiceSchoolName: '',
    choiceMajorId: '',
    choiceMajorName: '',
    adjustMajorId1: '',
    adjustMajorName1: '',
    adjustMajorId2: '',
    adjustMajorName2: '',
    adjustMajorId3: '',
    adjustMajorName3: '',
    socre: '',
    otherInfo: ''
  },
  onLoad: function () {
    this.fetchData()
  },

  formSubmit: function (e) {
    var that = this
    // if (e.detail.value.name == '' || this.data.titleindex == 0 || this.data.choiceSchoolId == '' || this.data.choiceSchoolName == '' || this.data.adjustMajorId1 == '' || this.data.adjustMajorName1 == '' ) {
    //   wx.showModal({
    //     title: '提示',
    //     content: '请填写必填项',
    //     showCancel: false
    //   })

    // }
    // else {
      // 调用函数时，传入new Date()参数，返回值是日期和时间  
      var releaseDate = util.formatTime(new Date());
      // 再通过setData更改Page()里面的data，动态更新页面的数据  
      var userid = wx.getStorageSync("openId")
      var params = []
      params = e.detail.value
      params.openid = userid
      params.releaseDate = releaseDate
      params.province = this.data.provinceArray[this.data.provinceindex].id
      params.choiceschoolid = this.data.choiceSchoolId
      params.choiceschoolname = this.data.choiceSchoolName
      params.adjustmajorid1 = this.data.adjustMajorId1
      params.adjustmajorname1 = this.data.adjustMajorName1
      params.adjustmajorid2 = this.data.adjustMajorId2
      params.adjustmajorname2 = this.data.adjustMajorName2
      params.adjustmajorid3 = this.data.adjustMajorId3
      params.adjustmajorname3 = this.data.adjustMajorName3
      params.choicemajorid = this.data.choiceMajorId
      params.choicemajorname = this.data.choiceMajorName
      console.log(params)
      wx.request({
        url: globalUrl + '/AddStudent',
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        method: 'POST',
        data: params,
        success: function (res) {
          wx.showModal({
            title: '提示',
            content: '发布成功',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                that.setData({
                  name: '',
                  inputValue: '',//点击结果项之后替换到文本框的值
                  inputValue1: '',
                  inputValue2: '',
                  inputValue3: '',
                  inputValue4: '',
                  provinceindex: 0,
                  qq: '',
                  email: '',
                  phone: '',
                  introduction: '',
                  politicsScore: '',
                  foreginScore: '',
                  profession1Score: '',
                  profession2Score: '',
                  score: '',
                  request: '',
                  choiceSchoolId: '',
                  choiceSchoolName: '',
                  choiceMajorId:'',
                  choiceMajorName:'',
                  adjustMajorId1: '',
                  adjustMajorName1: '',
                  adjustMajorId2: '',
                  adjustMajorName2: '',
                  adjustMajorId3: '',
                  adjustMajorName3: '',
                  score: ''
                })
              }
            }
          })
        },
        fail: function (res) {
          wx.showModal({
            title: '提示',
            content: '发布失败',
            confirmText: '重新发布',
            confirmColor: '#000000',
            showCancel: false
          })
        }
      })
    },
  //},

  formReset: function () {
    this.setData({
      titleindex: 0
    })
  },

  fetchData: function () {
    common.filterdata.province[0].title = "请选择",
      this.setData({
        provinceArray: common.filterdata.province,
        schoolArray: common.filterdata.school,
        majorArray: common.filterdata.major,
        bindSource1: []
      })
    console.log(this.data.provinceArray)
  },

  bindPickerChange: function (e) { //下拉选择
    const eindex = e.detail.value;
    const name = e.currentTarget.dataset.pickername;
    switch (name) {
      case 'province':
        this.setData({
          provinceindex: eindex
        })
        break;
      default:
        return
    }
  },


  bindinput: function (e) {
    console.log(e);
    var prefix = e.detail.value//用户实时输入值
    var newSource = []//匹配的结果
    var name = e.currentTarget.dataset.findex
    if (prefix != "") {
      switch (name) {
        case "1":
          this.data.schoolArray.forEach(function (e) {
            if (e.schoolName.indexOf(prefix) != -1) {
              newSource.push(e)
            }
          })
          break;
        case "2":
          this.data.majorArray.forEach(function (e) {
            if (e.name.indexOf(prefix) != -1) {
              newSource.push(e)
            }
          })
          break;
        case "3":
          this.data.majorArray.forEach(function (e) {
            if (e.name.indexOf(prefix) != -1) {
              newSource.push(e)
            }
          })
          break;
        case "4":
          this.data.majorArray.forEach(function (e) {
            if (e.name.indexOf(prefix) != -1) {
              newSource.push(e)
            }
          })
          break;
        case "5":
          this.data.majorArray.forEach(function (e) {
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
  itemtap: function (e) {
    console.log(e);
    var name = e.target.dataset.itemname;
    switch (name) {
      case "choiceSchool":
        this.setData({
          inputValue: e.target.dataset.id + ' ' + e.target.dataset.schoolname,
          choiceSchoolId: e.target.dataset.id,
          choiceSchoolName: e.target.dataset.schoolname
        })
        break;
      case "adjustMajor1":
        this.setData({
          inputValue1: e.target.dataset.id + ' ' + e.target.dataset.name,
          adjustMajorId1: e.target.dataset.id,
          adjustMajorName1: e.target.dataset.name
        })
        break;
      case "adjustMajor2":
        this.setData({
          inputValue2: e.target.dataset.id + ' ' + e.target.dataset.name,
          adjustMajorId2: e.target.dataset.id,
          adjustMajorName2: e.target.dataset.name
        })
        break;
      case "adjustMajor3":
        this.setData({
          inputValue3: e.target.dataset.id + ' ' + e.target.dataset.name,
          adjustMajorId3: e.target.dataset.id,
          adjustMajorName3: e.target.dataset.name
        })
        break;
      case "choiceMajor":
        this.setData({
          inputValue4: e.target.dataset.id + ' ' + e.target.dataset.name,
          choiceMajorId: e.target.dataset.id,
          choiceMajorName: e.target.dataset.name
        })
        break;
    }
    this.setData({
      bindSource: [],
      showfilter: false

    })
  },
  setFilterPanel: function (e) { //展开筛选面板
    const d = this.data;
    const i = e.currentTarget.dataset.findex;
    if (d.showfilterindex == i) {
      this.setData({
        showfilter: false,
        showfilterindex: null,
        bindSource: []
      })
    } else {
      this.setData({
        showfilter: true,
        showfilterindex: i,
        bindSource: [],
      })
    }
    console.log(d.showfilterindex);
  },
  hideFilter: function () { //关闭筛选面板
    this.setData({
      showfilter: false,
      showfilterindex: null,
      bindSource: []
    })
    console.log("+_++++++++++++++++++++++");
  },

  chooseImage: function () {
    let _this = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#00BFFF",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            _this.chooseWxImage('album')
          } else if (res.tapIndex == 1) {
            _this.chooseWxImage('camera')
          }
        }
      }
    })
  },
  chooseWxImage: function (type) {
    let _this = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        _this.setData({
          uploadimgs: res.tempFilePaths,
          editable: true
        })
      }
    })
    console.log(this.data.uploadimgs);

  },
  deleteImg: function (e) {
    console.log(e.currentTarget.dataset.index);
    const imgs = this.data.uploadimgs
    Array.prototype.remove = function (i) {
      const l = this.length;
      if (l == 1) {
        return []
      } else if (i > 1) {
        return [].concat(this.splice(0, i), this.splice(i + 1, l - 1))
      }
    }
    this.setData({
      uploadimgs: imgs.remove(e.currentTarget.dataset.index)
    })


  },
})
