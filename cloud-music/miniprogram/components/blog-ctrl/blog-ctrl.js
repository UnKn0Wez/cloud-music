let userInfo={}
const db =wx.cloud.database()
Component({
   /**
    * 组件的属性列表
    */
   properties: {
      blogId:String,
      blog:Object,
   },
   options:{
      styleIsolation:'apply-shared',
   },

   /**
    * 组件的初始数据
    */
   data: {
      loginShow:false,
      modalShow:false,
      content:'',
   },

   /**
    * 组件的方法列表
    */
   methods: {
      onInput(event){
         this.setData({
            content:event.detail.value
         })
      },
      onComment(){
         wx.getSetting({
            success:(res)=>{
               if(res.authSetting['scope.userInfo']){
                  wx.getUserInfo({
                     success:(res)=>{
                        userInfo=res.userInfo
                        this.setData({
                           modalShow:true,
                        })
                     }
                  })
               }else{
                  this.setData({
                     loginShow:true,
                  })
               }
            }
         })
      },
      onLoginsuccess(event){
         userInfo=event.detail
         this.setData({
            loginShow:false,
         },()=>{
            this.setData({
               modalShow:true,
            })
         })
      },
      onloginFail(){
         wx.showModal({
           title:'授权用户才能进行评论',
           content:'',
         })
      },
      onSend(event){
         //评论内容插入数据库
         let content = this.data.content
         if(content.trim() == ''){
            wx.showModal({
               title:'评论内容不能为空',
               content:'',
            })
            return
         }
         wx.showLoading({
           title: '评论中',
           mask:true,
         })
         //写入内容为评论人昵称、头像、评论内容，使用服务器时间，需要传递当前博客的id
         db.collection('blog-comment').add({
            data:{
               content,
               createTime:db.serverDate(),
               blogId:this.properties.blogId,
               nickName:userInfo.nickName,
               avatarUrl:userInfo.avatarUrl
            }
         }).then((res)=>{
            wx.hideLoading()
            wx.showToast({
              title: '评论成功',
            })
            this.setData({
               modalShow:false,
               content:'',
            })
            //触发父组件刷新评论页面的方法
            this.triggerEvent('refreshCommentList')
         })
      }
   }
})
