var app = getApp()
var globalUrl = getApp().globalData.globalUrl
Page({
	data: {
		open: false,
		items: [],
		startX: 0, //开始坐标
		startY: 0,

		delBtnWidth: 180,

	},
	onLoad: function () {
		if (this.data.items.length == 0) {
			this.setData({
				open: true
			})
		} else {
			this.setData({
				open: false
			})
		}
	},

	onShow: function () {
		var openid = wx.getStorageSync("openId")

		let _this = this;
		var params = {
			'userId': openid
		}
		wx.showLoading({
			title: '加载中'
		})
		console.log(params)
		wx.request({
			url: globalUrl + '/GetUserRecord',
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			method: 'POST',
			data: params,
			success: function (res) {
				if (res.data != null && res.data.length > 0) {
					console.log(res.data);
					setTimeout(function () {
						wx.hideLoading()
					}, 500)
					const newlist = [];
					for (var i = 0; i < res.data.length; i++) {
						newlist.push(res.data[i]);
					}

					var list_length = newlist.length
					_this.setData({
						items: newlist,
						open: false
					})
				} else {
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

	goSearch: function (e) {
		var tutorId = e.currentTarget.dataset.params.tutorId
		var that = this;
		if (tutorId != 0) {
			wx.request({
				url: globalUrl + '/GetTutorById',
				//仅为示例，并非真实的接口地址
				data: {
					id: tutorId
				},
				header: {
					'content-type': 'application/x-www-form-urlencoded'
				},
				method: 'POST',
				success: function (res) {
					delete res.data.url;
					wx.navigateTo({
						url: '../../pages/tutordetail/tutordetail?list=' + JSON.stringify(res.data),
					})
				}
			})
		} else {
			wx.navigateTo({
				url: '../../pages/search/search?list=' + JSON.stringify(e.currentTarget.dataset.params)
			})

		}


	},
	/**************/

	drawStart: function (e) {
		// console.log("drawStart");  
		var touch = e.touches[0]
		for (var index in this.data.items) {
			var item = this.data.items[index]
			item.deleteRecordIndex = 0
		}
		this.setData({
			items: this.data.items,
			startX: touch.clientX,
		})

	},
	drawMove: function (e) {
		var touch = e.touches[0]
		var item = this.data.items[e.currentTarget.dataset.index]
		var disX = this.data.startX - touch.clientX

		if (disX >= 20) {
			if (disX > this.data.delBtnWidth) {
				disX = this.data.delBtnWidth
			}
			item.deleteRecordIndex = disX
			this.setData({
				isScroll: false,
				items: this.data.items
			})
		} else {
			item.deleteRecordIndex = 0
			this.setData({
				isScroll: true,
				items: this.data.items
			})
		}
	},
	drawEnd: function (e) {
		var item = this.data.items[e.currentTarget.dataset.index]
		if (item.deleteRecordIndex >= this.data.delBtnWidth / 2) {
			item.deleteRecordIndex = this.data.delBtnWidth
			this.setData({
				isScroll: true,
				items: this.data.items,
			})
		} else {
			item.deleteRecordIndex = 0
			this.setData({
				isScroll: true,
				items: this.data.items,
			})
		}
	},

	delItem: function (e) {
		var recordId = e.currentTarget.dataset.id;
		var openid = wx.getStorageSync("openId");
		var params = {
			'userId': openid,
			'recordId': recordId
		}

		var that = this;
		var list = [];
		wx.showModal({
			title: '提示',
			content: '确认要删除此条信息么？',
			success: function (res) {
				if (res.confirm) {
					console.log('用户点击确定')
					list = that.data.items
					for (var i = 0; i < list.length; i++) {
						if (e.currentTarget.dataset.id == list[i].id) {
							list.splice(i, 1);
						}
					}
					that.setData({
						items: list
					})
					wx.request({
						url: globalUrl + '/DeleteUserRecord',
						data: params,
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
						method: 'POST',
						success: function (res) {
							console.log(res.data);
						}
					})
					wx.showLoading({
						title: '清除成功!'
					})

					setTimeout(function () {
						wx.hideLoading()
					}, 1000)
				} else if (res.cancel) {
					console.log('用户点击取消')
				}
			}
		})
	}
})