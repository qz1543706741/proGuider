// pages/enrolllist/enrolllist.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		provinceName: '',
		schoolName: '',
		majorName: '',
		year:'',
    admissionList:'',
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.setData({
			provinceName: JSON.parse(options.provinceName),
			schoolName: JSON.parse(options.schoolName),
			majorName : JSON.parse(options.majorName),
      admissionList: JSON.parse(options.admissionList),
			year: options.year
		})
    console.log(this.data.admissionList);
	}
})