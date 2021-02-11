// pages/player/player.js
const app =getApp()
const getBackgroundAudioManager = wx.getBackgroundAudioManager()
let musiclist = []
//用于记录当前播放歌曲index
let playingIndex = 0

Page({
  /**
   * 页面的初始数据
   */
  data: {
    picUrl: '',
    isPlaying: false,
    name:'',
    writer:'',
    isLyricShow : false,
    lyric : '传给歌词组件的歌词',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    // console.log(options.musicId,typeof(options.musicId))
    playingIndex = options.index
    musiclist = wx.getStorageSync('musiclist')
    this._loadMusicDetail(options.musicId)
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

  },
  fanhui() {
    wx.navigateBack({
      delta: 1,
    })
  },
  togglePlaying() {
    if (this.data.isPlaying) {
      getBackgroundAudioManager.pause()
    } else {
      getBackgroundAudioManager.play()
    }
    this.setData({
      isPlaying: !this.data.isPlaying
    })
  },

  _loadMusicDetail(musicId) {
    let music = musiclist[playingIndex]
    console.log(music)
    wx.setNavigationBarTitle({
      title: music.name,
    })
    this.setData({
      picUrl: music.al.picUrl,
      name:music.al.name,
      writer:music.ar[0].name
    })
    wx.cloud.callFunction({
      name: 'music',
      data: {
        musicId,
        $url: 'musicUrl',
      }
    }).then((res) => {
      console.log(res)
      const url = res.result.data[0].url
      if (url === null) {
        wx.showToast({
          title: '没有权限播放',
        })
        getBackgroundAudioManager.pause()
        this.setData({
          isPlaying: false
        })
        return
      }
      getBackgroundAudioManager.src = url
      getBackgroundAudioManager.title = music.name
      getBackgroundAudioManager.coverImgUrl = music.al.picUrl
      getBackgroundAudioManager.singer = music.ar[0].name
      //保存播放历史
      this.savePlayHistory()
      this.setData({
        isPlaying: true
      })
      wx.hideLoading()
      //请求歌词
      wx.cloud.callFunction({
        name :'music',
        data :{
          //方法传入的就有musicId
          musicId,
          $url : 'lyric',
        }
      }).then((res) =>{
        // console.log(res)
        let lyric = '暂无歌词'
        const lrc = res.result.lrc
        if(lrc){
          lyric = lrc.lyric
        }
        this.setData({
          lyric
        })
      })
    })
  },
  onLyricShow(){
    this.setData({
      isLyricShow: !this.data.isLyricShow
    })
  },
  timeUpdate(event){
    this.selectComponent('.lyric').update(event.detail.currentTime)
  },
  onPrev() {
    playingIndex--
    if (playingIndex < 0) {
      playingIndex = musiclist.length - 1
    }
    this._loadMusicDetail(musiclist[playingIndex].id)

  },
  onNext() {
    playingIndex++
    if (playingIndex === musiclist.length) {
      playingIndex = 0
    }
    this._loadMusicDetail(musiclist[playingIndex].id)
  },
  //保存播放历史
  savePlayHistory(){
    //当前正在播放的歌曲
    const music = musiclist[playingIndex]
    const openid = app.globalData.openid
    console.log(">>>>>>>>>>>>>>>>>"+openid)
    //根据用户openid取出本地存储
    const history = wx.getStorageSync(openid)
    //本地是否已经保存了当前歌曲
    let bHave = false
    //遍历本地存储，和当前歌曲对比
    for(let i = 0,len=history.length;i<len;i++){
      //已经存在，则结束循环
      if(history[i].id==music.id){
        bHave=true
        break
      }
    }
    //遍历完毕不存在
    if(!bHave){
      //将当前歌曲加入历史记录头部
      history.unshift(music)
      //更新本地存储(异步)
      wx.setStorage({
        key:openid,
        data:history,
      })
    }
  }

})