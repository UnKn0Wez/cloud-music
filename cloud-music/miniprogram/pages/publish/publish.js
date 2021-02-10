//输入文字最大的个数
const MAX_WORDS_NUM = 140
//最大上传图片数量
const MAX_IMG_NUM = 9
//引入云数据库
const db = wx.cloud.database()
//輸入的文字內容
let content = ''
//用户信息
let userInfo = {}
Page({

   /**
    * 页面的初始数据
    */
   data: {
      //输入的文字个数
      wordsNum: 0,
      //发布操作区离底部距离
      footerBottom: 10,
      //选择的图片数组
      images: [],
      //添加图片的元素是否显示
      selectPhoto: true,
   },

   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function (options) {
      console.log(options)
      userInfo = options
   },
   onInput(event) {
      // console.log(event.detail.value)
      let wordsNum = event.detail.value.length
      if (wordsNum >= MAX_WORDS_NUM) {
         wordsNum = `最大字数为${MAX_WORDS_NUM}`
      }
      this.setData({
         wordsNum
      })
      content = event.detail.value
   },
   onFocus(event) {
      console.log(event)
      this.setData({
         footerBottom: event.detail.height,
      })
   },
   onBlur() {
      this.setData({
         footerBottom: 10,
      })
   },
   onChooseImage() {
      let max = MAX_IMG_NUM - this.data.images.length
      // console.log(max)
      wx.chooseImage({
         count: max,
         sizeType: ['original', 'compressed'],
         sourceType: ['album', 'camera'],
         success: (res) => {
            console.log(res)
            this.setData({
               images: this.data.images.concat(res.tempFilePaths)
            })
            //还能再选几张图片
            max = MAX_IMG_NUM - this.data.images.length
            console.log('>>>>>>' + max)
            //根据max的值决定是否显示选择图片的元素
            this.setData({
               selectPhoto: max <= 0 ? false : true
            })
         }
      })
   },
   onPreviewImage(event) {
      wx.previewImage({
         urls: this.data.images,
         current: event.target.dataset.imgsrc,
      })
   },
   onDelImage(event) {
      this.data.images.splice(event.target.dataset.index, 1)
      this.setData({
         images: this.data.images,
      })
      if (this.data.images.length === MAX_IMG_NUM - 1) {
         this.setData({
            selectPhoto: true,
         })
      }
   },
   fanhui() {
      wx.navigateBack({
        delta: 1,
      })
    },
   send() {
      //发布流程
      //图片-> 云存储 fileID 云文件ID
      //数据-> 云数据库
      //数据库包括:内容、图片fileID、openid、昵称、头像、时间
      //openid从小程序端操作云数据库可以自动获得，时间可以获取数据库服务器时间

      //1、判断是否有输入内容
      if (content.trim() === '') {
         wx.showModal({
            title: '请输入内容',
            content: '',
         })
         return
      }
      //2、加载动画
      wx.showLoading({
         title: '发布中',
         mask: true
      })
      //3、上传文件
      let promiseArr = []
      let fileIds = []
      for (let i = 0, len = this.data.images.length; i < len; i++) {
         let p = new Promise((resolve, reject) => {
            //从数据中取出当前需要上传的文件
            let item = this.data.images[i]
            let suffix = /\.\w+$/.exec(item)[0]
            console.log(suffix)
            wx.cloud.uploadFile({
               cloudPath: 'blog/' + Date.now() + '-' + Math.random() * 1000000 + suffix,
               filePath: item,
               // header: {}, // 设置请求的 header
               // formData: {}, // HTTP 请求中其他额外的 form data
               success: (res) => {
                  console.log(res.fileID)
                  fileIds = fileIds.concat(res.fileID)
                  resolve()
               },
               fail: (err) => {
                  console.error(err);
                  reject()
               }
            })
         })
         //将异步任务推入异步任务数组
         promiseArr.push(p)
      }

      //存入到云数据库
      Promise.all(promiseArr).then((res)=>{
         db.collection('blog').add({
            data:{
               ...userInfo,
               content,
               imgs:fileIds,
               createTime:db.serverDate(),
            }
         }).then((res)=>{
            console.log(res)
            wx.hideLoading()
            wx.showToast({
               title:'发布成功'
            })
            wx.navigateBack()
            const pages = getCurrentPages()
            const prevPage = pages[pages.length-2]
            prevPage.onPullDownRefresh()
         }).catch((err)=>{
            wx.hideLoading()
            wx.showToast({
               title:'发布失败'
            })
         })
      })
   },

   /**
    * 生命周期函数--监听页面初次渲染完成
    */
   onReady: function () {

   },

   /**
    * 生命周期函数--监听页面显示
    */
   onShow: function () {

   },

   /**
    * 生命周期函数--监听页面隐藏
    */
   onHide: function () {

   },

   /**
    * 生命周期函数--监听页面卸载
    */
   onUnload: function () {

   },

   /**
    * 页面相关事件处理函数--监听用户下拉动作
    */
   onPullDownRefresh: function () {

   },

   /**
    * 页面上拉触底事件的处理函数
    */
   onReachBottom: function () {

   },

   /**
    * 用户点击右上角分享
    */
   onShareAppMessage: function () {

   }
})