// components/lyric/lyric.js
let lyricHeight = 0
Component({
   /**
    * 组件的属性列表
    */
   properties: {
      isLyricShow: {
         type: Boolean,
         value: false,
      },
      lyric: String,

   },
   observers: {
      lyric(lrc) {
         if (lrc == '暂无歌词') {
            this.setData({
               lyrics: [{
                  lrc,
                  time: 0,
               }],
               nowLyricIndex: -1
            })

         } else {
            this._parseLyric(lrc)
         }
      }
   },

   /**
    * 组件的初始数据
    */
   data: {
      lyrics: [],
      nowLyricIndex: 0,
      scrollTop: 0,
   },
   lifetimes: {
      ready() {
         wx.getSystemInfo({
            success(res) {
               lyricHeight = res.screenWidth / 750 * 64
            }
         })
      }
   },

   /**
    * 组件的方法列表
    */
   methods: {
      update(currentTime) {
         let lrcList = this.data.lyrics
         if (lrcList.length == 0) {
            return
         }
         if (currentTime > lrcList[lrcList.length - 1].time) {
            if (this.data.nowLyricIndex != -1) {
               this.setData({
                  nowLyricIndex: -1,
                  scrollTop: lrcList.length * lyricHeight
               })
            }
         }
         //计算得出每行歌词的滚动位置
         for (let i = 0, len = lrcList.length; i < len; i++) {
            if (currentTime <= lrcList[i].time) {
               this.setData({
                  nowLyricIndex: i - 1,
                  scrollTop: (i - 1) * lyricHeight
               })
               break
            }
         }
      },
      _parseLyric(sLyric) {
         let lines = sLyric.split('\n')
         let _lrcList = []
         lines.forEach((elem) => {
            //匹配出时间
            let time = elem.match(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g)
            // console.log(time)
            if (time != null) {
               //用时间作为分隔符
               let lrc = elem.split(time)[1]
               //正则匹配出时间，分，秒，毫秒
               let timeReg = time[0].match(/(\d{2,}):(\d{2})(?:\.(\d{2,3}))?/)
               // console.log(timeReg)
               //把时间转换成秒
               let time2Seconds = parseInt(timeReg[1]) * 60 + parseInt(timeReg[2]) + parseInt(timeReg[3]) / 1000
               //每行歌词对象包括：歌词内容和这行歌词所在的秒
               _lrcList.push({
                  lrc,
                  time: time2Seconds,
               })
               // console.log(_lrcList)
            }
         })
         this.setData({
            lyrics: _lrcList
         })
      }
   }
})