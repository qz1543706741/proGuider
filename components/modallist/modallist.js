// components/modal/modal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: true
    },
    //控制底部是一个按钮还是两个按钮，默认两个
    single: {
      type: Boolean,
      value: false
    },
		//subMajorList:Array
		majorItemSelectedList:Array,
		schoolItemSelectedList:Array
  },

  /**
   * 组件的初始数据
   */

  data: {
    //subMajorList: '',
		majorItemSelectedList: '',
		schoolItemSelectedList: '',
		myText:'123'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击modal的回调函数
    clickMask() {
      // 点击modal背景关闭遮罩层，如果不需要注释掉即可
      this.setData({
        show: false
      })
    },
    // 点击取消按钮的回调函数
    cancel() {
      this.setData({
        show: false
      })
      this.triggerEvent('cancel') //triggerEvent触发事件
    },
    // 点击确定按钮的回调函数
    confirm(e) {
      this.setData({
        show: false,
				//subMajorList: this.properties.subMajorList
				majorItemSelectedList: this.properties.majorItemSelectedList,
				schoolItemSelectedList : this.properties.schoolItemSelectedList
      })
      //this.triggerEvent('schoolTitleSelectEvent',res.data)
			// console.log("this.data.majorItemSelectedList : ")
			// console.log(this.data.majorItemSelectedList)
			// console.log("this.data.schoolItemSelectedList : ")
			// console.log(this.data.schoolItemSelectedList)
			this.triggerEvent('myConfirm')
    }

  }
})