//logs.js
var common = require('../../utils/data.js')
var util = require('../../utils/util.js');
var globalUrl = getApp().globalData.globalUrl
Page({
  data: {
    choice:false,
    choices: false,
    select1:0,
    select2: 0,
    select3: 0,
    select4: 0,
    select5: 0,
    list: [], 
    showfilter: false, //是否显示下拉筛选
    showfilterindex: null, //显示哪个筛选类目
    inputValue: '',//点击结果项之后替换到文本框的值
    inputValue1: '',
    inputValue2: '',
    inputValue3: '',
    inputValue4: '',
    schoolArray: [],//本地匹配源
    bindSource: [],//绑定到页面的数据，根据用户输入动态变化
    titleArray: [],
    titleindex: 0,
    majorArray: [],
    uploadimgs: [],

    name: '',
    departmentName: '',
    qq: '',
    email: '',
    phone: '',
    officePhone: '',
    researchField: '',
    introduction: '',
    politicsScore: '',
    foreginScore: '',
    profession1Score: '',
    profession2Score: '',
    lineScore: '',
    request: '',
    schoolId: '',
    schoolName: '',
    majorId1: '',
    majorName1: '',
    majorId2: '',
    majorName2: '',
    majorId3: '',
    majorName3: '',
    majorId: '',
    majorName: '',
    scoreLine: '',
    otherInfo: ''
  },

  onLoad: function (options) {
    this.fetchData()
    this.setData({
      list: JSON.parse(options.list)
    })

    console.log(this.data.list)
    if (this.data.list.sex=='男')
      this.setData({
        choice:true
      })
      else
      this.setData({
        choices: true
      })
    if (this.data.list.title=='教授')
      this.setData({
        titleindex:1
      })
    else if (this.data.list.title == '副教授')
      this.setData({
        titleindex: 2
      })
    else if (this.data.list.title == '讲师')
      this.setData({
        titleindex: 3
      })
      else
      this.setData({
        titleindex: 4
      })

    if (this.data.list.schoolId != '') {
      this.setData({
        inputValue: this.data.list.schoolId + ' ' + this.data.list.schoolName
      })
    }else{
      inputValue:''
    }

    if (this.data.list.majorId1 != '') {
      this.setData({
        inputValue1: this.data.list.majorId1 + ' ' + this.data.list.majorName1
      })
    } else {
      inputValue1: ''
    }

    if (this.data.list.majorId2 != '') {
      this.setData({
        inputValue2: this.data.list.majorId2 + ' ' + this.data.list.majorName2
      })
    } else {
      inputValue2: ''
    }

    if (this.data.list.majorId3 != '') {
      this.setData({
        inputValue3: this.data.list.majorId3 + ' ' + this.data.list.majorName3
      })
    } else {
      inputValue3: ''
    }

    if (this.data.list.require.majorId != '') {
      this.setData({
        inputValue4: this.data.list.require.majorId + ' ' + this.data.list.require.majorName
      })
    } else {
      inputValue4: ''
    }     
  },

  formSubmit: function (e) {
    if (e.detail.value.name == '' || this.data.titleindex == 0 ||e.detail.value.departmentName == '' || e.detail.value.researchField == '') {
      wx.showModal({
        title: '提示',
        content: '请填写必填项',
        showCancel: false
      })
    }
    else{
      // 调用函数时，传入new Date()参数，返回值是日期和时间  
      var releaseDate = util.formatTime(new Date());
      // 再通过setData更改Page()里面的data，动态更新页面的数据  
      var userid = wx.getStorageSync("openId")
      var id=this.data.list.id
      var params = []
      params = e.detail.value
      params.userId = userid
      params.releaseDate = releaseDate
      params.id = id
      params.title = this.data.titleArray[this.data.titleindex]

      if (this.data.select1==1){
        console.log(this.data.schooIdOpen+'++++++++++++++++++++++')
        params.schoolId = ''
        params.schoolName = ''
      }else{
        if (this.data.schoolId == '') {
          params.schoolId = this.data.list.schoolId
          params.schoolName = this.data.list.schoolName
        }
        else {
          params.schoolId = this.data.schoolId
          params.schoolName = this.data.schoolName
        }
      }
      if (this.data.select2 == 2) {
        params.majorId1 = ''
        params.majorName1 = ''
      } else {
        if (this.data.majorId1 == '') {
          params.majorId1 = this.data.list.majorId1
          params.majorName1 = this.data.list.majorName1
        }
        else {
          params.majorId1 = this.data.majorId1
          params.majorName1 = this.data.majorName1
        }
      }

      if (this.data.select3 == 3) {
        params.majorId2 = ''
        params.majorName2 = ''
      } else {
        if (this.data.majorId2 == '') {
          params.majorId2 = this.data.list.majorId2
          params.majorName2 = this.data.list.majorName2
        }
        else {
          params.majorId2 = this.data.majorId2
          params.majorName2 = this.data.majorName2
        }
      }

      if (this.data.select4 == 4) {
        params.majorId3 = ''
        params.majorName3 = ''
      } else {
        if (this.data.majorId3 == '') {
          params.majorId3 = this.data.list.majorId3
          params.majorName3 = this.data.list.majorName3
        }
        else {
          params.majorId3 = this.data.majorId3
          params.majorName3 = this.data.majorName3
        }
      }

      if (this.data.select5 == 5) {
        params.majorId = ''
        params.majorName = ''
      } else {
        if (this.data.majorName == '') {
          params.majorName = this.data.list.require.majorName
          params.majorId = this.data.list.require.majorId
        }
        else {
          params.majorId = this.data.majorId
          params.majorName = this.data.majorName
        }
      }
      console.log(params)

      if (params.name == '' || this.data.titleindex == 0 || params.schoolId == '' || params.schoolName == '' || params.departmentName == '' || params.majorId1 == '' || params.majorName1 == '' || params.researchField == '') {
        wx.showModal({
          title: '提示',
          content: '请填写必填项',
          showCancel: false
        })

      }
else{
      wx.request({
        url: globalUrl + '/UploadTutorInfoForWx',
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        method: 'POST',
        data: params,
        success: function (res) {
          wx.showModal({
            title: '提示',
            content: '修改成功',
            showCancel: false,
            success: function (res) {
              if (res.confirm){
                wx.switchTab({
                  url: '../../pages/my/my'
                })
              }
            }
          })
        },
        fail: function (res) {
          wx.showModal({
            title: '提示',
            content: '修改失败',
            confirmText: '重新修改',
            confirmColor: '#000000',
            showCancel: false
          })
        }
      })
}
    }
  },

  formReset: function () {
    this.setData({
      titleindex: 0
    })
  },

  fetchData: function () {
    this.setData({
      titleArray: ["请选择(必填项)", "教授", "副教授","讲师","其他"],
      schoolArray: common.filterdata.school,
      majorArray: common.filterdata.major,
      bindSource1: []
    })
  },

  bindPickerChange: function (e) { //下拉选择
    const eindex = e.detail.value;
    const name = e.currentTarget.dataset.pickername;
    switch (name) {
      case 'title':
        this.setData({
          titleindex: eindex
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
      case "school":
        this.setData({
          inputValue: e.target.dataset.id + ' ' + e.target.dataset.schoolname,
          schoolId: e.target.dataset.id,
          schoolName: e.target.dataset.schoolname
        })
        break;
      case "major1":
        this.setData({
          inputValue1: e.target.dataset.id + ' ' + e.target.dataset.name,
          majorId1: e.target.dataset.id,
          majorName1: e.target.dataset.name
        })
        break;
      case "major2":
        this.setData({
          inputValue2: e.target.dataset.id + ' ' + e.target.dataset.name,
          majorId2: e.target.dataset.id,
          majorName2: e.target.dataset.name
        })
        break;
      case "major3":
        this.setData({
          inputValue3: e.target.dataset.id + ' ' + e.target.dataset.name,
          majorId3: e.target.dataset.id,
          majorName3: e.target.dataset.name
        })
        break;
      case "major":
        this.setData({
          inputValue4: e.target.dataset.id + ' ' + e.target.dataset.name,
          majorId: e.target.dataset.id,
          majorName: e.target.dataset.name
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

  Move:function(e){
    console.log(e)
    console.log(e.target.dataset.findex)
    if (e.target.dataset.findex==1){
      if (e.detail.value=='')
        
      this.setData({
        select1:1
      })
    }
    if (e.target.dataset.findex ==2) {
      if (e.detail.value == '')
        this.setData({
          select2: 2
        })
    }
    if (e.target.dataset.findex == 3) {
      if (e.detail.value == '')
        this.setData({
          select3: 3
        })
    }
    if (e.target.dataset.findex == 4) {
      if (e.detail.value == '')
        this.setData({
          select4: 4
        })
    }
    if (e.target.dataset.findex == 5) {
      if (e.detail.value == '')
        this.setData({
          select5: 5
        })
    }
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
