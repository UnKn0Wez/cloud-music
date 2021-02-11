// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
   env: cloud.DYNAMIC_CURRENT_ENV
})

const TcbRouter = require('tcb-router')
const db = cloud.database()
const blogCollection =db.collection('blog')

// 云函数入口函数
exports.main = async (event, context) => {
   const app = new TcbRouter({
      event
   })
   //获取博客列表数据
   app.router('list',async(ctx,next)=>{
      //获得关键词参数
      const keyword = event.keyword
      let w = {}
      //如果关键词非空，则新建一个规则
      if(keyword.trim() !=''){
         w={
            content:new db.RegExp({
               regexp:keyword,
               options:'i'
            })
         }
      }
      //根据创建时间降序排列分页查询
      let blogList = await blogCollection.where(w).skip(event.start).limit(event.count)
      .orderBy('createTime','desc').get().then((res)=>{
         return res.data
      })
      ctx.body=blogList
   })
   app.router('detail',async(ctx,next)=>{
      let blogId = event.blogId
      const blog = await blogCollection.aggregate().match({
         _id:blogId
      }).lookup({
         from:'blog-comment',
         localField:'_id',
         foreignField:'blogId',
         as:'commentList'
      }).end()
      ctx.body=blog
   })

   //在云端取得微信上下文，从中可以获得openid
   const wxContext=cloud.getWXContext()
   //从小程序端根据openid获取博客列表
   app.router('getListByOpenid',async(ctx,next)=>{
      ctx.body= await blogCollection.where({
         _openid:wxContext.OPENID
      }).skip(event.start).limit(event.count)
      .orderBy('createTime','desc').get().then((res)=>{
         return res.data
      })
   })
   return app.serve()
}