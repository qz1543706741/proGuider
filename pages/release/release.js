//logs.js
var common = require('../../utils/data.js')
var util = require('../../utils/util.js'); 
var globalUrl = getApp().globalData.globalUrl
Page({
  data: {
    showfilter: false, //是否显示下拉筛选
    showfilterindex: null, //显示哪个筛选类目
    inputValue: '',//点击结果项之后替换到文本框的值
    inputValue1:'',
    inputValue2: '',
    inputValue3: '',
    inputValue4: '',
    schoolArray: [],//本地匹配源
    bindSource: [],//绑定到页面的数据，根据用户输入动态变化
    titleArray: [],
    titleindex: 0,
    majorArray:[],
    uploadimgs: ["../../images/solar-system.png"],

    name:'',
    departmentName:'',
    qq:'',
    email:'',
    phone:'',
    officePhone:'',
    researchField:'',
    introduction:'',
    politicsScore:'',
    foreginScore:'',
    profession1Score: '',
    profession2Score: '',
    lineScore:'',
    request:'',
    schoolId:'',
    schoolName:'',
    majorId1:'',
    majorName1:'',
    majorId2: '',
    majorName2: '',
    majorId3: '',
    majorName3: '',
    majorId: '',
    majorName: '',
    scoreLine:'',
    otherInfo:''
  },
  onLoad: function () {
    this.fetchData()
  },

  formSubmit: function (e) {
    var that=this
    if (e.detail.value.name == '' || this.data.titleindex == 0 ||this.data.schoolId == '' || this.data.schoolName == '' || e.detail.value.departmentName == '' || this.data.majorId1 ==''||this.data.majorName1 == '' || e.detail.value.researchField=='' )
    {
      wx.showModal({
        title: '提示',
        content: '请填写必填项',
        showCancel: false
      })
      
  }
  //   else {
    // 调用函数时，传入new Date()参数，返回值是日期和时间  
    var releaseDate = util.formatTime(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据  
    var userid=wx.getStorageSync("openId") 
    var params=[] 
    params= e.detail.value
    params.userId = userid
    params.releaseDate = releaseDate
    params.title = this.data.titleArray[this.data.titleindex]
    params.schoolId = this.data.schoolId
    params.schoolName = this.data.schoolName
    params.majorId1 = this.data.majorId1
    params.majorName1 = this.data.majorName1
    params.majorId2 = this.data.majorId2
    params.majorName2 = this.data.majorName2
    params.majorId3 = this.data.majorId3
    params.majorName3 = this.data.majorName3
    params.majorId = this.data.majorId
    params.majorName = this.data.majorName
    console.log(params)
    console.log(that.data.uploadimgs[0]);
    // wx.uploadFile({
    //   url: globalUrl +'/UploadTutorImage', //仅为示例，非真实的接口地址  
    //   filePath: that.data.uploadimgs[0],
    //   name: 'image', //文件对应的参数名字(key)  
    //  // formData: data,  //其它的表单信息  
    //   header: {
    //     "content-type": "multipart/form-data",  
    //     "content-type": "application/x-www-form-urlencoded"
    //   },
    //   success: function (res) {
    //     if (res.statusCode==500)
    //     console.log("失败");
    //     console.log(res);
    //   } 
    // })

    wx.request({
      url:globalUrl+'/AddTutor',
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
                name:'',
                inputValue: '',//点击结果项之后替换到文本框的值
                inputValue1: '',
                inputValue2: '',
                inputValue3: '',
                inputValue4: '',
                titleindex: 0,
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
                otherInfo: '',
                uploadimgs: ["http://www.profguider.cn/bktServer/sTutorImage/tutor0000.jpg"]
              })
            }
            }
        })
      },
      fail: function (res) {
        wx.showModal({
          title: '提示',
          content: '发布失败',
          confirmText:'重新发布',
          confirmColor:'#000000',
          showCancel:false
        })
      }
    })
  //  }
  },

  formReset: function () {
    this.setData({
      titleindex: 0,
      uploadimgs: ["http://www.profguider.cn/bktServer/sTutorImage/tutor0000.jpg"]
    })
  },

  fetchData: function () {
    this.setData({
      titleArray: ["请选择(必填项)", "教授","副教授","讲师","其他"],
      schoolArray: common.filterdata.school,
      majorArray: common.filterdata.major,
      bindSource1:[]
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
      switch(name){
        case "1":
         this.data.schoolArray.forEach(function (e) {
          if (e.schoolName.indexOf(prefix) != -1) {
          newSource.push(e)
          }})
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
    var name=e.target.dataset.itemname;
    switch(name){
      case "school":
      this.setData({
      inputValue: e.target.dataset.id+' '+e.target.dataset.schoolname,
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
    if (e.currentTarget.dataset.index==[]){
      this.setData({
        uploadimgs: ["http://www.profguider.cn/bktServer/sTutorImage/tutor0000.jpg"],
        editable: false
      })
    }

  },
})
