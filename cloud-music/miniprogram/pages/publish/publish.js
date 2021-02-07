// pages/publish/publish.js
const MAX_WORDS_NUM=140
const MAX_IMG_NUM=9
let content=''
let userInfo={}
Page({

   /**
    * 页面的初始数据
    */
   data: {
      //输入的文字个数
      wordsNum:0,
      //发布操作区离底部距离
      footerBottom:10,
      //选择的图片数组
      images:[],
      //添加图片的元素是否显示
      selectPhoto:true,
   },

   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function (options) {
      console.log(options)
      userInfo=options
   },
   onInput(event){
      console.log(event.detail.value)
      let wordsNum=event.detail.value.length
      if(wordsNum>=MAX_WORDS_NUM){
         wordsNum=`最大字数为${MAX_WORDS_NUM}`
      }
      this.setData({
         wordsNum
      })
      content=event.detail.value
   },
   onFocus(event){
      console.log(event)
      this.setData({
         footerBottom:event.detail.height,
      })
   },
   onBlur(){
      this.setData({
         footerBottom:10,
      })
   },
   onChooseImage(){
      let max = MAX_IMG_NUM-this.data.images.length
      console.log(max)
      wx.chooseImage({
         count:max,
         sizeType:['original','compressed'],
         sourceType:['album','camera'],
         success:(res)=>{
            console.log(res)
            this.setData({
               images:this.data.images.concat(res.tempFilePaths)
            })
            //还能再选几张图片
            max =MAX_IMG_NUM-this.data.images.length
            console.log('>>>>>>'+max)
            //根据max的值决定是否显示选择图片的元素
            this.setData({
               selectPhoto:max <=0?false:true
            })
         }
      })
   },
   onPreviewImage(event){
      wx.previewImage({
        urls: this.data.images,
        current:event.target.dataset.imgsrc,
      })
   },
   onDelImage(event){
      this.data.images.splice(event.target.dataset.index,1)
      this.setData({
         images:this.data.images,
      })
      if(this.data.images.length === MAX_IMG_NUM-1){
         this.setData({
            selectPhoto:true,
         })
      }
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