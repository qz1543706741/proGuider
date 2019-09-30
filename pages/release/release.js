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
    showimgs: ["http://www.profguider.cn/bktServer/sTutorImage/tutor0000.jpg"],
    uploadimgs:'',
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
    otherInfo:'',
    departmentList:[]
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
     else {
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
    params.attention=0
    console.log(params)

    // wx.uploadFile({
    //   url: globalUrl +'/UploadTutorImage', //仅为示例，非真实的接口地址  
    //   filePath: that.data.uploadimgs,
    //   name: 'image', //文件对应的参数名字(key)  
    //   formData: {
    //     id:11111,
    //     state:0
    //   },  //其它的表单信息  
    //   header: {
    //     "content-type": "multipart/form-data",  
    //   },
    //   success: function (res) {
    //     if (res.statusCode==500)
    //     console.log("失败");
    //     console.log(res);
    //   } 
    // })

wx.request({
  url: globalUrl + '/UploadTutorImage',
  header: { 'content-type': 'application/x-www-form-urlencoded' },
  method: 'POST',
  data: {
    id:123,
    image:that.data.uploadimgs,
    state:0
  },
  success: function (res) { }
})


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
                showimgs: "http://www.profguider.cn/bktServer/sTutorImage/tutor0000.jpg"
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
    }
  },

  formReset: function () {
    this.setData({
      titleindex: 0,
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
            if (e.zymc.indexOf(prefix) != -1) {
              newSource.push(e)
            } 
          })
          break;
        case "3":
          this.data.majorArray.forEach(function (e) {
            if (e.zymc.indexOf(prefix) != -1) {
              newSource.push(e)
            }
          })
          break;
        case "4":
          this.data.majorArray.forEach(function (e) {
            if (e.zymc.indexOf(prefix) != -1) {
              newSource.push(e)
            }
          })
          break;
        case "5":
          this.data.majorArray.forEach(function (e) {
            if (e.zymc.indexOf(prefix) != -1) {
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
      case "department":
       this.setData({
         departmentName: e.target.dataset.xy,
      })
      break;
      case "school":
      this.setData({
      inputValue: e.target.dataset.id+' '+e.target.dataset.schoolname,
      schoolId: e.target.dataset.id,
      schoolName: e.target.dataset.schoolname
    })
      this.getDepartment();
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
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0], //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调
            _this.setData({
              uploadimgs: res.data
            })
            console.log(_this.data.uploadimgs);
          }
        })
        _this.setData({
          showimgs: res.tempFilePaths,
          editable: true
        })
      }
    })
   
   
  },

  deleteImg: function () {
      this.setData({
        showimgs: ["http://www.profguider.cn/bktServer/sTutorImage/tutor0000.jpg"],
        editable: false
      })
    

  },


  getDepartment: function () {
    var that = this
    that.setData({
      departmentList: []
    })
    wx.request({
      url: globalUrl + '/DepartmentList',
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
          departmentList: res.data
        })
      }

    })
  },

  getDepartmentData:function(){
    this.setData({
      showfilter: true,
      bindSource: this.data.departmentList,
      showfilterindex:0
    })
  }

})
