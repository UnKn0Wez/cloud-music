// pages/player/player.js
let musiclist = []
//用于记录当前播放歌曲index
let playingIndex = 0
const getBackgroundAudioManager = wx.getBackgroundAudioManager()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    picUrl: '',
    isPlaying: false,
    name:'',
    writer:'',
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
      writer:music.ar[0].name+' - '+music.name
    })
    wx.cloud.callFunction({
      name: 'music',
      data: {
        musicId,
        $url: 'musicUrl',
      }
    }).then((res) => {
      // console.log(res)
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
      this.setData({
        isPlaying: true
      })
      wx.hideLoading()
    })
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
  }

})