var app = getApp()
var globalUrl = getApp().globalData.globalUrl
Page({
  data: {
    open: false,
    items: [],
    startX: 0, //开始坐标
    startY: 0
  },
  onLoad: function () {
    if (this.data.items.length == 0) {
      this.setData({
        open: true
      })
    }
    else {
      this.setData({
        open: false
      })
    }

  },

  onShow: function () {
    var openid = wx.getStorageSync("openId")
    console.log("++++++++++++++++++++" + openid)
    let _this = this;
    var params = {
      'userId': openid
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
            isTouchMove: false
          }
          _this.setData({
            items: newlist.reverse(),
            open: false
          })
        }
        else {
          setTimeout(function () {
            wx.hideLoading()
          }, 500)
          _this.setData({
            open: true
          })
        }

      }
    })

  },
  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.items.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      items: this.data.items
    })
  },
  //滑动事件处理
  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,//当前索引
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    that.data.items.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      items: that.data.items
    })
  },
  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  //删除事件
  del: function (e) {
    let that = this
    console.log(e)
    var id = e.currentTarget.dataset.id
    console.log(id)
    var index = e.currentTarget.dataset.index
    wx.showModal({
      title: '提示',
      content: '确定删除？',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          that.data.items.splice(index, 1)
          that.setData({
            items: that.data.items
          })
          console.log("====================")
          wx.request({
            url: globalUrl + '/DeleteTutorById',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            method: 'POST',
            data: {
              "id": id
            },
            success: function (res) {
              if (that.data.items.length == 0) {
                that.setData({
                  open: true
                })
              }
              else {
                that.setData({
                  open: false
                })
              }
            }
          })

        }
      }
    })




  },

  edit: function (e) {
    var a = []
    a.tutor = { 'name': 'name', 'sex': "男" }
    a.id = '10000'
    console.log(a);
  },



  gotutordetail: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id
    var title = e.currentTarget.dataset.title
    var tutordetail = ''

    wx.request({
      url: globalUrl + '/GetTutorById',
      //仅为示例，并非真实的接口地址
      data: {
        id: id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        delete res.data.url;
        console.log(res.data)
        if (title == "search") {
          wx.navigateTo({
            url: '../../pages/tutordetail/tutordetail?list=' + JSON.stringify(res.data),
          })
        }
        if (title == "edit") {
          wx.navigateTo({
            url: '../../pages/alter/alter?list=' + JSON.stringify(res.data),
          })
        }
      },
      fail: function (res) {
        if (title == "search") {
          wx.navigateTo({
            url: '../../pages/tutordetail/tutordetail',
          })
        }
        if (title == "edit") {
          wx.navigateTo({
            url: '../../pages/alter/alter',
          })
        }

      }
    })
  },

})

