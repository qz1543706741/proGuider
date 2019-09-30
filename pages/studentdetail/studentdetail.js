// pages/studentdetail/studentdetail.js
var common = require('../../utils/data.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    province:'',
    provinceName:'',
    provincelist:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      list: JSON.parse(options.list),

    })
    this.setData({
      province: this.data.list.province
    })
    this.fetchFilterData();

  console.log(options.list)
  },

  fetchFilterData: function () { //获取筛选条件
    this.setData({
      provincelist: common.filterdata.province
    })
    console.log(this.data.provincelist)
    for (var i = 0; i < this.data.provincelist.length; i++) {
      if (this.data.provincelist[i].id == this.data.province){
        this.setData({
          provinceName: this.data.provincelist[i].title
        })
        break
      }
    }

  },
})