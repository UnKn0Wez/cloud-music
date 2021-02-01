// components/progress-bar/progress-bar.js
let movableAreaWidth = 0 //可移动区域的宽度
let movableViewWidth = 0 //移动元素的宽度
const backgroundAutioManager = wx.getBackgroundAudioManager()
let currentSec = -1 //当前的秒数
let duration = 0 //歌曲总时长
let isMoving = false //表示当前进度条是否在拖拽
Component({
   /**
    * 组件的属性列表
    */
   properties: {

   },

   /**
    * 组件的初始数据
    */
   data: {
      showTime: {
         currentTime: '00:00',
         totalTime: '00:00',
      },
      distance: 0,
      progress: 0
   },
   lifetimes: {
      ready() {
         this._bindBGMEvent()
         this._getDistance()
      }
   },

   /**
    * 组件的方法列表
    */
   methods: {
      //滑动视图对象发生改变
      onChange(event) {
         //判定事件源(引起滑动变化的原因：有自身播放进度变化和拖动两种)
         if (event.detail.source == 'touch') {
            this.data.progress = event.detail.x / (movableAreaWidth - movableViewWidth) * 100
            this.data.distance = event.detail.x
            isMoving = true
            console.log(isMoving)
         }
      },
      onTouchEnd() {
         const currentTimeFmt = this._timeFormat(Math.floor(backgroundAutioManager.currentTime))
         this.setData({
            progress: this.data.progress,
            distance: this.data.distance,
            ['showTime.currentTime']: currentTimeFmt.min + ':' + currentTimeFmt.sec
         })
         //定位歌曲播放位置
         isMoving =false
         backgroundAutioManager.seek(duration * this.data.progress / 100)
         console.log(isMoving)
      },
      _getDistance() {
         const query = this.createSelectorQuery()
         query.select('.movable-area').boundingClientRect()
         query.select('.movable-view').boundingClientRect()
         query.exec((rect) => {
            console.log(rect)
            movableAreaWidth = rect[0].width
            movableViewWidth = rect[1].width
         })
      },
      _bindBGMEvent() {
         backgroundAutioManager.onPlay(() => {
            console.log('onPlay')
         })
         backgroundAutioManager.onStop(() => {
            console.log('onStop')
         })
         backgroundAutioManager.onPause(() => {
            console.log('onPause')
         })
         backgroundAutioManager.onWaiting(() => {
            console.log('onWaiting')
         })
         backgroundAutioManager.onCanplay(() => {
            console.log('onCanplay')
            console.log(`歌曲总时长:${backgroundAutioManager.duration}`)
            let duration = backgroundAutioManager.duration
            if (typeof duration != 'undefined') {
               //设置歌曲总时长
               this._setTotalTime()
            } else {
               setTimeout(() => {
                  console.log(`歌曲总时长:${backgroundAutioManager.duration}`)
                  //设置歌曲总时长
                  this._setTotalTime()
               }, 1000)
            }
         })
         backgroundAutioManager.onTimeUpdate(() => {
            // console.log('onTimeUpdate')
            if (!isMoving) {
               const duration = backgroundAutioManager.duration
               const currentTime = backgroundAutioManager.currentTime
               const sec = currentTime.toString().split('.')[0]
               if (sec != currentSec) {
                  // console.log(currentTime)
                  const currentTimeFmt = this._timeFormat(currentTime)
                  this.setData({
                     distance: (movableAreaWidth - movableViewWidth) * currentTime / duration,
                     progress: currentTime / duration * 100,
                     ['showTime.currentTime']: `${currentTimeFmt.min}:${currentTimeFmt.sec}`
                  })
                  currentSec = sec
               }
            }
            // console.log(currentTime)
         })
         backgroundAutioManager.onEnded(() => {
            console.log('onEnded')
            //触发一个时间，父组件中的事件名字
            this.triggerEvent('musicEnd')
         })
      },
      _setTotalTime() {
         duration = backgroundAutioManager.duration
         const durationFmt = this._timeFormat(duration)
         console.log(durationFmt)
         this.setData({
            ['showTime.totalTime']: `${durationFmt.min}:${durationFmt.sec}`
         })
      },
      _timeFormat(sec) {
         const min = Math.floor(sec / 60)
         sec = Math.floor(sec % 60)
         return {
            'min': this._fillZero(min),
            'sec': this._fillZero(sec),
         }
      },
      _fillZero(num) {
         return num < 10 ? '0' + num : num
      }
   }
})